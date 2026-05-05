// @reviewed 2026-04-19
/**
 * @fileoverview Default typography preset — Inter + JetBrains Mono.
 * @module packages/ui/fonts/presets/default
 * @package ui
 *
 * SaaS-neutral, the safest pick. Inter is system-ui-adjacent, dense,
 * excellent across sizes. JetBrains Mono pairs cleanly without competing.
 *
 * Use for: dashboards, admin panels, generic SaaS UI.
 *
 * Public import path (do not rely on this internal location):
 *   import { fontVariables } from "@saasflare/ui/fonts/default"
 */
import { Inter, JetBrains_Mono } from "next/font/google"

export const fontBody = Inter({
    subsets: ["latin"],
    variable: "--font-body",
})

export const fontHeading = Inter({
    subsets: ["latin"],
    variable: "--font-heading",
})

export const fontMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

/** Joined className string — pass to <SaasflareShell className={...}>. */
export const fontVariables = [
    fontBody.variable,
    fontHeading.variable,
    fontMono.variable,
].join(" ")
