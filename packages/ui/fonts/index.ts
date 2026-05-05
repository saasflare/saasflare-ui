// @reviewed 2026-04-19
/**
 * @fileoverview Public type surface for typography presets.
 * @module packages/ui/fonts
 * @package ui
 *
 * Presets are loaded via subpath imports so each consumer only bundles
 * the fonts of the preset they actually use:
 *
 *   import { fontVariables } from "@saasflare/ui/fonts/editorial"
 *   <SaasflareShell className={fontVariables}>
 *
 * Available subpaths (declared in package.json `exports`):
 *   @saasflare/ui/fonts/default      Inter + Inter + JetBrains Mono
 *   @saasflare/ui/fonts/editorial    Inter + Fraunces + JetBrains Mono
 *   @saasflare/ui/fonts/geometric    Geist + Geist + Geist Mono
 *   @saasflare/ui/fonts/rounded      Nunito + Nunito + JetBrains Mono
 *   @saasflare/ui/fonts/distinctive  Inter + Bricolage Grotesque + JetBrains Mono
 *   @saasflare/ui/fonts/neutral      Roboto + Roboto + Roboto Mono
 *
 * Internal file structure (`presets/*.ts`) is not part of the public API
 * and may change between versions; only the subpaths above are stable.
 *
 * Required app setup: add `transpilePackages: ["@saasflare/ui"]` to
 * `next.config.{js,ts}` so the Next.js compiler can process the
 * `next/font/google` calls in the package source.
 */

/** All available font preset ids. Use as `import "@saasflare/ui/fonts/<id>"`. */
export type FontPreset =
    | "default"
    | "editorial"
    | "geometric"
    | "rounded"
    | "distinctive"
    | "neutral"

/**
 * Shape of every preset module's default export contract.
 * Each `@saasflare/ui/fonts/<preset>` module exports these names:
 *
 *   - `fontBody`       → next/font loader instance (carries `.variable` className)
 *   - `fontHeading`    → next/font loader instance
 *   - `fontMono`       → next/font loader instance
 *   - `fontVariables`  → joined className string for `<SaasflareShell className={…}>`
 *
 * The loader instance type is intentionally `unknown` here — `next/font`
 * generates a unique anonymous type per call, and we don't want this
 * package to take a hard dependency on `next/font`'s internal types.
 */
export interface FontPresetModule {
    fontBody: { variable: string }
    fontHeading: { variable: string }
    fontMono: { variable: string }
    fontVariables: string
}
