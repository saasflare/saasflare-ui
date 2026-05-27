/**
 * @fileoverview Shared catalog header prefs: types, defaults, allow-lists, and
 * pure parse/serialize helpers. Consumed by both the Server Components
 * (`app/layout.tsx`, `app/page.tsx`) that read the cookie via `next/headers`
 * and the Client Component (`app/page-client.tsx`) that drives the toolbar
 * state via `useLocalStorage` + `document.cookie`.
 *
 * Kept pure (no DOM/window/cookie access here) so it can be imported into a
 * Server Component without dragging a "use client" boundary along.
 */

/* ── Allow-lists — drive both the TypeScript ID types and runtime validation. ── */

// Three groups, inverted order: (1) achromatic palettes first (dark to
// light), (2) chromatic palettes strictly sorted by OKLCH primary hue
// (magenta → cool → warm), (3) `colorful` as the featured/special entry
// at the end. Numbers in trailing comments are the dark-mode hue values
// from palettes.css.
export const PALETTES = [
    "black",     // achromatic (inverts to white in dark mode)
    "snow",      // near-white (outline-forward feel)
    "stone",     // achromatic
    "ink",       // achromatic
    "fuchsia",   // 340
    "violet",    // 290
    "lavender",  // 280 — pastel
    "indigo",    // 265
    "saasflare", // 259
    "iris",      // 255
    "cobalt",    // 240
    "ocean",     // 230
    "sky",       // 210 — pastel
    "aurora",    // 195
    "teal",      // 185
    "sage",      // 169
    "jade",      // 165
    "emerald",   // 155
    "mint",      // 155 — pastel
    "honey",     // 70
    "amber",     // 50
    "coral",     // 20
    "ruby",      // 10
    "colorful",  // special — multi-color pastel gradient on hover
] as const

export const SURFACES = ["flat", "glass", "clay"] as const
export const RADII = ["sharp", "soft", "rounded", "pill"] as const
export const ICON_WEIGHTS = ["regular", "bold", "fill", "duotone"] as const

export type PaletteId = (typeof PALETTES)[number]
export type SurfaceId = (typeof SURFACES)[number]
export type RadiusId = (typeof RADII)[number]
export type IconWeightId = (typeof ICON_WEIGHTS)[number]

/* ── Persisted shape, key, and TTL. ── */

/** localStorage key AND cookie name. Single key keeps server + client in lock-step. */
export const CATALOG_PREFS_KEY = "sf-catalog-prefs"

/** One year. Cookie auto-refreshes on every change via `document.cookie =`. */
export const CATALOG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** Light/dark/system — mirrors `next-themes`' `theme` prop verbatim. */
export type ThemeMode = "light" | "dark" | "system"

export const THEME_MODES = ["light", "dark", "system"] as const

export interface CatalogPrefs {
    palette: PaletteId
    surface: SurfaceId
    radius: RadiusId
    animated: boolean
    smoothScrolling: boolean
    iconWeight: IconWeightId
    themeMode: ThemeMode
}

export const CATALOG_DEFAULTS: CatalogPrefs = {
    palette: "saasflare",
    surface: "flat",
    radius: "soft",
    animated: true,
    smoothScrolling: true,
    iconWeight: "duotone",
    themeMode: "dark",
}

/* ── Helpers. ── */

function isOneOf<T extends readonly string[]>(
    value: unknown,
    options: T,
): value is T[number] {
    return typeof value === "string" && (options as readonly string[]).includes(value)
}

/**
 * Parse a raw cookie / localStorage payload into a valid CatalogPrefs object.
 * Tolerates: missing input, malformed JSON, missing fields, fields with the
 * wrong type, and fields with values outside the allow-list. Each invalid /
 * missing field falls back to the corresponding `CATALOG_DEFAULTS` entry, so
 * the caller always gets a fully populated object.
 *
 * Pure — safe to call in Server and Client Components alike.
 */
export function parseCatalogPrefs(
    raw: string | undefined | null,
): CatalogPrefs {
    if (!raw) return CATALOG_DEFAULTS
    let parsed: unknown
    try {
        parsed = JSON.parse(raw)
    } catch {
        return CATALOG_DEFAULTS
    }
    if (!parsed || typeof parsed !== "object") return CATALOG_DEFAULTS
    const p = parsed as Record<string, unknown>
    return {
        palette: isOneOf(p.palette, PALETTES) ? p.palette : CATALOG_DEFAULTS.palette,
        surface: isOneOf(p.surface, SURFACES) ? p.surface : CATALOG_DEFAULTS.surface,
        radius: isOneOf(p.radius, RADII) ? p.radius : CATALOG_DEFAULTS.radius,
        animated: typeof p.animated === "boolean" ? p.animated : CATALOG_DEFAULTS.animated,
        smoothScrolling:
            typeof p.smoothScrolling === "boolean" ? p.smoothScrolling : CATALOG_DEFAULTS.smoothScrolling,
        iconWeight: isOneOf(p.iconWeight, ICON_WEIGHTS) ? p.iconWeight : CATALOG_DEFAULTS.iconWeight,
        themeMode: isOneOf(p.themeMode, THEME_MODES) ? p.themeMode : CATALOG_DEFAULTS.themeMode,
    }
}

/**
 * Best-effort "is this dark?" decision the Server Component can make from a
 * persisted theme mode alone. For `"light"` / `"dark"` it's unambiguous. For
 * `"system"` we fall back to dark, because (a) it matches the catalog's
 * historical default and (b) being slightly wrong on light-OS users is
 * cheaper than being wrong on dark-OS users — `next-themes`' client-side
 * script will correct it on first paint either way.
 */
export function resolveDark(mode: ThemeMode): boolean {
    return mode !== "light"
}

/** Mirror of `parseCatalogPrefs` — used for cookie writes and (transitively) localStorage. */
export function serializeCatalogPrefs(prefs: CatalogPrefs): string {
    return JSON.stringify(prefs)
}
