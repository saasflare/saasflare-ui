---
"@saasflare/ui": patch
---

Fix: light-mode `--secondary` was nearly invisible against white backgrounds. Lightness dropped from 0.965 → 0.92 (and chroma multiplier bumped 1× → 1.5× to inherit a hint of palette warmth). Secondary buttons, badges, and `bg-secondary` surfaces now register as a clearly visible mid-gray fill instead of collapsing into the page.

`--secondary-foreground` is unchanged — still passes WCAG AA against the new fill (~6.8 : 1).

Dark mode, `--muted`, and `--accent` are untouched.
