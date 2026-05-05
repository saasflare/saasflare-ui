// @reviewed 2026-04-18
/**
 * @fileoverview Hex → OKLCH color converter.
 * @module packages/ui/lib/color
 * @package ui
 *
 * Minimal sRGB-hex to OKLCH conversion using the OKLab color space
 * (Björn Ottosson, 2020). Used by CustomThemeInjector to let developers
 * pass any CSS color as `primary` and have it injected as the three
 * rebrand-surface variables --primary-h / --primary-c / --primary-l.
 *
 * Scope:
 *   - Parses "#RGB", "#RRGGBB", "#RGBA", "#RRGGBBAA" (alpha discarded).
 *   - Non-hex strings (oklch(…), rgb(…), hsl(…), named colors) are
 *     assumed already in a CSS-parseable form → return null to signal
 *     "use as-is" to the caller.
 *
 * Non-goals:
 *   - Gamut clamping (sRGB hex is in-gamut by definition).
 *   - Parsing rgb()/hsl()/oklch() strings (let CSS do it).
 *
 * Reference: https://bottosson.github.io/posts/oklab/
 */

/** Decomposed OKLCH triplet. Hue is in [0, 360), chroma ≥ 0, lightness in [0, 1]. */
export interface OklchTriplet {
    l: number;
    c: number;
    h: number;
}

/**
 * Convert a hex color string to an OKLCH triplet.
 *
 * @param hex - "#RGB", "#RRGGBB", "#RGBA", or "#RRGGBBAA" (alpha discarded)
 * @returns OKLCH triplet, or `null` if the input is not a parseable hex string
 */
export function hexToOklch(hex: string): OklchTriplet | null {
    const normalized = normalizeHex(hex);
    if (!normalized) return null;

    const r = srgbToLinear(parseInt(normalized.slice(0, 2), 16) / 255);
    const g = srgbToLinear(parseInt(normalized.slice(2, 4), 16) / 255);
    const b = srgbToLinear(parseInt(normalized.slice(4, 6), 16) / 255);

    // Linear sRGB → LMS (Ottosson matrix M1)
    const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    // Non-linearity (cube root) — LMS → LMS'
    const lc = Math.cbrt(l_);
    const mc = Math.cbrt(m_);
    const sc = Math.cbrt(s_);

    // LMS' → OKLab (Ottosson matrix M2)
    const L = 0.2104542553 * lc + 0.7936177850 * mc - 0.0040720468 * sc;
    const a = 1.9779984951 * lc - 2.4285922050 * mc + 0.4505937099 * sc;
    const b2 = 0.0259040371 * lc + 0.7827717662 * mc - 0.8086757660 * sc;

    // OKLab → OKLCH
    const c = Math.sqrt(a * a + b2 * b2);
    let h = Math.atan2(b2, a) * 180 / Math.PI;
    if (h < 0) h += 360;

    return { l: L, c, h };
}

/**
 * Expand shorthand hex to 6-digit (drop alpha channel if present).
 * Returns lowercase 6-char hex or null if not a valid hex string.
 */
function normalizeHex(input: string): string | null {
    if (typeof input !== "string") return null;
    const s = input.trim().replace(/^#/, "").toLowerCase();

    // #RGB → #RRGGBB
    if (/^[0-9a-f]{3}$/.test(s)) {
        return s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    }
    // #RGBA → #RRGGBB (drop alpha)
    if (/^[0-9a-f]{4}$/.test(s)) {
        return s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    }
    // #RRGGBB
    if (/^[0-9a-f]{6}$/.test(s)) {
        return s;
    }
    // #RRGGBBAA → #RRGGBB (drop alpha)
    if (/^[0-9a-f]{8}$/.test(s)) {
        return s.slice(0, 6);
    }
    return null;
}

/** sRGB gamma expansion (per channel, 0..1 floats). */
function srgbToLinear(c: number): number {
    return c <= 0.04045
        ? c / 12.92
        : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Detect whether a string is a hex color (the only format this module converts).
 * Other CSS color formats pass through to the browser's parser.
 */
export function isHex(input: string): boolean {
    return typeof input === "string" && /^#?[0-9a-f]{3,8}$/i.test(input.trim());
}
