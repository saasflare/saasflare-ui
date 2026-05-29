"use client"

import { SocialButton } from "@saasflare/ui"

/** A branded provider sign-in button. Visual only — wire `onClick` to your auth flow. */
export function Demo() {
    return <SocialButton provider="google" onClick={() => {}} />
}
