# Budget Flow Client API Documentation

## Profile Management

- `switchOrCreateUser()`
  - Input: username from `#userNameInput`
  - Behavior: confirms with user, creates profile if missing, switches active profile, persists to localStorage.

- `deleteProfile(name)`
  - Input: normalized profile name.
  - Behavior: confirms deletion, prevents deleting last remaining profile, rebinds active profile if needed.

- `renderUserProfiles()`
  - Renders profile list and delete actions in settings (`#userProfiles`).

## Theme System

- `setTheme(mode)`
  - Values: `light | dark`
  - Saves per-profile preference.

- `setAccent(accentKey)`
  - Values: `indigo | emerald | rose | amber`
  - Applies predefined accent and clears custom accent.

- `setCustomAccent()`
  - Input: `#customAccent` color.
  - Uses accessibility checks via `BFUtils.isAccessibleAccent(hex)` before saving.

- `applyPrefs()`
  - Reads per-profile `prefs` and applies:
    - `data-theme`
    - `data-accent`
    - CSS variables (`--ac`, `--ac2`, `--ac-bg`, `--ac-sh`) for custom themes.

## Storage Model

All data persists in localStorage under key `bf4`:

```json
{
  "currentUser": "username",
  "profiles": {
    "username": {
      "username": "username",
      "accounts": [],
      "prefs": {
        "theme": "light",
        "accent": "indigo",
        "customAccent": null
      }
    }
  }
}
```

Legacy storage (`{ accounts, prefs }`) is migrated automatically by `BFUtils.migrateState(...)`.

## Error Handling

- Missing/invalid username blocked with alert.
- Profile switch/create and delete requires explicit confirmation.
- Deleting final remaining profile is blocked.
- Custom accent is blocked when contrast accessibility check fails.
- Loan creation validates title, amount, tenure, and due day.
