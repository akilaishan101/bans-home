# BANS Home — Product Requirements

## 1. Product goal

Give one Sri Lankan household a simple, shared view of what is at home, what will expire, what should be bought, and how much the family is spending. It must be comfortable for elderly users while still useful to younger family members.

## 2. Users and platforms

- Balasuriya (father): Android.
- Nimali (mother): Android.
- Akila: iPhone through an installable PWA.
- Shehan: iPhone through an installable PWA.
- No personal accounts in the initial family version.
- Each installation has a unique device ID and a friendly device name. Every mutation records device ID, device name, and timestamp.
- Currency: LKR. Languages: English and Sinhala.

## 3. Core inventory requirements

Each stock entry must support:

- product name, category, quantity, unit, and minimum desired quantity;
- pantry/fridge/freezer/other location;
- purchase date, unit/total purchase price, and optional receipt reference; do not store a supermarket against each inventory item;
- printed expiry/best-before date, or a lifetime such as 14 days, 3 months, or 2 years;
- opened date and “use within N days after opening” override;
- available, consumed, wasted, or donated status;
- created/last-edited device and timestamp;
- optional barcode and product photo in a later milestone.

Fast actions must include add, edit, increase/decrease quantity, mark opened, mark consumed, mark wasted, and add to a shopping list.

## 4. Expiry and notification requirements

The effective expiry is the earliest applicable date from the printed expiry, expected lifetime, and opened-life rule. Notification timing adapts to the lifetime:

| Effective lifetime | Reminder days before expiry |
|---|---|
| 1–14 days | 3, 1, 0 |
| 15–90 days | 14, 7, 2, 0 |
| 91–365 days | 30, 14, 3, 0 |
| Over 365 days | 90, 30, 7, 0 |

Users may override reminders per item. Notifications must identify the item, remaining time, location, and recommended action. Android uses native local/push notifications; the iPhone PWA uses web push when supported and permitted.

## 5. Shopping requirements

- Create, rename, archive, and duplicate multiple lists.
- Optionally associate a list with Keells, Cargills, Arpico, SPAR, LAUGFS, or another shop.
- Add manual items or add from low-stock, expired, consumed, and recurring-purchase suggestions.
- Record quantity, unit, expected price, preferred brand, notes, and checked/purchased state.
- A checked purchase can create inventory entries with the actual price and expiry information.
- Avoid duplicate suggestions already present on an active list.

## 6. Recommendations

Suggestions must begin with transparent rules and improve from household history:

- current quantity at or below minimum;
- usual purchase interval is nearly reached;
- recently consumed/expired/wasted staple;
- seasonal or manually pinned staple;
- suppress items already in stock or on an active list.

Every suggestion must say why it was suggested. Users can dismiss it or choose “do not suggest again.” No opaque AI decision is required for the first production release.

## 7. Prices, spending, and savings

- Compare current/most recent prices from Keells, Cargills, Arpico, SPAR, and LAUGFS where a reliable permitted source exists.
- Use retailer pages only to create initial name suggestions and editable price estimates. Keep source, product match confidence, pack size, captured time, regular price, promotion price, and URL/source ID in the price catalogue rather than on the household inventory item.
- Never compare unlike pack sizes without showing a normalized unit price.
- Label stale or unavailable prices clearly; never invent a price.
- Track actual household spending by day/week/month and category/outcome.
- Show estimated savings against the selected comparison baseline and keep savings separate from unverified estimates.
- Track waste cost and potential savings from items used before expiry.

## 8. Shared household without personal accounts

Production sync uses one household record protected by a long random household key. The first device creates the household; other devices join by scanning a QR code or entering a short-lived invitation code. This avoids personal accounts while keeping the household private.

Required sync behavior:

- offline-first local database on every device;
- encrypted HTTPS synchronization when online;
- operation/audit log containing device identity and timestamps;
- deterministic conflict handling, with a visible conflict prompt for incompatible edits;
- deleted records use recoverable tombstones for at least 30 days;
- encrypted export/backup and household reset controls;
- a lost device can be removed from the household device list.

## 9. Accessibility and elderly-friendly behavior

- Minimum 48×48 dp touch targets and large default text.
- Plain labels with icons; icons must not be the only explanation.
- High contrast, restrained color use, and no color-only status meaning.
- Critical actions require simple confirmation and offer undo where possible.
- The most common tasks require no more than three taps from Home.
- Sinhala text must render without clipping at large font sizes.
- Optional simplified mode can hide analytics and advanced fields.

## 10. Privacy, reliability, and safety

- Collect only household inventory data required for the feature.
- No advertising identifiers or sale of household data.
- Explain notification, camera, and photo permissions at the moment of use.
- The app must open and allow inventory/shopping work without internet access.
- Automatic backups must never expose the household key in plain text.
- Expiry guidance is informational; users remain responsible for checking food condition and package instructions.

## 11. Delivery milestones

### Milestone A — working prototype (completed)

Android APK/PWA shell, bilingual selection, adaptive expiry engine, local notifications, inventory, multiple lists, basic suggestions, spending views, device stamps, offline storage, and elderly-friendly UI.

### Milestone B — shared family beta

Household QR joining, backend synchronization, conflict handling, backup/restore, richer inventory editing, barcode scanning, full Sinhala copy review, and hosted HTTPS PWA.

### Milestone C — retailer and intelligence beta

Retailer price adapters, normalized comparisons, purchase-history learning, receipt import, notification preferences, price freshness controls, and savings validation.

### Milestone D — production release

Security/privacy review, accessibility testing with parents, migration/recovery tests, signed release APK or Play Store internal distribution, monitoring, and retailer-adapter maintenance plan.

## 12. Acceptance criteria for family beta

1. A change made offline on any joined device appears on all other devices after reconnection and retains the originating device name.
2. An item with a 14-day life and an item with a 2-year life receive different reminder schedules matching the table above.
3. Marking an item purchased updates the selected list, inventory, spending totals, and audit history once—without duplicates.
4. No price is displayed as current when its source is missing, stale, or failed.
5. Father and mother can add an item, find an expiring item, and check a shopping item without assistance in usability testing.
6. English/Sinhala switching does not lose data and all primary screens remain usable at 200% text size.
7. The app remains usable offline and recovers cleanly after a restart or interrupted synchronization.
