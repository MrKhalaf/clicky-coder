//
//  leanring_buddyTests.swift
//  leanring-buddyTests
//
//  Created by thorfinn on 3/2/26.
//

import CoreGraphics
import Foundation
import Testing
@testable import leanring_buddy

struct leanring_buddyTests {

    @Test func firstPermissionRequestUsesSystemPromptOnly() async throws {
        let presentationDestination = WindowPositionManager.permissionRequestPresentationDestination(
            hasPermissionNow: false,
            hasAttemptedSystemPrompt: false
        )

        #expect(presentationDestination == .systemPrompt)
    }

    @Test func repeatedPermissionRequestOpensSystemSettings() async throws {
        let presentationDestination = WindowPositionManager.permissionRequestPresentationDestination(
            hasPermissionNow: false,
            hasAttemptedSystemPrompt: true
        )

        #expect(presentationDestination == .systemSettings)
    }

    @Test func knownGrantedScreenRecordingPermissionSkipsTheGate() async throws {
        let shouldTreatPermissionAsGranted = WindowPositionManager.shouldTreatScreenRecordingPermissionAsGrantedForSessionLaunch(
            hasScreenRecordingPermissionNow: false,
            hasPreviouslyConfirmedScreenRecordingPermission: true
        )

        #expect(shouldTreatPermissionAsGranted)
    }

    @Test func pointTagParsingStripsScreenNumberTag() async throws {
        let result = CompanionManager.parsePointingCoordinates(
            from: "that's the login button. [POINT:100,240:login:screen2]"
        )

        #expect(result.spokenText == "that's the login button.")
        #expect(result.coordinate == CGPoint(x: 100, y: 240))
        #expect(result.elementLabel == "login")
        #expect(result.screenNumber == 2)
    }

    @Test func tourStepDecodesNumericOrStringIDs() async throws {
        let decoder = JSONDecoder()

        let numericStep = try decoder.decode(
            TourStep.self,
            from: Data(#"{"id":1,"intent":"show login","navigationHint":"open login","lookFor":"login card"}"#.utf8)
        )
        let stringStep = try decoder.decode(
            TourStep.self,
            from: Data(#"{"id":"step-2","intent":"show oauth","navigationHint":"stay here","lookFor":"oauth buttons"}"#.utf8)
        )

        #expect(numericStep.id == "1")
        #expect(stringStep.id == "step-2")
    }

}
