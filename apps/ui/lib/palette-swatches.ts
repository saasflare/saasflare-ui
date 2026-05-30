/**
 * @fileoverview Palette swatch colors — shared by the catalog control bar and
 * the landing theme playground so both render the picker dots in each palette's
 * own accent (the `:root[data-palette]` selector only themes the document root,
 * so per-dot color must come from these precomputed maps / a live CSS-var read).
 *
 * Keep the fallback maps in lockstep with `packages/ui/styles/palettes.css`.
 */
import { PALETTES, type PaletteId } from "./catalog-prefs"

/** Pastel sweep used as the `colorful` swatch — mirrors --colorful-gradient. */
export const COLORFUL_SWATCH_GRADIENT =
    "linear-gradient(95deg, #ffd4a3 0%, #ffb8c5 35%, #d4bce8 65%, #b8d8e5 100%)"

/** Dark-mode accent per palette. Achromatic palettes invert (e.g. `black` → white). */
export const PALETTE_SWATCH_FALLBACK_DARK: Record<PaletteId, string> = {
    ruby: "oklch(0.68 0.21 10)",
    colorful: COLORFUL_SWATCH_GRADIENT,
    coral: "oklch(0.72 0.19 20)",
    amber: "oklch(0.72 0.17 50)",
    honey: "oklch(0.76 0.16 70)",
    mint: "oklch(0.80 0.10 155)",
    emerald: "oklch(0.68 0.17 155)",
    jade: "oklch(0.70 0.16 165)",
    sage: "oklch(0.70 0.082 169.28)",
    teal: "oklch(0.70 0.15 185)",
    aurora: "oklch(0.75 0.19 195)",
    sky: "oklch(0.80 0.12 210)",
    ocean: "oklch(0.70 0.18 230)",
    cobalt: "oklch(0.70 0.20 240)",
    iris: "oklch(0.70 0.16 255)",
    saasflare: "oklch(0.72 0.214 259.1)",
    indigo: "oklch(0.70 0.20 265)",
    lavender: "oklch(0.80 0.10 280)",
    violet: "oklch(0.70 0.20 290)",
    fuchsia: "oklch(0.72 0.21 340)",
    ink: "oklch(0.75 0 0)",
    stone: "oklch(0.78 0 0)",
    snow: "oklch(0.95 0.005 0)",
    black: "oklch(1 0 0)",
}

/** Light-mode accent per palette. */
export const PALETTE_SWATCH_FALLBACK_LIGHT: Record<PaletteId, string> = {
    ruby: "oklch(0.58 0.21 10)",
    colorful: COLORFUL_SWATCH_GRADIENT,
    coral: "oklch(0.65 0.19 20)",
    amber: "oklch(0.65 0.17 50)",
    honey: "oklch(0.68 0.16 70)",
    mint: "oklch(0.72 0.10 155)",
    emerald: "oklch(0.55 0.17 155)",
    jade: "oklch(0.58 0.16 165)",
    sage: "oklch(0.586 0.082 169.28)",
    teal: "oklch(0.60 0.15 185)",
    aurora: "oklch(0.65 0.19 195)",
    sky: "oklch(0.72 0.12 210)",
    ocean: "oklch(0.60 0.18 230)",
    cobalt: "oklch(0.60 0.20 240)",
    iris: "oklch(0.60 0.16 255)",
    saasflare: "oklch(0.623 0.214 259.1)",
    indigo: "oklch(0.60 0.20 265)",
    lavender: "oklch(0.72 0.10 280)",
    violet: "oklch(0.60 0.20 290)",
    fuchsia: "oklch(0.62 0.21 340)",
    ink: "oklch(0.45 0 0)",
    stone: "oklch(0.55 0 0)",
    snow: "oklch(0.93 0.005 0)",
    black: "oklch(0 0 0)",
}

/**
 * Read the actual `--primary-{h,c,l}` triple each preset palette resolves to
 * under the current `.dark` / `.light` class, by briefly swapping
 * `<html data-palette>` and reading the computed style. All swaps happen
 * synchronously inside one JS turn, so the browser never paints an intermediate
 * state — the original palette attr is restored before the next frame. Returns
 * null on the server where `document` is unavailable.
 */
export function readPaletteSwatches(
    palettes: readonly PaletteId[] = PALETTES,
): Record<PaletteId, string> | null {
    if (typeof document === "undefined") return null
    const html = document.documentElement
    const original = html.getAttribute("data-palette")
    const out: Record<string, string> = {}
    for (const p of palettes) {
        html.setAttribute("data-palette", p)
        const cs = getComputedStyle(html)
        const h = cs.getPropertyValue("--primary-h").trim()
        const c = cs.getPropertyValue("--primary-c").trim()
        const l = cs.getPropertyValue("--primary-l").trim()
        const fallback = html.classList.contains("dark")
            ? PALETTE_SWATCH_FALLBACK_DARK
            : PALETTE_SWATCH_FALLBACK_LIGHT
        // `colorful` renders --primary as transparent; always use the gradient.
        if (p === "colorful") {
            out[p] = fallback[p]
            continue
        }
        out[p] = h && c && l ? `oklch(${l} ${c} ${h})` : fallback[p]
    }
    if (original !== null) html.setAttribute("data-palette", original)
    else html.removeAttribute("data-palette")
    return out as Record<PaletteId, string>
}
