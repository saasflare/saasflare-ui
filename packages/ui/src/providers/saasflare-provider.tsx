// @reviewed 2026-04-19
"use client"

/**
 * @fileoverview Unified Saasflare provider — light/dark mode, brand palette, surface, radius, animation.
 * @module packages/ui/providers/saasflare-provider
 * @package ui
 *
 * Single authority for the five design-system axes on <html>:
 *   - class="dark"                            → owned by next-themes (light/dark mode)
 *   - data-palette="…"                        → preset or custom brand palette
 *   - data-style="flat|glass"                 → surface style (material)
 *   - data-radius="sharp|soft|rounded|pill"   → radius preset (geometry)
 *   - data-animated="true|…"                  → global animation kill-switch
 *
 * Layering (lowest → highest specificity):
 *   1. globals.css             → baseline tokens
 *   2. [data-palette="…"]      → preset overrides (palettes.css) or
 *                                app-registered selectors
 *   3. Inline CSS vars         → CustomPalette runtime overrides
 *
 * `palette` prop precedence:
 *   - omitted (undefined)      → defers to persisted preference, then baseline
 *   - Preset id / string       → forces [data-palette]
 *   - CustomPalette object     → forces [data-palette] + injects inline vars
 *
 * For first-paint correctness when a non-baseline palette is persisted,
 * render <SaasflareScript /> inside <head> before any React hydration.
 */

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react"
import { ThemeProvider, useTheme } from "next-themes"
import { LazyMotion, domAnimation } from "motion/react"
import { hexToOklch, isHex } from "../lib"
import { SAASFLARE_DATA_ATTR, UI_PREFS_STORAGE_KEY, THEME_STORAGE_KEY } from "../lib/constants"
import { useLocalStorage } from "../hooks/use-local-storage"
import { useReducedMotion } from "../hooks/use-reduced-motion"
import { AnimationContext } from "./animation-context"
import { buildSaasflareScript } from "./saasflare-script"
import { SmoothScrollProvider } from "./smooth-scroll-provider"
import type {
    CustomPalette,
    Palette,
    Radius,
    RadiusProp,
    StyleVariant,
    Surface,
} from "../types"
import type { IconWeight } from "../components/ui/phosphor"

// ---------------------------------------------------------------------------
// Saasflare context (palette + surface + radius)
// ---------------------------------------------------------------------------

/** Context value exposed by useSaasflareTheme(). */
interface SaasflareThemeContextType {
    /** Active brand palette id, or null when using baseline. */
    palette: string | null
    /** Active surface style. */
    surface: StyleVariant
    /** Active radius preset. */
    radius: Radius
    /** Active icon weight for component-rendered Phosphor icons. */
    iconWeight: IconWeight
    /** Set the active brand palette (persists to localStorage). */
    setPalette: (id: string) => void
    /** Set the active surface style (persists to localStorage). */
    setSurface: (style: StyleVariant) => void
    /** Set the active radius preset (persists to localStorage). */
    setRadius: (radius: Radius) => void
    /** Set the active icon weight (persists to localStorage). */
    setIconWeight: (weight: IconWeight) => void
}

/** Safe defaults when no provider is mounted. */
const DEFAULT_CONTEXT: SaasflareThemeContextType = {
    palette: null,
    surface: "flat",
    radius: "soft",
    iconWeight: "regular",
    setPalette: () => {},
    setSurface: () => {},
    setRadius: () => {},
    setIconWeight: () => {},
}

const SaasflareThemeContext = createContext<SaasflareThemeContextType>(DEFAULT_CONTEXT)

/**
 * Access the Saasflare theme context.
 * Safe to call without a provider — returns baseline defaults.
 */
export function useSaasflareTheme() {
    return useContext(SaasflareThemeContext)
}

// ---------------------------------------------------------------------------
// Internal: Custom palette CSS injector
// ---------------------------------------------------------------------------

/**
 * Resolve a CSS color string into three CSS custom properties that feed
 * into the theme.css rebrand surface: --<prefix>-h, --<prefix>-c, --<prefix>-l.
 *
 * Hex → converted to OKLCH via {@link hexToOklch}.
 * Non-hex → written as-is to `--<prefix>` (theme.css does not consume that
 *           directly for primary, but we set it so consumers can bind to it).
 */
function applyColorAxis(
    root: HTMLElement,
    prefix: "primary" | "neutral",
    value: string,
    injected: string[],
) {
    if (isHex(value)) {
        const oklch = hexToOklch(value);
        if (oklch) {
            const hKey = `--${prefix}-h`;
            const cKey = `--${prefix}-c`;
            const lKey = `--${prefix}-l`;
            root.style.setProperty(hKey, oklch.h.toFixed(2));
            root.style.setProperty(cKey, oklch.c.toFixed(4));
            if (prefix === "primary") {
                root.style.setProperty(lKey, oklch.l.toFixed(4));
                injected.push(lKey);
            }
            injected.push(hKey, cKey);
            return;
        }
    }

    // Not a hex — assume it's a raw CSS color. Pass-through to --<prefix>.
    const key = `--${prefix}`;
    root.style.setProperty(key, value);
    injected.push(key);
}

