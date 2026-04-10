//
//  ElevenLabsTTSClient.swift
//  leanring-buddy
//
//  Streams text-to-speech audio from ElevenLabs and plays it back
//  through the system audio output. Uses the streaming endpoint so
//  playback begins before the full audio has been generated.
//

import AVFoundation
import Foundation

@MainActor
final class ElevenLabsTTSClient: NSObject, AVAudioPlayerDelegate {
    private let proxyURL: URL
    private let session: URLSession

    /// The audio player for the current TTS playback. Kept alive so the
    /// audio finishes playing even if the caller doesn't hold a reference.
    private var audioPlayer: AVAudioPlayer?
    private var playbackContinuation: CheckedContinuation<Void, Error>?

    init(proxyURL: String) {
        self.proxyURL = URL(string: proxyURL)!

        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        self.session = URLSession(configuration: configuration)
        super.init()
    }

    /// Sends `text` to ElevenLabs TTS and plays the resulting audio.
    /// Resolves only after playback finishes or is cancelled.
    func speak(_ text: String, onPlaybackStarted: (() -> Void)? = nil) async throws {
        stopPlayback()

        var request = URLRequest(url: proxyURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("audio/mpeg", forHTTPHeaderField: "Accept")

        let body: [String: Any] = [
            "text": text,
            "model_id": "eleven_flash_v2_5",
            "voice_settings": [
                "stability": 0.5,
                "similarity_boost": 0.75
            ]
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NSError(domain: "ElevenLabsTTS", code: -1,
                          userInfo: [NSLocalizedDescriptionKey: "Invalid response"])
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            let errorBody = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NSError(domain: "ElevenLabsTTS", code: httpResponse.statusCode,
                          userInfo: [NSLocalizedDescriptionKey: "TTS API error (\(httpResponse.statusCode)): \(errorBody)"])
        }

        try Task.checkCancellation()

        let player = try AVAudioPlayer(data: data)
        player.delegate = self
        self.audioPlayer = player
        try await withTaskCancellationHandler {
            try await withCheckedThrowingContinuation { continuation in
                self.playbackContinuation = continuation
                let didStartPlayback = player.play()
                guard didStartPlayback else {
                    self.playbackContinuation = nil
                    self.audioPlayer = nil
                    continuation.resume(throwing: NSError(
                        domain: "ElevenLabsTTS",
                        code: -2,
                        userInfo: [NSLocalizedDescriptionKey: "Failed to start audio playback"]
                    ))
                    return
                }

                print("🔊 ElevenLabs TTS: playing \(data.count / 1024)KB audio")
                onPlaybackStarted?()
            }
        } onCancel: {
            Task { @MainActor in
                self.stopPlayback()
            }
        }
    }

    /// Whether TTS audio is currently playing back.
    var isPlaying: Bool {
        audioPlayer?.isPlaying ?? false
    }

    /// Stops any in-progress playback immediately.
    func stopPlayback() {
        audioPlayer?.stop()
        audioPlayer = nil
        resolvePlaybackContinuation(with: CancellationError())
    }

    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        audioPlayer = nil
        if flag {
            resolvePlaybackContinuation()
        } else {
            resolvePlaybackContinuation(
                with: NSError(
                    domain: "ElevenLabsTTS",
                    code: -3,
                    userInfo: [NSLocalizedDescriptionKey: "Audio playback ended unsuccessfully"]
                )
            )
        }
    }

    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        audioPlayer = nil
        resolvePlaybackContinuation(
            with: error ?? NSError(
                domain: "ElevenLabsTTS",
                code: -4,
                userInfo: [NSLocalizedDescriptionKey: "Audio decoding failed"]
            )
        )
    }

    private func resolvePlaybackContinuation(with error: Error? = nil) {
        guard let playbackContinuation else { return }
        self.playbackContinuation = nil

        if let error {
            playbackContinuation.resume(throwing: error)
        } else {
            playbackContinuation.resume()
        }
    }
}
