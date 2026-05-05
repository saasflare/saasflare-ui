// @reviewed 2026-04-19
/**
 * @fileoverview Theme-related types and constants consumed by SaasflareProvider,
 * SaasflareShell, and CustomPaletteInjector.
 * @module packages/ui/types/theme-props
 * @package ui
 *
 * Palette colors live in `styles/palettes.css` (OKLCH) — the single source of
 * truth. To render a swatch in a picker, wrap an element in `data-palette={id}`
 * and paint it with `oklch(var(--primary-l) var(--primary-c) var(--primary-h))`.
 * Do NOT add a hex `color` field here; it will drift from palettes.css.
 */

/** All 16 available color palette ids and display names. */
export const PALETTES = [
    { id: "ocean", name: "Ocean" },
    { id: "achromatic", name: "Achromatic" },
    { id: "black", name: "Black" },
    { id: "ink", name: "Ink" },
    { id: "aurora", name: "Aurora" },
    { id: "indigo", name: "Indigo" },
    { id: "emerald", name: "Emerald" },
    { id: "violet", name: "Violet" },
    { id: "coral", name: "Coral" },
    { id: "stone", name: "Stone" },
    { id: "jade", name: "Jade" },
    { id: "cobalt", name: "Cobalt" },
    { id: "amber", name: "Amber" },
    { id: "fuchsia", name: "Fuchsia" },
    { id: "honey", name: "Honey" },
    { id: "teal", name: "Teal" },
    { id: "iris", name: "Iris" },
    { id: "ruby", name: "Ruby" },
] as const

/** Union of all preset color palette IDs. */
export type PaletteId = (typeof PALETTES)[number]["id"]

/**
 * Visual surface style variant.
 *
 * The union uses `(string & {})` so app-level custom surfaces (e.g.
 * "neumorphic") registered via a [data-style="…"] selector in the
 * app's globals.css are accepted without a type patch, while preset
 * ids keep their autocomplete.
 */
export type StyleVariant = "flat" | "glass" | (string & {})

/** All available built-in surface style variants. */
export const STYLES = [
    { id: "flat", name: "Flat" },
    { id: "glass", name: "Glass" },
] as const satisfies ReadonlyArray<{ id: "flat" | "glass"; name: string }>

/**
 * Radius preset — orthogonal to {@link Surface} (geometry vs. material).
 *
 * Maps to `[data-radius]` selectors in theme.css; each preset sets `--radius`
 * (and at "pill" also overrides the entire `--radius-sm/md/lg/xl` scale so
 * derived values don't drift to ~9995px).
 *
 * Per-component override: pass `radius` on any Saasflare component.
 * Per-theme override: `CustomPalette.radius` wins via inline style.
 */
export type Radius = "sharp" | "soft" | "rounded" | "pill"

/** All available built-in radius presets. */
export const RADII = [
    { id: "sharp",   name: "Sharp"   },
    { id: "soft",    name: "Soft"    },
    { id: "rounded", name: "Rounded" },
    { id: "pill",    name: "Pill"    },
] as const satisfies ReadonlyArray<{ id: Radius; name: string }>

/**
 * Custom color theme — high-level, developer-friendly.
 *
 * Pass any CSS color as `primary` (hex, oklch, rgb, hsl, named color).
 * Hex values are converted to OKLCH internally via {@link hexToOklch};
 * other formats are passed through as the raw `--primary` value.
 *
 * @example
 *   <SaasflareProvider
 *     palette={{ name: "acme", primary: "#007AFF" }}
 *   />
 *
 * @example Escape hatch for full control
 *   <SaasflareProvider palette={{
 *     name: "acme",
 *     primary: "#007AFF",
 *     light: { "--background": "#fafafa" },
 *     dark:  { "--background": "#0a0a0a" },
 *   }} />
 */
export interface CustomPalette {
    /** Unique name — written to `data-palette` attribute. */
    name: string
    /** Primary brand color in any CSS color format. Required. */
    primary: string
    /**
     * Optional neutral axis override — drives backgrounds, muted, borders,
     * cards, popovers, sidebar (i.e. the entire grey foundation of the UI),
     * not just one accent token. Accepts hex or an explicit hue angle (0-360).
     * Default: tinted from `primary` with a tiny chroma for "brand warmth".
     */
    neutral?: string
    /** Optional border radius override (any CSS length). */
    radius?: string
    /** Escape hatch: raw CSS custom property overrides applied in light mode. */
    light?: Record<string, string>
    /** Escape hatch: raw CSS custom property overrides applied in dark mode. */
    dark?: Record<string, string>
}

/**
 * Accepted values for the `palette` prop (brand colors — distinct from `theme`,
 * which controls light/dark mode and is delegated to next-themes).
 *
 * - omit (undefined)   → defers to persisted user preference, then global.css baseline
 * - PaletteId          → preset palette via [data-palette] selector
 * - arbitrary string   → app-registered [data-palette="…"] in the app's globals.css
 * - CustomPalette      → runtime palette via inline CSS custom properties
 *
 * The `(string & {})` branch preserves autocomplete for the 16 preset ids
 * while still permitting arbitrary strings.
 */
export type Palette = PaletteId | (string & {}) | CustomPalette

/**
 * Accepted values for the `surface` prop.
 *
 * - omit (undefined)   → defers to persisted user preference, then "flat" baseline
 * - StyleVariant       → "flat" | "glass" | app-registered custom surface
 */
export type Surface = StyleVariant

/**
 * Accepted values for the `radius` prop on SaasflareProvider / Shell.
 *
 * - omit (undefined) → defers to persisted user preference, then "rounded" baseline
 * - Radius           → forces [data-radius] on <html>
 */
export type RadiusProp = Radius
