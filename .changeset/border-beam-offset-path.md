---
"@saasflare/ui": patch
---

BorderBeam: the default `borderRadius="inherit"` produced an invalid `offset-path` (`inherit` is not valid inside `rect(... round <radius>)`), so the beam never traced the border — it rendered as a stationary blurred blob at the container's top-left. The path now falls back to the `--radius` token; explicit `borderRadius` values behave as before.
