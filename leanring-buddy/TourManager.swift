//
//  TourManager.swift
//  leanring-buddy
//
//  Handles externally supplied recap packets for Clicky Recap.
//

import AppKit
import Combine
import Foundation

struct TourPacket: Codable {
    let version: Int
    let packetId: String
    let createdAt: Date
    let expiresAt: Date
    let repoName: String
    let repoPath: String
    let launch: TourLaunch
    let scope: TourScope
    let context: TourContext
    let outline: [TourStep]
}

struct TourLaunch: Codable {
    let kind: TourLaunchKind
    let value: String
    let waitSeconds: Double
}

enum TourLaunchKind: String, Codable {
    case url
    case bundleId
    case none
}

struct TourScope: Codable {
    let description: String
    let commits: [TourCommit]
    let changedFiles: [String]
}

struct TourCommit: Codable {
    let sha: String
    let subject: String
}

struct TourContext: Codable {
    let sessionSummary: String
    let diffExcerpt: String?
}

struct TourStep: Codable, Identifiable {
    let id: String
    let intent: String
    let navigationHint: String
    let lookFor: String

    private enum CodingKeys: String, CodingKey {
        case id
        case intent
        case navigationHint
        case lookFor
    }

    init(id: String, intent: String, navigationHint: String, lookFor: String) {
        self.id = id
        self.intent = intent
        self.navigationHint = navigationHint
        self.lookFor = lookFor
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)

        if let stringID = try? container.decode(String.self, forKey: .id) {
            id = stringID
        } else if let intID = try? container.decode(Int.self, forKey: .id) {
            id = String(intID)
        } else {
            throw DecodingError.dataCorruptedError(
                forKey: .id,
                in: container,
                debugDescription: "Tour step id must be a string or integer."
            )
        }

        intent = try container.decode(String.self, forKey: .intent)
        navigationHint = try container.decode(String.self, forKey: .navigationHint)
        lookFor = try container.decode(String.self, forKey: .lookFor)
    }
}

@MainActor
final class TourManager: ObservableObject {
    private let companionManager: CompanionManager
    private let fileManager = FileManager.default
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()

    private var isCheckingForPendingTour = false
    private var inflightPacketURL: URL?

    init(companionManager: CompanionManager) {
        self.companionManager = companionManager
        self.companionManager.onTourSessionEnded = { [weak self] packet, _ in
            Task { @MainActor in
                self?.archiveInflightPacket(for: packet)
            }
        }
    }

    func startPendingTourIfAvailable() async {
        guard !isCheckingForPendingTour else { return }
        guard !companionManager.isTourActive else { return }

        isCheckingForPendingTour = true
        defer { isCheckingForPendingTour = false }

        do {
            let directories = try ensureTourDirectories()
            let latestPacketURL = directories.root.appendingPathComponent("latest.json")
            guard fileManager.fileExists(atPath: latestPacketURL.path) else { return }

            let packetData = try Data(contentsOf: latestPacketURL)
            let packet: TourPacket
            do {
                packet = try decoder.decode(TourPacket.self, from: packetData)
            } catch {
                try rejectPacket(at: latestPacketURL, in: directories.rejected, fallbackName: "invalid-\(UUID().uuidString).json")
                throw error
            }

            let claimedPacketURL = directories.inflight.appendingPathComponent("\(packet.packetId).json")
            guard !fileManager.fileExists(atPath: claimedPacketURL.path) else {
                try? fileManager.removeItem(at: latestPacketURL)
                return
            }

            try fileManager.moveItem(at: latestPacketURL, to: claimedPacketURL)

            do {
                try validate(packet: packet)
                try await launchTarget(for: packet)
            } catch {
                try rejectPacket(
                    at: claimedPacketURL,
                    in: directories.rejected,
                    fallbackName: "\(packet.packetId)-rejected.json"
                )
                throw error
            }

            inflightPacketURL = claimedPacketURL
            companionManager.startTourSession(packet: packet)
        } catch {
            print("⚠️ TourManager failed to start pending tour: \(error)")
        }
    }

    func startTour(packetURL: URL) async throws {
        let packetData = try Data(contentsOf: packetURL)
        let packet = try decoder.decode(TourPacket.self, from: packetData)
        try validate(packet: packet)
        try await launchTarget(for: packet)
        inflightPacketURL = packetURL
        companionManager.startTourSession(packet: packet)
    }

    private func validate(packet: TourPacket) throws {
        guard packet.version == 1 else {
            throw TourManagerError.unsupportedVersion(packet.version)
        }

        guard !packet.packetId.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            throw TourManagerError.invalidPacket("Packet id is required.")
        }

