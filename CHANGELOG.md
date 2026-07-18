# Changelog

All notable changes to this project will be documented in this file.

## 2026-07-18

### Added
- Cross-platform support for web, Android, and iOS from the same Expo codebase.
- Persistent local storage for the group roster and the current session.
- QR export/import flow to share people and the current session between devices.
- PWA assets for the web build, including manifest, favicon, Apple touch icon, and install banner.
- Project documentation files: `CHANGELOG.md` and `AGENTS.md`.

### Changed
- Refactored the app from a single file into modular components, utilities, styles, and storage helpers.
- Updated the UI to a dark theme.
- Reworked attendee sorting so attendees appear first, ordered alphabetically, followed by non-attendees.
- Simplified payment entry with quick actions for full cash and full transfer payments.
- Renamed visible app branding from `GarpApp` to `GarpAr`.

### Fixed
- Android release icon resources updated to match the current app icon.
- Android splash color resources aligned for day and night themes.
- Session handling adjusted to keep only the current day while preserving the people list.
