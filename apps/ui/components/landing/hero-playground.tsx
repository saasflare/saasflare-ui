"use client"

/**
 * @fileoverview Hero — pitch, live brand bar, and a working product collage.
 *
 * The first viewport IS the playground: the palette dots and surface/radius
 * toggles mutate the shared catalog prefs blob, so one click rebrands the
 * entire page (SaasflareShell in the root layout observes the change). The
 * right column is a real composed dashboard card — every control on it works.
 * Replaces the former separate Hero + ThemePlayground + Install sections.
 */
import Link from "next/link"
import { useEffect, useState } from "react"
import {
    AuroraBackground,
    Badge,
    BorderBeam,
    Button,
    CodeBlock,
    FlipWords,
    GradientText,
    Icons,
    Kbd,
    MetricCard,
    Progress,
    ShimmerButton,
    SparkChart,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ToggleGroup,
    ToggleGroupItem,
    UserAvatar,
    cn,
    useLocalStorage,
} from "@saasflare/ui"
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

const RADIUS_LABEL: Record<RadiusId, string> = {
    sharp: "Sharp",
    soft: "Soft",
    rounded: "Round",
    pill: "Pill",
}

const SURFACE_LABEL: Record<SurfaceId, string> = {
    flat: "Flat",
    glass: "Glass",
    clay: "Clay",
}

const SPARK_DATA = [12, 18, 14, 22, 19, 28, 24, 34, 30, 41, 38, 48]

interface HeroPlaygroundProps {
    /** Published package version (read server-side from @saasflare/ui/package.json). */
    readonly version: string
    /** Registry component count (read server-side from registry.json). */
    readonly componentCount: number
}

