"use client"

/**
 * @fileoverview Live theme playground — the second pillar of the pitch.
 *
 * Writes the SAME persisted prefs blob the catalog uses (`CATALOG_PREFS_KEY`
 * via `useLocalStorage` + a cookie mirror), so picking a palette / surface /
 * radius here repaints the ENTIRE page through `SaasflareShell` — proving the
 * "one codebase, infinite brands" claim in real time. See `app/layout.tsx` for
 * the propagation chain.
 */
import { useEffect, useState } from "react"
import { Badge, Button, Progress, Switch, cn, useLocalStorage } from "@saasflare/ui"
import {
    CATALOG_COOKIE_MAX_AGE,
    CATALOG_DEFAULTS,
    CATALOG_PREFS_KEY,
    PALETTES,
    RADII,
    SURFACES,
    serializeCatalogPrefs,
    type CatalogPrefs,
    type PaletteId,
    type RadiusId,
    type SurfaceId,
} from "../../lib/catalog-prefs"
import {
    PALETTE_SWATCH_FALLBACK_DARK,
    PALETTE_SWATCH_FALLBACK_LIGHT,
    readPaletteSwatches,
} from "../../lib/palette-swatches"

/** Human-friendly labels for the radius axis. */
const RADIUS_LABEL: Record<RadiusId, string> = {
    sharp: "Sharp",
    soft: "Soft",
    rounded: "Rounded",
    pill: "Pill",
}

const SURFACE_LABEL: Record<SurfaceId, string> = {
    flat: "Flat",
    glass: "Glass",
    clay: "Clay",
}

/**
 * Interactive palette / surface / radius switcher with a live preview cluster.
 * The switcher mutates the shared catalog prefs blob; `SaasflareShell`
 * (mounted in the root layout) observes the change and re-themes the page.
 */
export function ThemePlayground() {
    const [prefs, setPrefs] = useLocalStorage<CatalogPrefs>(CATALOG_PREFS_KEY, CATALOG_DEFAULTS)
    const [mounted, setMounted] = useState(false)
    const [swatches, setSwatches] = useState<Record<PaletteId, string>>(
        PALETTE_SWATCH_FALLBACK_DARK,
    )

    useEffect(() => setMounted(true), [])

    // Color each dot in its own palette's accent. The `:root[data-palette]`
    // selector only themes the document root, so we read each palette's live
    // `--primary` triple after paint (snap to the fallback map first).
    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark")
        setSwatches(isDark ? PALETTE_SWATCH_FALLBACK_DARK : PALETTE_SWATCH_FALLBACK_LIGHT)
        const raf = requestAnimationFrame(() => {
            const next = readPaletteSwatches()
            if (next) setSwatches(next)
        })
        return () => cancelAnimationFrame(raf)
    }, [prefs.themeMode])

    // Mirror prefs into the cookie so a full reload (SSR) keeps the choice.
    useEffect(() => {
        try {
            document.cookie =
                `${CATALOG_PREFS_KEY}=${encodeURIComponent(serializeCatalogPrefs(prefs))}` +
                `; max-age=${CATALOG_COOKIE_MAX_AGE}; path=/; samesite=lax`
        } catch {
            /* document.cookie can throw in sandboxed contexts */
        }
    }, [prefs])

    const active = mounted ? prefs : CATALOG_DEFAULTS

    return (
        <section className="mx-auto max-w-6xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    One codebase. Infinite brands.
                </h2>
                <p className="mt-4 text-balance text-muted-foreground">
                    Palette, surface, and radius are runtime tokens — not rebuilds. Click around;
                    the whole page re-themes live. Ship the same components with every customer&apos;s
                    brand.
                </p>
            </div>

            <div className="mt-12 grid gap-8 rounded-2xl border bg-fd-card p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
                {/* Controls */}
                <div className="flex flex-col gap-6">
                    <div>
                        <span className="text-xs font-medium text-muted-foreground">Palette</span>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {PALETTES.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    aria-label={p}
                                    aria-pressed={active.palette === p}
                                    onClick={() => setPrefs((prev) => ({ ...prev, palette: p }))}
                                    title={p}
                                    style={{ background: swatches[p] }}
                                    className={cn(
                                        "size-7 rounded-full border border-border/60 transition-transform hover:scale-110",
                                        active.palette === p &&
                                            "scale-110 ring-2 ring-ring ring-offset-2 ring-offset-background",
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-8">
                        <div>
                            <span className="text-xs font-medium text-muted-foreground">Surface</span>
                            <div className="mt-2 flex gap-2">
                                {SURFACES.map((s) => (
                                    <Button
                                        key={s}
                                        size="sm"
                                        variant={active.surface === s ? "solid" : "outline"}
                                        intent={active.surface === s ? "primary" : "neutral"}
                                        onClick={() =>
                                            setPrefs((prev) => ({ ...prev, surface: s as SurfaceId }))
                                        }
                                    >
                                        {SURFACE_LABEL[s]}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-muted-foreground">Radius</span>
                            <div className="mt-2 flex gap-2">
                                {RADII.map((r) => (
                                    <Button
                                        key={r}
                                        size="sm"
                                        variant={active.radius === r ? "solid" : "outline"}
                                        intent={active.radius === r ? "primary" : "neutral"}
                                        onClick={() =>
                                            setPrefs((prev) => ({ ...prev, radius: r as RadiusId }))
                                        }
                                    >
                                        {RADIUS_LABEL[r]}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live preview cluster */}
                <div className="flex flex-col gap-4 rounded-xl border bg-background p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Preview</span>
                        <Badge intent="success" variant="soft">
                            Live
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button intent="primary" size="sm">
                            Primary
                        </Button>
                        <Button intent="neutral" variant="soft" size="sm">
                            Soft
                        </Button>
                        <Button intent="primary" variant="outline" size="sm">
                            Outline
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge intent="primary">New</Badge>
                        <Badge intent="warning" variant="soft">
                            Beta
                        </Badge>
                        <Badge intent="info" variant="outline">
                            Info
                        </Badge>
                    </div>
                    <Progress value={66} />
                    <div className="flex items-center gap-2">
                        <Switch defaultChecked id="playground-switch" />
                        <label htmlFor="playground-switch" className="text-sm text-muted-foreground">
                            Notifications
                        </label>
                    </div>
                </div>
            </div>
        </section>
    )
}