/**
 * Injects CSS custom properties for a custom brand palette.
 * Observes next-themes `resolvedTheme` to pick the light or dark escape-hatch.
 *
 * @internal
 */
function CustomPaletteInjector({ palette }: { palette: CustomPalette }) {
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        const root = document.documentElement
        const injected: string[] = []

        // 1. Primary (required).
        applyColorAxis(root, "primary", palette.primary, injected)

        // 2. Optional neutral hue axis.
        if (palette.neutral) {
            applyColorAxis(root, "neutral", palette.neutral, injected)
        }

        // 3. Optional border-radius override.
        if (palette.radius) {
            root.style.setProperty("--radius", palette.radius)
            injected.push("--radius")
        }

        // 4. Raw light/dark escape hatches — applied LAST so they win.
        const extras = resolvedTheme === "dark" ? palette.dark : palette.light
        if (extras) {
            for (const [key, value] of Object.entries(extras)) {
                root.style.setProperty(key, value)
                injected.push(key)
            }
        }

        return () => {
            for (const key of injected) {
                root.style.removeProperty(key)
            }
        }
    }, [resolvedTheme, palette])

    return null
}

// ---------------------------------------------------------------------------
// SaasflareProvider
// ---------------------------------------------------------------------------


/** Persisted preferences — null means "no preference, use baseline". */
interface PersistedPrefs {
    palette: string | null
    surface: StyleVariant | null
    radius: Radius | null
    animated: boolean | null
    iconWeight: IconWeight | null
}

const PERSISTED_DEFAULTS: PersistedPrefs = {
    palette: null,
    surface: null,
    radius: null,
    animated: null,
    iconWeight: null,
}

/** Props for SaasflareProvider. */
export interface SaasflareProviderProps {
    children: ReactNode
    /**
     * Light/dark mode (forwarded to next-themes).
     * Distinct from `palette` (which selects the brand colors).
     * @default "system"
     */
    theme?: "light" | "dark" | "system"
    /**
     * Brand palette (distinct from `theme`, which is light/dark).
     * - Preset id or arbitrary string → forces [data-palette] selector
     * - CustomPalette object → forces palette via inline CSS vars
     * - Omit to defer: uses persisted preference if any, otherwise baseline
     */
    palette?: Palette
    /**
     * Surface style.
     * - StyleVariant → forces [data-style]
     * - Omit to defer: uses persisted preference if any, otherwise "flat"
     */
    surface?: Surface
    /**
     * Radius preset (geometry axis — orthogonal to surface).
     * - Radius → forces [data-radius]
     * - Omit to defer: uses persisted preference if any, otherwise "rounded"
     */
    radius?: RadiusProp
    /**
     * Default icon weight for component-rendered Phosphor icons.
     * - IconWeight ("regular" | "bold" | "fill" | "duotone") → forces the value
     * - Omit to defer: uses persisted preference if any, otherwise "regular"
     */
    iconWeight?: IconWeight
    /**
     * Global animation kill switch.
     * - boolean → forces the value
     * - Omit to defer: uses persisted preference if any, otherwise `true`
     */
    animated?: boolean
    /** Enable smooth scrolling site-wide. @default true */
    smoothScrolling?: boolean
    /**
     * Skip rendering the pre-hydration FOUT-prevention script.
     * Set this to true if you are placing `<SaasflareScript />` manually
     * inside `<head>` (e.g. for a strict CSP setup).
     * @default false
     */
    disableScript?: boolean
    /** CSP nonce forwarded to the pre-hydration script. */
    scriptNonce?: string
    /**
     * localStorage key for Saasflare prefs (palette, surface, radius, animated).
     * Change this to namespace your app ("acme-ui-prefs"), to isolate tenants,
     * or to avoid collisions. If you render `<SaasflareScript />` manually in
     * `<head>`, pass the same value to its `storageKey` prop.
     *
     * Changing this key after users have persisted preferences orphans the
     * old data — users will see defaults until they re-pick their preferences.
     *
     * @default "sf-ui-prefs"
     */
    storageKey?: string
    /**
     * localStorage key forwarded to next-themes for the light/dark mode
     * preference. Change alongside `storageKey` when namespacing.
     *
     * @default "theme"
     */
    themeStorageKey?: string
}

/**
 * Unified Saasflare provider.
 *
 * Manages light/dark mode (via next-themes), brand palette, surface style,
 * radius preset, and a global animation kill switch in a single component.
 *
 * @component
 * @package ui
 */
