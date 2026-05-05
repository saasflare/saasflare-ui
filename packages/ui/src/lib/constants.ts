// @reviewed 2026-04-19
/**
 * @fileoverview Shared internal constants used across @saasflare/ui modules.
 * @module packages/ui/lib/constants
 * @package ui
 *
 * Values here must satisfy all three criteria:
 *   1. Referenced from MORE THAN ONE module (otherwise it's a module-local const).
 *   2. Required to stay in sync (changing it in one place MUST change it everywhere).
 *   3. Internal — not part of the public API. CSS files own the canonical
 *      names for selector matching; these constants are the TypeScript mirror.
 *
 * Module-scoped constants (e.g. sidebar dimensions, cookie names for a single
 * component) stay in their component file. Keep this file small and focused.
 */

/**
 * Default localStorage key for PersistedPrefs.
 * Written by SaasflareProvider, read by SaasflareScript.
 * Override via the `storageKey` prop for white-label or multi-tenant apps.
 */
export const UI_PREFS_STORAGE_KEY = "sf-ui-prefs"

/**
 * Default localStorage key for next-themes' light/dark mode preference.
 * Matches next-themes' own default. Override via the `themeStorageKey` prop
 * if you need a different name (e.g. brand prefix, multi-tenant isolation).
 */
export const THEME_STORAGE_KEY = "theme"

/**
 * HTML data attributes owned by the Saasflare provider family and consumed
 * by the CSS layer (theme.css / palettes.css / surfaces.css / motion.css).
 *
 * Keep these in sync with the CSS selectors. The CSS files hold the canonical
 * name; this object is the TypeScript mirror used for setAttribute calls.
 */
export const SAASFLARE_DATA_ATTR = {
    /** Active brand palette id (matches `:root[data-palette="…"]` in palettes.css). */
    palette: "data-palette",
    /** Active surface style (matches `[data-style="…"]` in surfaces.css). */
    style: "data-style",
    /** Active radius preset (matches `:root[data-radius="…"]` in theme.css). */
    radius: "data-radius",
    /** Animation kill-switch (matches `[data-animated="false"]` in motion.css). */
    animated: "data-animated",
} as const
