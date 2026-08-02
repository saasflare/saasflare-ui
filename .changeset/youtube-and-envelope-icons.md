---
"@saasflare/ui": minor
---

Add `YoutubeLogoIcon` and `EnvelopeIcon`.

The brand set covered fifteen platforms but not YouTube, and it had no
vendor-neutral mail mark at all — `MicrosoftOutlookLogoIcon` was the closest
thing, which is wrong for a `mailto:` link to the user's own address. A social
footer built from the package therefore had to fall back to rendering the
platform's first letter in a circle for exactly those two entries.

`YoutubeLogoIcon` ships the four Phosphor weights plus `weight="colorful"` for
the official red play button, matching every other brand mark.
