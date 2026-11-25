# BANS Home

BANS Home is a family inventory and shopping assistant designed for the Balasuriya, Nimali, Akila, and Shehan household. This repository contains the first working Android/PWA prototype.

## Install the Android prototype

1. Copy `BANS-Home-v0.3-debug.apk` to an Android phone.
2. Open the file on the phone and allow **Install unknown apps** for the app used to open it (Files, Chrome, Drive, etc.).
3. Install and open **BANS Home**.
4. Choose the device name, such as **Father's phone** or **Mother's phone**.
5. Open **Settings** and enable expiry notifications.

This is a development-signed APK for family testing, not a Play Store release.

## Included in this prototype

- English and Sinhala interface selection.
- LKR currency with typo-tolerant product suggestions and starter price estimates sourced from public Sri Lankan supermarket pages.
- Inventory with quantity, minimum stock, storage location, purchase date, price, expiry date, expected lifetime, and after-opening lifetime. A supermarket is not stored per item.
- Adaptive expiry timing:
  - up to 14 days: 3 days, 1 day, and expiry day;
  - up to 90 days: 14, 7, 2, and 0 days;
  - up to 1 year: 30, 14, 3, and 0 days;
  - longer than 1 year: 90, 30, 7, and 0 days.
- Android local notifications, refreshed when inventory changes.
- Expired, expiring-soon, and low-stock dashboard.
- Multiple shopping lists, check-off controls, low-stock recommendations, and purchase-pattern starter suggestions.
- Spending summaries by category/outcome plus inventory and waste value.

## Install on an iPhone

Open the live GitHub Pages address in Safari, tap **Share**, then **Add to Home Screen**. The PWA manifest and Apple touch icon make it launch like a standalone app; no Apple Developer account is required.
- Device identity and an audit trail for edits without personal accounts.
- Large touch targets and a simple five-tab layout for elderly family members.
- Offline local storage and installable PWA build for future iPhone deployment.

## Important prototype boundary

Data is currently stored on each device separately. Device names are recorded with edits, but changes do **not yet sync between phones**. Family-wide live sync requires the shared-household backend described in `REQUIREMENTS.md`.

Live supermarket prices are also a production-stage integration. Each supermarket needs a reliable permitted data source (official API/feed where available, otherwise a maintained retailer adapter). The current prototype contains the price fields and UI foundation but does not claim live prices.

The iPhone PWA is deployed automatically from the `main` branch by the included GitHub Pages workflow.

## Development

Prerequisites are installed on this PC: Android Studio, Android SDK, emulator, Node.js dependencies, and Gradle dependencies.

Common commands:

```powershell
npm test
npm run lint
npm run build
npm run android:sync
```

Open the native project with `npm run android:open`. The Android application ID is `lk.bans.home`.

## Verification completed

- Production web/PWA build passes.
- Expiry-rule unit tests pass (3/3).
- Native Android Gradle build passes.
- APK installs successfully in the Android 14 emulator.
- Clean first launch, device setup, and dashboard were visually verified.
