"use client"

/**
 * @fileoverview SocialAuthButton — provider-branded login buttons.
 * @module packages/ui/components/brand/social-auth-buttons
 * @package ui
 *
 * Thin brand wrapper around {@link StatefulButton}. Adds:
 *   - a provider-locked Phosphor brand-logo icon, weight-aware via
 *     {@link BrandIconWeight} (`regular | bold | fill | duotone | colorful`).
 *     The colorful weight renders the canonical multi-color brand mark; the
 *     other four flow through `useSaasflareProps` like any other icon.
 *   - a default "Continue with {Provider}" label
 *   - auth-screen-friendly defaults (outline / neutral)
 *
 * Inherits everything else from StatefulButton (loading, loadingText, disabled,
 * size, surface, radius, animated, …).
 *
 * @example
 * import { SocialAuthButton, GoogleAuthButton } from "@saasflare/ui";
 *
 * <GoogleAuthButton onClick={signInWithGoogle} loading={pending} loadingText="Signing in…" />
 * <SocialAuthButton provider="github" iconWeight="duotone" label="Sign in with GitHub" />
 * <SocialAuthButton provider="google"  iconWeight="colorful" />   // colored G
 */

import * as React from "react"
import {StatefulButton, type StatefulButtonProps} from "../composed/stateful-button"
import {useSaasflareProps} from "../../providers"
import {
    AppleLogoIcon,
    DiscordLogoIcon,
    DribbbleLogoIcon,
    FacebookLogoIcon,
    GithubLogoIcon,
    GitlabLogoIcon,
    GoogleLogoIcon,
    LinkedinLogoIcon,
    MediumLogoIcon,
    MicrosoftOutlookLogoIcon,
    PaypalLogoIcon,
    RedditLogoIcon,
    SlackLogoIcon,
    StripeLogoIcon,
    TiktokLogoIcon,
    XLogoIcon,
    type BrandIconProps,
    type BrandIconWeight,
} from "../ui/phosphor"

/* ── Provider registry ─────────────────────────────────────────────────── */

const PROVIDERS = [
    "google", "github", "apple", "microsoft", "x", "discord", "facebook",
    "linkedin", "medium", "slack", "reddit", "paypal", "stripe", "gitlab",
    "dribbble", "tiktok",
] as const
type SocialProvider = (typeof PROVIDERS)[number]

const PROVIDER_LABELS: Record<SocialProvider, string> = {
    google: "Google",
    github: "GitHub",
    apple: "Apple",
    microsoft: "Microsoft",
    x: "X",
    discord: "Discord",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    medium: "Medium",
    slack: "Slack",
    reddit: "Reddit",
    paypal: "PayPal",
    stripe: "Stripe",
    gitlab: "GitLab",
    dribbble: "Dribbble",
    tiktok: "TikTok",
}

const PROVIDER_ICONS: Record<SocialProvider, React.ComponentType<BrandIconProps>> = {
    google: GoogleLogoIcon,
    github: GithubLogoIcon,
    apple: AppleLogoIcon,
    microsoft: MicrosoftOutlookLogoIcon,
    x: XLogoIcon,
    discord: DiscordLogoIcon,
    facebook: FacebookLogoIcon,
    linkedin: LinkedinLogoIcon,
    medium: MediumLogoIcon,
    slack: SlackLogoIcon,
    reddit: RedditLogoIcon,
    paypal: PaypalLogoIcon,
    stripe: StripeLogoIcon,
    gitlab: GitlabLogoIcon,
    dribbble: DribbbleLogoIcon,
    tiktok: TiktokLogoIcon,
}

/* ── Component ─────────────────────────────────────────────────────────── */

/**
 * Props for {@link SocialAuthButton}. Inherits {@link StatefulButtonProps},
 * but widens `iconWeight` to {@link BrandIconWeight} so the colored brand
 * variant can be requested per-instance.
 *
 * The visible label is resolved with the precedence:
 *   `children` > `label` > `"Continue with {Provider}"`
 */
interface SocialAuthButtonProps extends Omit<StatefulButtonProps, "iconWeight"> {
    /** Identity provider — drives icon and default label. */
    provider: SocialProvider
    /** Override the visible label. Default: "Continue with {Provider}". */
    label?: React.ReactNode
    /**
     * Icon weight. Accepts the four Phosphor weights (theme-aware via the
     * Saasflare provider chain) plus the brand-locked `"colorful"` variant.
     */
    iconWeight?: BrandIconWeight
}