/** Above-the-fold hero: pitch + brand bar (left), live dashboard collage (right). */
export function HeroPlayground({ version, componentCount }: HeroPlaygroundProps) {
    const [prefs, setPrefs] = useLocalStorage<CatalogPrefs>(CATALOG_PREFS_KEY, CATALOG_DEFAULTS)
    const [mounted, setMounted] = useState(false)
    const [swatches, setSwatches] = useState<Record<PaletteId, string>>(
        PALETTE_SWATCH_FALLBACK_DARK,
    )

    useEffect(() => setMounted(true), [])

    // Tint each dot in its own palette's accent (read live after paint).
    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark")
        setSwatches(isDark ? PALETTE_SWATCH_FALLBACK_DARK : PALETTE_SWATCH_FALLBACK_LIGHT)
        const raf = requestAnimationFrame(() => {
            const next = readPaletteSwatches()
            if (next) setSwatches(next)
        })
        return () => cancelAnimationFrame(raf)
    }, [prefs.themeMode])

    // Cookie mirror so a full reload (SSR) keeps the brand choice.
    useEffect(() => {
        try {
            document.cookie =
                `${CATALOG_PREFS_KEY}=${encodeURIComponent(serializeCatalogPrefs(prefs))}` +
                `; max-age=${CATALOG_COOKIE_MAX_AGE}; path=/; samesite=lax`
        } catch {
            /* sandboxed contexts */
        }
    }, [prefs])

    const active = mounted ? prefs : CATALOG_DEFAULTS

    return (
        <section className="relative overflow-hidden">
            {/* Ambient backdrop — token-driven, so it rebrands with the palette. */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
                <AuroraBackground
                    className="h-full w-full"
                    colors={["var(--primary)", "var(--chart-2)", "var(--chart-3)"]}
                    intensity={0.3}
                />
            </div>

            <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-12 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
                {/* ── Pitch ── */}
                <div className="flex flex-col items-start text-left">
                    <Badge variant="soft" intent="primary" className="mb-5 gap-1.5">
                        <Icons.sparkles className="size-3" />
                        v{version} · {componentCount} components · MIT
                    </Badge>

                    <h1 className="max-w-xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]">
                        Components your <GradientText>AI already understands</GradientText>.
                    </h1>

                    <p className="mt-5 max-w-lg text-balance text-lg leading-relaxed text-muted-foreground">
                        {componentCount} React + Tailwind v4 components with an MCP server and{" "}
                        <code className="rounded bg-muted px-1 py-0.5 text-sm">llms.txt</code> built
                        in —{" "}
                        {/* Positioned overflow-hidden cage: FlipWords' exiting word is
                          * absolutely positioned and flies up-right (scale 2 + blur) — without
                          * `relative` the clip doesn't apply and it smears across the collage. */}
                        <span className="relative inline-block min-w-[6.8rem] overflow-hidden align-bottom">
                            <FlipWords
                                words={["animated", "accessible", "typed", "RSC-ready", "themeable"]}
                                className="font-medium text-foreground"
                            />
                        </span>{" "}
                        by default.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <ShimmerButton onClick={() => (window.location.href = "/docs/getting-started")}>
                            Get started
                        </ShimmerButton>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/catalog">
                                Browse components
                                <Icons.chevronRight className="size-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="GitHub repository" asChild>
                            <a
                                href="https://github.com/saasflare/saasflare-ui"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icons.github className="size-5" />
                            </a>
                        </Button>
                    </div>

                    <CodeBlock
                        code="pnpm add @saasflare/ui"
                        language="bash"
                        className="mt-5 w-full max-w-sm"
                    />

                    {/* ── Brand bar: the page re-themes live ── */}
                    <div className="mt-8 w-full rounded-xl border bg-card/60 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <Icons.palette className="size-3.5" />
                                Make it yours — this page re-themes live
                            </span>
                            <Badge variant="soft" intent="success" className="hidden sm:inline-flex">
                                {PALETTES.length} brands
                            </Badge>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {PALETTES.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    aria-label={`Palette ${p}`}
                                    aria-pressed={active.palette === p}
                                    title={p}
                                    onClick={() => setPrefs((prev) => ({ ...prev, palette: p }))}
                                    style={{ background: swatches[p] }}
                                    className={cn(
                                        "size-5 rounded-full border border-border/60 transition-transform hover:scale-125",
                                        active.palette === p &&
                                            "scale-125 ring-2 ring-ring ring-offset-2 ring-offset-background",
                                    )}
                                />
                            ))}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                            <ToggleGroup
                                type="single"
                                size="sm"
                                value={active.surface}
                                onValueChange={(v) =>
                                    v && setPrefs((prev) => ({ ...prev, surface: v as SurfaceId }))
                                }
                                aria-label="Surface style"
                            >
                                {SURFACES.map((s) => (
                                    <ToggleGroupItem key={s} value={s}>
                                        {SURFACE_LABEL[s]}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                            <ToggleGroup
                                type="single"
                                size="sm"
                                value={active.radius}
                                onValueChange={(v) =>
                                    v && setPrefs((prev) => ({ ...prev, radius: v as RadiusId }))
                                }
                                aria-label="Corner radius"
                            >
                                {RADII.map((r) => (
                                    <ToggleGroupItem key={r} value={r}>
                                        {RADIUS_LABEL[r]}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>
                    </div>
                </div>

                {/* ── Live collage: a real composed dashboard, not a screenshot ── */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                    <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-xl">
                        <BorderBeam />

                        <div className="flex items-center gap-3">
                            <UserAvatar src={null} name="Acme Inc" initials="AC" size="md" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">Acme Analytics</p>
                                <p className="truncate text-xs text-muted-foreground">
                                    acme.saasflare.io
                                </p>
                            </div>
                            <Badge intent="success" variant="soft">
                                Live
                            </Badge>
                        </div>

                        <Tabs defaultValue="overview" className="mt-4">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-4 flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <MetricCard
                                        label="MRR"
                                        value="$48,210"
                                        trend={{ value: 12.4, direction: "up" }}
                                    />
                                    <MetricCard
                                        label="Active users"
                                        value="8,431"
                                        trend={{ value: 3.2, direction: "up" }}
                                    />
                                </div>
                                <div className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Revenue · last 12 weeks</span>
                                        <span className="font-medium text-success">+41%</span>
                                    </div>
                                    <SparkChart
                                        data={SPARK_DATA}
                                        width={300}
                                        height={52}
                                        className="mt-2 w-full"
                                        aria-label="Revenue trend, last 12 weeks"
                                    />
                                </div>
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Storage</span>
                                        <span>72%</span>
                                    </div>
                                    <Progress value={72} />
                                </div>
                            </TabsContent>

                            <TabsContent value="activity" className="mt-4 flex flex-col gap-2">
                                {(
                                    [
                                        ["JD", "Jane deployed v2.4.0", "2m ago", "success"],
                                        ["ML", "Marcus invited 3 teammates", "1h ago", "info"],
                                        ["AR", "Ava upgraded to Pro", "3h ago", "primary"],
                                    ] as const
                                ).map(([initials, text, time, intent]) => (
                                    <div
                                        key={text}
                                        className="flex items-center gap-3 rounded-lg border px-3 py-2"
                                    >
                                        <UserAvatar src={null} name={text} initials={initials} size="sm" />
                                        <p className="min-w-0 flex-1 truncate text-sm">{text}</p>
                                        <Badge intent={intent} variant="soft" className="shrink-0">
                                            {time}
                                        </Badge>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="settings" className="mt-4 flex flex-col gap-3">
                                {(
                                    [
                                        ["Email notifications", true],
                                        ["Public profile", false],
                                        ["Weekly digest", true],
                                    ] as const
                                ).map(([label, on]) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <span className="text-sm">{label}</span>
                                        <Switch defaultChecked={on} aria-label={label} size="sm" />
                                    </div>
                                ))}
                                <div className="mt-1 flex justify-end gap-2">
                                    <Button variant="ghost" intent="neutral" size="sm">
                                        Cancel
                                    </Button>
                                    <Button intent="primary" size="sm">
                                        Save changes
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Floating accents — overlap sells "composed from real parts". */}
                    <div className="absolute -top-5 -right-3 hidden -rotate-3 items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-lg sm:flex">
                        <span className="text-xs text-muted-foreground">Command palette</span>
                        <span className="flex gap-1">
                            <Kbd>⌘</Kbd>
                            <Kbd>K</Kbd>
                        </span>
                    </div>
                    <div className="absolute -bottom-4 -left-3 hidden rotate-2 items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-lg sm:flex">
                        <Icons.check className="size-4 text-success" />
                        <span className="text-xs font-medium">Deployed · just now</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
