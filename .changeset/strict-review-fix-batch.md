---
"@saasflare/ui": minor
---

Strict-review fix batch — correctness, a11y, and contract repairs across the package.

**Behavioral fix (flagged):** `MultiSelect.closeOnSelect` semantics were inverted relative to the prop name (`true` kept the popover open). The prop now means what it says — `true` closes on each pick — and the default flipped to `false`, so **default behavior is unchanged**. Only consumers who passed `closeOnSelect` explicitly see a change (they previously got the opposite of what the name promised).

Fixes:

- **Button** `variant="shadow"` rendered no shadow (consumed `--btn-shadow`, which was never defined). Now renders a palette-aware OKLCH intent shadow.
- **PALETTES/PaletteId** extended from 20 to all 26 palettes defined in `palettes.css` — adds `saasflare` (house palette), `lavender`, `mint`, `sage`, `sky`, `snow`.
- **useFileDialog** no longer pins first-call `onChange`/`accept`/`multiple`/`capture`/`directory` forever (options re-applied on every `open()`, listener reads a latest-ref) and removes its hidden `<input>` on unmount. Fixes stale validation/callbacks in Dropzone's click path.
- **DataTable** no longer sets `role="button"` on clickable `<tr>` (it destroyed table semantics for screen readers); rows stay focusable with Enter/Space activation and expose `data-clickable`.
- **MultiSelect** chip-remove and clear-all affordances are no longer focusable controls nested inside the trigger `<button>` (invalid interactive nesting); they are mouse-only now, with Backspace on the trigger/empty search input as the keyboard path (trigger Backspace added).
- **NotificationCenter** rows use a stretched-overlay action instead of nesting the mark-as-read `<button>` inside a row `<button>`/`<a>`; unread state is now announced (sr-only text + `Unread:` action label).
- **DatePicker/DateRangePicker** controlled clear works: controlled-ness is latched (writing back the `undefined` emitted on deselect no longer flips the component to uncontrolled), and `value` accepts `null` for controlled-empty.
- **Size axis unified on `"md"`**: Avatar, Switch, NativeSelect, SelectTrigger, Toggle, ToggleGroup, Item, SidebarMenuButton, ThemeModeMultiToggle migrate `"default"` → `"md"` (canonical `Size` scale). `"default"` remains accepted as a deprecated alias.
- **SocialButton** deprecated in favor of `SocialAuthButton`; its conflicting `SocialProvider` type renamed to `SocialButtonProvider` (the package-level `SocialProvider` export is the 16-provider union); hardcoded grays/hex replaced with tokens.
- **SaasflareProvider** no longer crashes on corrupted persisted prefs (`null`/non-object localStorage values normalize to defaults, matching the inline script's defense).
- **snow palette** pins a visible focus ring per mode; **achromatic palette** joins the fixed 5-hue chart override group (charts were collapsing to grayscale).
- Removed duplicate `"use client"` directives (form, use-local-storage); fixed the stale `themes.css` reference in the styles entry docs.
