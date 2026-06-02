"use client"

import { SocialAuthButton, SOCIAL_AUTH_PROVIDERS } from "@saasflare/ui"

/**
 * Every supported identity provider — mapped from `SOCIAL_AUTH_PROVIDERS`.
 * Sixteen branded buttons, no per-provider wiring beyond the `provider` prop.
 */
export function Demo() {
    return (
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SOCIAL_AUTH_PROVIDERS.map((provider) => (
                <SocialAuthButton key={provider} provider={provider} fullWidth />
            ))}
        </div>
    )
}
