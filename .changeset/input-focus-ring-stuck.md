---
"@saasflare/ui": patch
---

Fix the focus ring staying painted on `Input` and `Textarea` after blur.

Both components declared `transition-[color,border-color]`. The focus ring is a
`box-shadow` layer, and with `box-shadow` absent from the transition list Chrome
never repaints it away when `:focus-visible` stops matching — `--tw-ring-shadow`
computes back to `0 0 #0000` while the resolved `box-shadow` keeps the ring.

The effect is cumulative and only shows up in use: tab through a form and every
field you have visited keeps a blue ring, so a submitted, reset form looks like
it is still full of validation errors. Every other component in the package
already listed `box-shadow` — these two were the outliers.

Now `transition-[color,box-shadow,border-color]`, matching `Select`.
