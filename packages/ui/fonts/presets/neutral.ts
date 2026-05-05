// @reviewed 2026-04-19
/**
 * @fileoverview Neutral typography preset — Roboto + Roboto Mono.
 * @module packages/ui/fonts/presets/neutral
 * @package ui
 *
 * Material-Design-aligned, maximally familiar. Roboto is the most-seen
 * web font on earth — users won't notice it, which is exactly the point.
 * Use when typography should disappear so other brand elements (color,
 * imagery, layout) carry the identity.
 *
 * Use for: enterprise tools, internal dashboards, products with strong
 * non-typographic brand systems, Android-adjacent companion web apps.
 *
 * Public import path:
 *   import { fontVariables } from "@saasflare/ui/fonts/neutral"
 */
import { Roboto, Roboto_Mono } from "next/font/google"

export const fontBody = Roboto({
    subsets: ["latin"],
    variable: "--font-body",
    weight: ["400", "500", "700"],
})

export const fontHeading = Roboto({
    subsets: ["latin"],
    variable: "--font-heading",
    weight: ["500", "700"],
})

export const fontMono = Roboto_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export const fontVariables = [
    fontBody.variable,
    fontHeading.variable,
    fontMono.variable,
].join(" ")
