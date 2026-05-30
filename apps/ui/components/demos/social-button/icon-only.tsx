"use client"

import { SocialButton } from "@saasflare/ui"

/** Compact icon-only buttons for a horizontal provider row. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <SocialButton provider="google" iconOnly />
            <SocialButton provider="apple" iconOnly />
            <SocialButton provider="github" iconOnly />
            <SocialButton provider="microsoft" iconOnly />
            <SocialButton provider="twitter" iconOnly />
        </div>
    )
}
