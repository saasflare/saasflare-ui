// @reviewed 2026-04-19
/**
 * @fileoverview Editorial typography preset — Inter body + Fraunces heading + JetBrains Mono.
 * @module packages/ui/fonts/presets/editorial
 * @package ui
 *
 * Content-heavy products with strong editorial voice. Fraunces is a
 * high-contrast contemporary serif with personality; Inter keeps body
 * text quiet and readable. The serif/sans split signals "this is content,
 * not chrome."
 *
 * `display: "swap"` on the heading: Fraunces diverges enough from system-ui
 * that the optional fallback would feel bare during load.
 *
 * Use for: blogs, documentation sites, knowledge bases, magazine-style
 * marketing pages.
 *
 * Public import path:
 *   import { fontVariables } from "@saasflare/ui/fonts/editorial"
 */
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google"

export const fontBody = Inter({
    subsets: ["latin"],
    variable: "--font-body",
})

export const fontHeading = Fraunces({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
    axes: ["opsz"],
})

export const fontMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export const fontVariables = [
    fontBody.variable,
    fontHeading.variable,
    fontMono.variable,
].join(" ")
