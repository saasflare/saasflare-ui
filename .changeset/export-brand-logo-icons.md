---
"@saasflare/ui": minor
---

Export the sixteen brand logo icons — `GoogleLogoIcon`, `GithubLogoIcon`, `LinkedinLogoIcon`, `AppleLogoIcon`, `DiscordLogoIcon`, `DribbbleLogoIcon`, `FacebookLogoIcon`, `GitlabLogoIcon`, `MediumLogoIcon`, `MicrosoftOutlookLogoIcon`, `PaypalLogoIcon`, `RedditLogoIcon`, `SlackLogoIcon`, `StripeLogoIcon`, `TiktokLogoIcon`, and `XLogoIcon`.

They have shipped inside the package since the Phosphor icon set landed and are used by `SocialAuthButton`, but were never re-exported from the barrel. Any consumer assembling its own sign-in UI — a login form that needs a provider mark next to a custom button — had to reimplement them or reach into the package internals.

