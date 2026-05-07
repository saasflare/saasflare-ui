// @reviewed 2026-04-19
"use client"

/**
 * @fileoverview Pre-hydration script — eliminates palette/style/radius/animation FOUT.
 * @module packages/ui/providers/saasflare-script
 * @package ui
 *
 * Apply the initial design-system state to <html> before React hydrates.
 * Without this, a user who has persisted `data-palette="ocean"` (or who
 * receives an explicit `palette="emerald"` prop on the provider) would
 * see the baseline violet for one frame before the provider's useEffect
 * snaps the attribute into place.
 *
 * Precedence — must mirror SaasflareProvider exactly:
 *   - explicit prop (palette="emerald")     → forced (wins over localStorage)
 *   - omitted (undefined)                   → persisted localStorage wins
 *
 * Usage — render inside <head> of the root layout BEFORE any body content:
 *   <html lang="en" suppressHydrationWarning>
 *     <head>
 *       <SaasflareScript palette="emerald" surface="glass" />
 *     </head>
 *     <body>
 *       <SaasflareProvider palette="emerald" surface="glass">
 *         {children}
 *       </SaasflareProvider>
 *     </body>
 *   </html>
 *
 * The script and the provider must receive the same values for the
 * precedence logic to agree. Keep them in sync (a shared const works).
 *
 * Coexistence with next-themes:
 *   next-themes owns the `.dark` class via its own inline script.
 *   This script owns `data-palette`, `data-style`, `data-radius`, `data-animated` only.
 *
 * All four attributes are set in a single script execution to avoid staggered
 * FOUT flashes (palette-then-radius-then-style would be visible to the user).
 *
 * CSP:
 *   Accepts a `nonce` prop for apps with a strict Content-Security-Policy.
 */
import { SAASFLARE_DATA_ATTR, UI_PREFS_STORAGE_KEY } from "../lib/constants"

/** Props for {@link SaasflareScript}. */
export interface SaasflareScriptProps {
    /** CSP nonce. Pass when your app enforces a strict Content-Security-Policy. */
    nonce?: string
    /**
     * Initial brand palette. Mirror the `palette` prop of SaasflareProvider.
     * Omit to defer to persisted localStorage preference.
     */
    palette?: string
    /**
     * Initial surface style. Mirror the `surface` prop of SaasflareProvider.
     * Omit to defer to persisted localStorage preference.
     */
    surface?: string
    /**
     * Initial radius preset. Mirror the `radius` prop of SaasflareProvider.
     * Omit to defer to persisted localStorage preference.
     */
    radius?: string
    /**
     * Initial animation state. Mirror the `animated` prop of SaasflareProvider.
     * Omit to defer to persisted localStorage preference (default: true).
     */
    animated?: boolean
    /**
     * localStorage key to read prefs from. Must match the SaasflareProvider's
     * `storageKey` prop exactly. @default "sf-ui-prefs"
     */
    storageKey?: string
}

/**
 * Serialize a string literal into a JS expression safe for direct
 * injection into a <script> tag. Escapes the closing-script sequence
 * to prevent premature tag termination.
 */
function encode(value: unknown): string {
    return JSON.stringify(value ?? null).replace(/</g, "\\u003c")
}

/**
 * Build the pre-hydration script body for a given provider configuration.
 *
 * Exposed so {@link SaasflareProvider} can inline the same script as its
 * first child and apps don't need a manual `<SaasflareScript />` in `<head>`.
 */
export function buildSaasflareScript(
    palette?: string,
    surface?: string,
    radius?: string,
    animated?: boolean,
    storageKey: string = UI_PREFS_STORAGE_KEY,
): string {
    return buildScript(palette, surface, radius, animated, storageKey)
}

function buildScript(
    palette: string | undefined,
    surface: string | undefined,
    radius: string | undefined,
    animated: boolean | undefined,
    storageKey: string,
): string {
    // Explicit values are forced; null means consult localStorage.
    const forcePalette = palette || null
    const forceSurface = surface || null
    const forceRadius = radius || null
    const forceAnimated = typeof animated === "boolean" ? animated : null

    // All attributes set in one synchronous block — no staggered FOUT.
    return `(function(){try{var r=document.documentElement;var p={};try{p=JSON.parse(localStorage.getItem(${encode(storageKey)})||"{}")||{}}catch(_){}` +
        `var t=${encode(forcePalette)};if(t===null&&typeof p.palette==="string")t=p.palette;if(typeof t==="string"&&t.length)r.setAttribute(${encode(SAASFLARE_DATA_ATTR.palette)},t);` +
        `var s=${encode(forceSurface)};if(s===null&&typeof p.surface==="string")s=p.surface;if(typeof s==="string"&&s.length)r.setAttribute(${encode(SAASFLARE_DATA_ATTR.style)},s);` +
        `var d=${encode(forceRadius)};if(d===null&&typeof p.radius==="string")d=p.radius;if(typeof d==="string"&&d.length)r.setAttribute(${encode(SAASFLARE_DATA_ATTR.radius)},d);` +
        `var a=${encode(forceAnimated)};if(a===null&&typeof p.animated==="boolean")a=p.animated;if(typeof a==="boolean")r.setAttribute(${encode(SAASFLARE_DATA_ATTR.animated)},String(a));` +
        `}catch(e){}})();`
}

/**
 * Inline script that sets `data-palette`, `data-style`, `data-radius`,
 * `data-animated` on the document element before first paint.
 *
 * @component
 */
export function SaasflareScript({ nonce, palette, surface, radius, animated, storageKey = UI_PREFS_STORAGE_KEY }: SaasflareScriptProps) {
    return (
        <script
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: buildScript(palette, surface, radius, animated, storageKey) }}
        />
    )
}
