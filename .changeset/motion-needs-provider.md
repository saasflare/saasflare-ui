---
"@saasflare/ui": patch
---

Render animated components visibly when there is no `SaasflareProvider`.

Animated components render `m.*`, the lazy Motion primitives, which only
animate inside the `LazyMotion` that `SaasflareProvider` installs. Without the
provider they still mounted — at their `initial` state, and stayed there. For
an entrance animation that means `opacity: 0` permanently: a page that is
structurally perfect and completely blank, with nothing logged and nothing
thrown.

`useSaasflareMotion` now treats a missing provider as motion being off. All
twenty-six animated components already branch on that to render plain, static
markup, so they come out visible instead of invisible. Using the design system
without the provider is still a mistake, but it now degrades to "no animation"
rather than "no content".

Found building a marketing site that had `ThemeProvider` but no
`SaasflareProvider`: thirty-one `BlurFade` nodes, every one at opacity 0.