export function SaasflareProvider({
                                      children,
                                      theme = "system",
                                      palette,
                                      surface,
                                      radius,
                                      iconWeight,
                                      animated,
                                      smoothScrolling = true,
                                      disableScript = false,
                                      scriptNonce,
                                      storageKey = UI_PREFS_STORAGE_KEY,
                                      themeStorageKey = THEME_STORAGE_KEY,
                                  }: SaasflareProviderProps) {
    const isCustomPalette = typeof palette === "object"

    // Pre-hydration script — inlined as the provider's first child so it runs
    // synchronously during HTML parsing, before first paint. Browsers block
    // paint on inline scripts without async/defer, so even if SaasflareProvider
    // is mounted deeper than the body root, the attributes are set before
    // any content becomes visible.
    //
    // Opt out via `disableScript` if you prefer to render <SaasflareScript />
    // manually inside <head> (strict CSP, custom layouts).
    const scriptPalette = !isCustomPalette && typeof palette === "string" ? palette : undefined
    const scriptSurface = typeof surface === "string" ? surface : undefined
    const scriptRadius = typeof radius === "string" ? radius : undefined
    const scriptHtml = disableScript
        ? null
        : buildSaasflareScript(scriptPalette, scriptSurface, scriptRadius, animated, storageKey)

    const [persisted, setPersisted] = useLocalStorage<PersistedPrefs>(
        storageKey,
        PERSISTED_DEFAULTS,
        {
            // Normalize corrupted/foreign values (e.g. a literal `null` or a
            // string written by another script): JSON.parse succeeds on those,
            // so without this guard `persisted.palette` would crash the tree.
            // The inline bootstrap script applies the same defense.
            deserializer: (raw) => {
                const parsed: unknown = JSON.parse(raw)
                return parsed !== null && typeof parsed === "object"
                    ? { ...PERSISTED_DEFAULTS, ...(parsed as Partial<PersistedPrefs>) }
                    : PERSISTED_DEFAULTS
            },
        },
    )

    // Resolve effective values: explicit prop > persisted > baseline default.
    const currentPalette: string | null = isCustomPalette
        ? palette.name
        : palette ?? persisted.palette

    const currentStyle: StyleVariant = surface ?? persisted.surface ?? "flat"

    const currentRadius: Radius = radius ?? persisted.radius ?? "soft"

    const currentIconWeight: IconWeight =
        iconWeight ?? persisted.iconWeight ?? "regular"

    // `animated` must follow the same prop > persisted > default chain as the
    // other axes so runtime toggles (catalog/header switches writing to the
    // persisted storageKey) actually flip the AnimationContext value for JS
    // consumers (Motion, conditional Spring). Without the persisted
    // fallback, a `undefined` prop collapsed to a hardcoded `true` and the
    // context could never go to `false` from anywhere except the prop.
    const currentAnimated: boolean =
        animated ?? persisted.animated ?? true

    const setPalette = useCallback(
        (id: string) => setPersisted(prev => ({ ...prev, palette: id })),
        [setPersisted],
    )

    const setSurface = useCallback(
        (style: StyleVariant) => setPersisted(prev => ({ ...prev, surface: style })),
        [setPersisted],
    )

    const setRadius = useCallback(
        (r: Radius) => setPersisted(prev => ({ ...prev, radius: r })),
        [setPersisted],
    )

    const setIconWeight = useCallback(
        (w: IconWeight) => setPersisted(prev => ({ ...prev, iconWeight: w })),
        [setPersisted],
    )

    // Respect prefers-reduced-motion regardless of the resolved `animated` value.
    const prefersReduced = useReducedMotion()
    const effectiveAnimated = currentAnimated && !prefersReduced

    // Sole authority for data-palette / data-style / data-radius / data-animated.
    // Intentionally no cleanup: attributes stay on <html> across re-renders,
    // removing them would cause a 1-frame flicker.
    useEffect(() => {
        const root = document.documentElement

        if (currentPalette) {
            root.setAttribute(SAASFLARE_DATA_ATTR.palette, currentPalette)
        } else {
            root.removeAttribute(SAASFLARE_DATA_ATTR.palette)
        }

        root.setAttribute(SAASFLARE_DATA_ATTR.style, currentStyle)
        root.setAttribute(SAASFLARE_DATA_ATTR.radius, currentRadius)
        root.setAttribute(SAASFLARE_DATA_ATTR.animated, String(effectiveAnimated))
    }, [currentPalette, currentStyle, currentRadius, effectiveAnimated])

    return (
        <LazyMotion features={domAnimation} strict>
            <ThemeProvider
                attribute="class"
                defaultTheme={theme}
                enableSystem
                storageKey={themeStorageKey}
                disableTransitionOnChange
            >
                {scriptHtml !== null && (
                    <script
                        nonce={scriptNonce}
                        dangerouslySetInnerHTML={{ __html: scriptHtml }}
                    />
                )}
                <SaasflareThemeContext.Provider
                    value={{
                        palette: currentPalette,
                        surface: currentStyle,
                        radius: currentRadius,
                        iconWeight: currentIconWeight,
                        setPalette,
                        setSurface,
                        setRadius,
                        setIconWeight,
                    }}
                >
                    <AnimationContext.Provider value={{ animated: effectiveAnimated }}>
                        {isCustomPalette && <CustomPaletteInjector palette={palette} />}
                        <SmoothScrollProvider enabled={smoothScrolling}>
                            {children}
                        </SmoothScrollProvider>
                    </AnimationContext.Provider>
                </SaasflareThemeContext.Provider>
            </ThemeProvider>
        </LazyMotion>
    )
}
