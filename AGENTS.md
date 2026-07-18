# AGENTS

## Project

- Name: `GarpAr`
- Stack: Expo + React Native + React Native Web
- Targets: Web, Android, iOS
- Purpose: Split the cost of a gathering, track attendees, expenses, and how each attendee paid.

## Product Rules

- Keep the people list persistent across app launches.
- Keep only the current session persistent; reset the session when the day changes.
- No backend and no real-time sync.
- Device-to-device sharing is done manually through QR import/export.
- The UI should stay simple, fast, and optimized for phone use first.

## Technical Notes

- Main entry point: `App.js`
- Shared UI components live in `src/components`
- Persistence helpers live in `src/storage`
- Business logic lives in `src/utils`
- Constants live in `src/constants`
- Shared styles live in `src/styles`
- Web static assets live in `public`

## Persistence

- Native platforms use AsyncStorage.
- Web persists through the web storage backend used by AsyncStorage.
- Current storage keys are still based on the legacy prefix `garpapp` to avoid breaking existing saved data.

## Working Rules

- Prefer small, scoped changes that follow the current structure.
- Do not add a backend unless explicitly requested.
- Preserve compatibility with web, Android, and iOS for every feature change.
- When changing branding, distinguish between visible app name changes and internal package or bundle identifier changes.
- When changing icons for native builds, update generated native launcher assets if the native folders are committed.
