---
"@saasflare/ui": patch
---

Fix: `intent="neutral"` rendered illegibly on transparent-bg variants of `Button` (soft, outline, ghost, link, glass) and `Badge` (soft, outline) because `--intent` resolved to a light surface color (`--secondary`) and was used as text color. Also fixes a parallel bug where `Button` outline/ghost/link with colored intents rendered white text on white pages.

Adds a third intent token `--intent-text` to `theme.css`. For colored intents it equals `--intent` (no visual change). For neutral it falls back to `--secondary-foreground` (dark gray), so transparent-bg variants stay legible regardless of intent.

Variants updated to use `--intent-text` for text/border colors when the surface is transparent or tinted:
- `Button`: soft, outline, ghost, link, glass
- `Badge`: soft, outline

`solid` and `shadow` variants are unchanged (they correctly use `--intent` for fill and `--intent-fg` for paired text). The `Intent` type and `data-intent` attribute are unchanged.
