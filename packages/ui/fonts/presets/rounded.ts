// @reviewed 2026-04-19
/**
 * @fileoverview Rounded typography preset — Nunito + JetBrains Mono.
 * @module packages/ui/fonts/presets/rounded
 * @package ui
 *
 * Consumer-friendly, warm. Nunito's rounded terminals soften the entire
 * UI without sacrificing legibility. JetBrains Mono keeps code blocks
 * feeling like code so the warmth stays scoped to prose.
 *
 * Use for: education, kids/family apps, wellness, any product that wants
 * warmth over precision.
 *
 * Public import path:
 *   import { fontVariables } from "@saasflare/ui/fonts/rounded"
 */
import { Nunito, JetBrains_Mono } from "next/font/google"

export const fontBody = Nunito({
    subsets: ["latin"],
    variable: "--font-body",
})

export const fontHeading = Nunito({
    subsets: ["latin"],
    variable: "--font-heading",
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
