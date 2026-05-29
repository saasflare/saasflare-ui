"use client"

import { SocialButton } from "@saasflare/ui"

/** Override the default label text per provider. */
export function Demo() {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <SocialButton provider="github" label="Sign up with GitHub" />
            <SocialButton provider="google" label="Sign up with Google" />
        </div>
    )
}
