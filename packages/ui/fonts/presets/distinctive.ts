// @reviewed 2026-04-19
/**
 * @fileoverview Distinctive typography preset — Inter body + Bricolage Grotesque heading + JetBrains Mono.
 * @module packages/ui/fonts/presets/distinctive
 * @package ui
 *
 * Modern, with attitude. Bricolage Grotesque is a contemporary display
 * sans with strong character — confident headings that still pair with
 * Inter's quiet body text. Less serious than Editorial, more brand-forward
 * than Default.
 *
 * `display: "swap"` on the heading: Bricolage's silhouette is distinct
 * enough that the optional fallback would feel like a different brand.
 *
 * Use for: products that want a recognizable type voice without going
 * full editorial — startups, design tools, brand-led marketing sites.
 *
 * Public import path:
 *   import { fontVariables } from "@saasflare/ui/fonts/distinctive"
 */
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google"

export const fontBody = Inter({
    subsets: ["latin"],
    variable: "--font-body",
})

export const fontHeading = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
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