        guard !packet.context.sessionSummary.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            throw TourManagerError.invalidPacket("Session summary is required.")
        }

        guard !packet.outline.isEmpty && packet.outline.count <= 5 else {
            throw TourManagerError.invalidPacket("Outline must contain between 1 and 5 steps.")
        }

        guard packet.expiresAt > Date() else {
            throw TourManagerError.expiredPacket
        }
    }

    private func launchTarget(for packet: TourPacket) async throws {
        switch packet.launch.kind {
        case .url:
            guard let url = URL(string: packet.launch.value) else {
                throw TourManagerError.invalidPacket("Launch URL is invalid.")
            }
            NSWorkspace.shared.open(url)
        case .bundleId:
            let launched = NSWorkspace.shared.launchApplication(
                withBundleIdentifier: packet.launch.value,
                options: [.default],
                additionalEventParamDescriptor: nil,
                launchIdentifier: nil
            )
            guard launched else {
                throw TourManagerError.invalidPacket("Failed to launch bundle id \(packet.launch.value).")
            }
        case .none:
            break
        }

        let waitSeconds = max(packet.launch.waitSeconds, 0)
        if waitSeconds > 0 {
            try await Task.sleep(nanoseconds: UInt64(waitSeconds * 1_000_000_000))
        }
    }

    private func archiveInflightPacket(for packet: TourPacket) {
        guard let inflightPacketURL else { return }

        do {
            let directories = try ensureTourDirectories()
            let consumedURL = directories.consumed.appendingPathComponent("\(packet.packetId).json")

            if fileManager.fileExists(atPath: consumedURL.path) {
                try fileManager.removeItem(at: consumedURL)
            }

            try fileManager.moveItem(at: inflightPacketURL, to: consumedURL)
            self.inflightPacketURL = nil
            try pruneConsumedPackets(in: directories.consumed, keeping: 5)
        } catch {
            print("⚠️ TourManager failed to archive inflight packet: \(error)")
        }
    }

    private func ensureTourDirectories() throws -> TourDirectories {
        let applicationSupportDirectory = try fileManager.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        let rootDirectory = applicationSupportDirectory
            .appendingPathComponent("Clicky", isDirectory: true)
            .appendingPathComponent("tours", isDirectory: true)
        let inflightDirectory = rootDirectory.appendingPathComponent("inflight", isDirectory: true)
        let consumedDirectory = rootDirectory.appendingPathComponent("consumed", isDirectory: true)
        let rejectedDirectory = rootDirectory.appendingPathComponent("rejected", isDirectory: true)

        try fileManager.createDirectory(at: rootDirectory, withIntermediateDirectories: true, attributes: nil)
        try fileManager.createDirectory(at: inflightDirectory, withIntermediateDirectories: true, attributes: nil)
        try fileManager.createDirectory(at: consumedDirectory, withIntermediateDirectories: true, attributes: nil)
        try fileManager.createDirectory(at: rejectedDirectory, withIntermediateDirectories: true, attributes: nil)

        return TourDirectories(
            root: rootDirectory,
            inflight: inflightDirectory,
            consumed: consumedDirectory,
            rejected: rejectedDirectory
        )
    }

    private func rejectPacket(at packetURL: URL, in rejectedDirectory: URL, fallbackName: String) throws {
        let rejectedURL = rejectedDirectory.appendingPathComponent(fallbackName)
        if fileManager.fileExists(atPath: rejectedURL.path) {
            try fileManager.removeItem(at: rejectedURL)
        }
        try fileManager.moveItem(at: packetURL, to: rejectedURL)
    }

    private func pruneConsumedPackets(in consumedDirectory: URL, keeping count: Int) throws {
        let packetURLs = try fileManager.contentsOfDirectory(
            at: consumedDirectory,
            includingPropertiesForKeys: [.contentModificationDateKey],
            options: [.skipsHiddenFiles]
        )

        let sortedPacketURLs = try packetURLs.sorted {
            let lhsValues = try $0.resourceValues(forKeys: [.contentModificationDateKey])
            let rhsValues = try $1.resourceValues(forKeys: [.contentModificationDateKey])
            return (lhsValues.contentModificationDate ?? .distantPast) > (rhsValues.contentModificationDate ?? .distantPast)
        }

        for url in sortedPacketURLs.dropFirst(count) {
            try fileManager.removeItem(at: url)
        }
    }
}

private struct TourDirectories {
    let root: URL
    let inflight: URL
    let consumed: URL
    let rejected: URL
}

enum TourManagerError: LocalizedError {
    case unsupportedVersion(Int)
    case invalidPacket(String)
    case expiredPacket

    var errorDescription: String? {
        switch self {
        case .unsupportedVersion(let version):
            return "Unsupported tour packet version: \(version)."
        case .invalidPacket(let message):
            return message
        case .expiredPacket:
            return "Tour packet expired before Clicky could run it."
        }
    }
}
