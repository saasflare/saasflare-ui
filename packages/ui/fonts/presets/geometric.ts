// @reviewed 2026-04-19
/**
 * @fileoverview Geometric typography preset — Geist + Geist Mono.
 * @module packages/ui/fonts/presets/geometric
 * @package ui
 *
 * Technical-minimal aesthetic. Geist is tighter and more architectural
 * than Inter; the matched mono keeps visual language uniform across copy
 * and code blocks. Vercel-style minimalism.
 *
 * Use for: developer tools, API products, infrastructure dashboards.
 *
 * Public import path:
 *   import { fontVariables } from "@saasflare/ui/fonts/geometric"
 */
import { Geist, Geist_Mono } from "next/font/google"

export const fontBody = Geist({
    subsets: ["latin"],
    variable: "--font-body",
})

export const fontHeading = Geist({
    subsets: ["latin"],
    variable: "--font-heading",
})

export const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export const fontVariables = [
    fontBody.variable,
    fontHeading.variable,
    fontMono.variable,
].join(" ")
