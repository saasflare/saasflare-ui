"use client"

import {
    GoogleAuthButton,
    GitHubAuthButton,
    SocialAuthButton,
} from "@saasflare/ui"

/**
 * Provider-branded auth buttons: the default "Continue with {Provider}" label,
 * a pending button via `loading`, and the brand-locked `colorful` icon weight.
 */
export function Demo() {
    return (
        <div className="flex w-full max-w-xs flex-col gap-3">
            <GoogleAuthButton fullWidth />
            <GitHubAuthButton fullWidth />
            <SocialAuthButton
                provider="github"
                iconWeight="colorful"
                loading
                loadingText="Connecting…"
                fullWidth
            />
        </div>
    )
}