/**
 * Generic provider-branded auth button.
 *
 * Defaults: `variant="outline"` `intent="neutral"`.
 *
 * The Phosphor weights (`regular | bold | fill | duotone`) inherit from
 * `<SaasflareProvider iconWeight="…">` via {@link useSaasflareProps}; the
 * `colorful` weight is opt-in per-instance and bypasses the provider chain
 * because brand colors are not themable.
 *
 * @component
 * @layer brand
 */
function SocialAuthButton({
    provider,
    label,
    variant = "outline",
    intent = "neutral",
    fullWidth = false,
    surface,
    radius,
    animated,
    iconWeight,
    children,
    ...rest
}: SocialAuthButtonProps) {
    const isColorful = iconWeight === "colorful"
    // Don't pass "colorful" into the resolver — it only knows Phosphor weights.
    const sf = useSaasflareProps({
        surface,
        radius,
        animated,
        iconWeight: isColorful ? undefined : iconWeight,
    })
    const hasChildren = children !== undefined && children !== null && children !== ""
    const text = hasChildren ? children : (label ?? `Continue with ${PROVIDER_LABELS[provider]}`)

    const Icon = PROVIDER_ICONS[provider]
    const resolvedWeight: BrandIconWeight = isColorful ? "colorful" : sf.iconWeight

    return (
        <StatefulButton
            data-provider={provider}
            data-icon-weight={resolvedWeight}
            variant={variant}
            intent={intent}
            fullWidth={fullWidth}
            surface={sf.surface}
            radius={sf.radius}
            animated={sf.animated}
            iconWeight={sf.iconWeight}
            {...rest}
        >
            <Icon weight={resolvedWeight} className="size-4" />
            {text}
        </StatefulButton>
    )
}

/* ── Convenience exports ──────────────────────────────────────────────────
 * Pre-bound shortcuts so consumers can avoid the `provider="…"` prop.
 * ────────────────────────────────────────────────────────────────────────── */

type ProviderShortcutProps = Omit<SocialAuthButtonProps, "provider">

/** Pre-bound {@link SocialAuthButton} for the `google` provider. */
const GoogleAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="google" {...props} />
)
GoogleAuthButton.displayName = "GoogleAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `github` provider. */
const GitHubAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="github" {...props} />
)
GitHubAuthButton.displayName = "GitHubAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `apple` provider. */
const AppleAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="apple" {...props} />
)
AppleAuthButton.displayName = "AppleAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `microsoft` provider. */
const MicrosoftAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="microsoft" {...props} />
)
MicrosoftAuthButton.displayName = "MicrosoftAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `x` provider. */
const XAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="x" {...props} />
)
XAuthButton.displayName = "XAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `discord` provider. */
const DiscordAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="discord" {...props} />
)
DiscordAuthButton.displayName = "DiscordAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `facebook` provider. */
const FacebookAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="facebook" {...props} />
)
FacebookAuthButton.displayName = "FacebookAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `linkedin` provider. */
const LinkedInAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="linkedin" {...props} />
)
LinkedInAuthButton.displayName = "LinkedInAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `medium` provider. */
const MediumAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="medium" {...props} />
)
MediumAuthButton.displayName = "MediumAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `slack` provider. */
const SlackAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="slack" {...props} />
)
SlackAuthButton.displayName = "SlackAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `reddit` provider. */
const RedditAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="reddit" {...props} />
)
RedditAuthButton.displayName = "RedditAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `paypal` provider. */
const PayPalAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="paypal" {...props} />
)
PayPalAuthButton.displayName = "PayPalAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `stripe` provider. */
const StripeAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="stripe" {...props} />
)
StripeAuthButton.displayName = "StripeAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `gitlab` provider. */
const GitLabAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="gitlab" {...props} />
)
GitLabAuthButton.displayName = "GitLabAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `dribbble` provider. */
const DribbbleAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="dribbble" {...props} />
)
DribbbleAuthButton.displayName = "DribbbleAuthButton"

/** Pre-bound {@link SocialAuthButton} for the `tiktok` provider. */
const TikTokAuthButton = (props: ProviderShortcutProps) => (
    <SocialAuthButton provider="tiktok" {...props} />
)
TikTokAuthButton.displayName = "TikTokAuthButton"

export {
    SocialAuthButton,
    GoogleAuthButton,
    GitHubAuthButton,
    AppleAuthButton,
    MicrosoftAuthButton,
    XAuthButton,
    DiscordAuthButton,
    FacebookAuthButton,
    LinkedInAuthButton,
    MediumAuthButton,
    SlackAuthButton,
    RedditAuthButton,
    PayPalAuthButton,
    StripeAuthButton,
    GitLabAuthButton,
    DribbbleAuthButton,
    TikTokAuthButton,
    PROVIDERS,
    type SocialAuthButtonProps,
    type SocialProvider,
}
