"use client"

import { SocialButton } from "@saasflare/ui"

/** A full set of provider buttons, stacked for a sign-in screen. */
export function Demo() {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <SocialButton provider="google" />
            <SocialButton provider="apple" />
            <SocialButton provider="github" />
            <SocialButton provider="microsoft" />
            <SocialButton provider="twitter" />
        </div>
    )
}
