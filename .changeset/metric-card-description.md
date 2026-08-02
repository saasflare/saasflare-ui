---
"@saasflare/ui": minor
---

`MetricCard` gains an optional `description` slot — a secondary line under the value, for the context that makes a number actionable: "of 5,000 this cycle", "3 invites pending", "of 50 GB included".

Usage metrics are the common case in a SaaS dashboard and they always carry a denominator. Without this, consumers either folded it into the label ("Credits left of 5,000") or abandoned the component for hand-rolled markup.

Purely additive — omit the prop and the card renders exactly as before.
