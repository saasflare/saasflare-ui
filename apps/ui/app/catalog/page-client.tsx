// @reviewed 2026-05-09
"use client"

/**
 * @fileoverview Ultra-compact catalog of every @saasflare/ui surface.
 * Grouped by category, each component shows its full permutation matrix.
 */

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Alert,
    AlertDescription,
    AlertTitle,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
    Badge,
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Button,
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CheckCircleIcon,
    CheckIcon,
    Checkbox,
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    DataToolbar,
    DataToolbarActions,
    DataToolbarFilters,
    DataToolbarSearch,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyState,
    EmptyTitle,
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    GoogleAuthButton,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    InfoIcon,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
    Kbd,
    KbdGroup,
    Label,
    MagnifyingGlassIcon,
    MetricCard,
    NativeSelect,
    NativeSelectOption,
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Popover,
    PopoverContent,
    PopoverTrigger,
    PricingCard,
    Progress,
    RadioGroup,
    RadioGroupItem,
    ScrollArea,
    SearchField,
    SectionCard,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Separator,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Skeleton,
    Slider,
    Spinner,
    StatefulButton,
    Switch,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
    ThemeModeMultiToggle,
    ThemeModeToggle,
    Toggle,
    ToggleGroup,
    ToggleGroupItem,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    UserAvatar,
    WarningIcon,
    XCircleIcon,
    useLocalStorage,
} from "@saasflare/ui"
import {
    AppleAuthButton, DiscordAuthButton, FacebookAuthButton, GitHubAuthButton, LinkedInAuthButton,
    MicrosoftAuthButton, SlackAuthButton, XAuthButton,
} from "@saasflare/ui"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import {
    CATALOG_COOKIE_MAX_AGE,
    CATALOG_PREFS_KEY,
    ICON_WEIGHTS,
    PALETTES,
    RADII,
    SURFACES,
    THEME_MODES,
    resolveDark,
    serializeCatalogPrefs,
    type CatalogPrefs,
    type IconWeightId,
    type PaletteId,
    type RadiusId,
    type SurfaceId,
    type ThemeMode,
} from "@/lib/catalog-prefs"
import {
    PALETTE_SWATCH_FALLBACK_DARK,
    PALETTE_SWATCH_FALLBACK_LIGHT,
    readPaletteSwatches,
} from "@/lib/palette-swatches"

/* ─── Local primitives ──────────────────────────────────────────── */

const VARIANTS = ["solid", "soft", "outline", "ghost", "link", "shadow"] as const
const INTENTS = ["primary", "neutral", "success", "warning", "danger", "info"] as const
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const
const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const
const BADGE_VARIANTS = ["solid", "soft", "outline"] as const


function Group({ title, children, cols = 2 }: { title: string; children: React.ReactNode; cols?: number }) {
    return (
        <section className="w-full">
            <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {title}
            </h2>
            <div className="rounded-[14px] border bg-card/40 p-3" style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
                {children}
            </div>
        </section>
    )
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5 rounded-[10px] border border-dashed border-border/60 p-2">
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="flex flex-wrap items-center gap-1.5">{children}</div>
        </div>
    )
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function CatalogClient({ initialPrefs }: { initialPrefs: CatalogPrefs }) {
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(42)
    const [slider, setSlider] = useState([60])
    const [tab, setTab] = useState("overview")
    const [toggle, setToggle] = useState("center")
    const [checked, setChecked] = useState(true)
    const [switched, setSwitched] = useState(true)
    const [combo, setCombo] = useState<string>("")

    /* ── Global axes — single source of truth is the catalog's prefs blob.
     * The SaasflareShell now uses `storageKey={CATALOG_PREFS_KEY}` (see
     * layout.tsx) so writes to that key propagate to the Shell's
     * `SaasflareThemeContext` + `AnimationContext` via the `sf-ls:` event
     * fired by `use-local-storage`. We never call Shell setters from here —
     * doing so would clobber catalog-only fields (smoothScrolling, themeMode). */
    const { theme: nextTheme, resolvedTheme, setTheme } = useTheme()

    // All header axes in one localStorage-backed blob, seeded with the prefs
    // the Server Component just read from the `sf-catalog-prefs` cookie. SSR
    // HTML and the first client render now use the same values → no hydration
    // mismatch and no flicker. `useLocalStorage`'s post-mount effect will sync
    // in any drift from localStorage (e.g. a sibling tab edited it).
    const [prefs, setPrefs] = useLocalStorage<CatalogPrefs>(CATALOG_PREFS_KEY, initialPrefs)
    const { palette, surface, radius, animated, smoothScrolling, iconWeight, themeMode } = prefs

    // Per-axis setters — keep the JSX call sites unchanged.
    const setPalette = (p: PaletteId) => setPrefs((prev) => ({ ...prev, palette: p }))
    const setSurface = (s: SurfaceId) => setPrefs((prev) => ({ ...prev, surface: s }))
    const setRadius = (r: RadiusId) => setPrefs((prev) => ({ ...prev, radius: r }))
    const setAnimated = (a: boolean) => setPrefs((prev) => ({ ...prev, animated: a }))
    const setSmoothScrolling = (s: boolean) => setPrefs((prev) => ({ ...prev, smoothScrolling: s }))
    const setIconWeightAxis = (w: IconWeightId) =>
        setPrefs((prev) => ({ ...prev, iconWeight: w }))

    // Pick the swatch-fallback map that matches the initial themeMode so the
    // header dots paint with the right colors from frame one — important for
    // achromatic palettes that invert (notably `black`: white in dark mode,
    // pure black in light mode).
    const [swatches, setSwatches] = useState<Record<PaletteId, string>>(() =>
        resolveDark(initialPrefs.themeMode)
            ? PALETTE_SWATCH_FALLBACK_DARK
            : PALETTE_SWATCH_FALLBACK_LIGHT,
    )

    // Pull swatch colors from the live CSS palette tokens so the dots in the
    // header always match what the buttons would actually render.
    //
    // Snap-then-verify: switching theme would otherwise wait on `readPaletteSwatches`,
    // which writes-then-reads `<html data-palette>` for every preset and forces 20+
    // synchronous style recalcs before React paints anything — a clearly
    // perceptible delay on the dark/light toggle. Instead:
    //   1. immediately swap to the pre-computed fallback map matching the
    //      current `.dark` class on <html> — cheap object swap, paints fast.
    //   2. on the next animation frame, run the live CSS-var read as a
    //      verification pass. With the fallback maps mirroring palettes.css,
    //      step 2 usually produces an identical map and the second setState
    //      bails out, but it catches any drift if palettes.css is edited.
    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark")
        setSwatches(isDark ? PALETTE_SWATCH_FALLBACK_DARK : PALETTE_SWATCH_FALLBACK_LIGHT)
        const raf = requestAnimationFrame(() => {
            const next = readPaletteSwatches(PALETTES)
            if (next) setSwatches(next)
        })
        return () => cancelAnimationFrame(raf)
    }, [resolvedTheme])

    // Used inline below — memoize so the style objects don't change identity
    // and trigger needless reconciliation on every render.
    const swatchStyles = useMemo(
        () =>
            Object.fromEntries(
                PALETTES.map((p) => [p, { background: swatches[p] }] as const),
            ) as Record<PaletteId, { background: string }>,
        [swatches],
    )

    // One-shot bridge + mirror between our prefs cookie (server-readable) and
    // `next-themes` localStorage (drives the `.dark` class on <html>).
    //
    // First run after next-themes mounts: push our cookie value INTO next-themes
    // so localStorage matches. From then on, only mirror in the other direction
    // (user clicks the toggle → next-themes updates → write back to prefs/cookie).
    //
    // Doing both directions in two separate effects deadlocks each other on
    // every toggle: effect A reverts what effect B just did, and vice versa,
    // tripping React's "Maximum update depth exceeded" guard.
    const themeBridgeReady = useRef(false)
    useEffect(() => {
        if (nextTheme === undefined) return
        if (!themeBridgeReady.current) {
            themeBridgeReady.current = true
            if (nextTheme !== themeMode) setTheme(themeMode)
            return
        }
        if (!(THEME_MODES as readonly string[]).includes(nextTheme)) return
        if (nextTheme !== themeMode) {
            setPrefs((prev) => ({ ...prev, themeMode: nextTheme as ThemeMode }))
        }
    }, [nextTheme, themeMode, setTheme, setPrefs])

    // Side effects this catalog owns directly:
    //   - `scroll-behavior` — SaasflareShell's SmoothScrollProvider only writes
    //     it ONCE on mount; toggling requires us to write the inline style
    //     so the new value wins via CSS specificity (inline > UA).
    //   - cookie — surfaces the latest prefs to the next full request
    //     (hard refresh, new tab) so the Server Component reads consistently.
    //
    // Palette / surface / radius / animated / iconWeight are NOT touched here:
    // the SaasflareProvider inside SaasflareShell now reads the same
    // CATALOG_PREFS_KEY localStorage blob (see layout.tsx), so when `setPrefs`
    // writes the blob and fires the `sf-ls:CATALOG_PREFS_KEY` event the Shell
    // re-renders, its data-* effect re-fires, and the SaasflareThemeContext +
    // AnimationContext propagate fresh values to every consumer below.
    useEffect(() => {
        document.documentElement.style.scrollBehavior = smoothScrolling ? "smooth" : "auto"
        try {
            document.cookie =
                `${CATALOG_PREFS_KEY}=${encodeURIComponent(serializeCatalogPrefs(prefs))}` +
                `; max-age=${CATALOG_COOKIE_MAX_AGE}; path=/; samesite=lax`
        } catch {
            /* document.cookie can throw in obscure sandboxed contexts */
        }
    }, [smoothScrolling, prefs])

    const fire = () => {
        setLoading(true)
        setTimeout(() => setLoading(false), 1500)
    }

    return (
        <TooltipProvider delayDuration={120}>
            <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6 text-sm">
                <header className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Saasflare UI · Component Catalog</h1>
                    <p className="text-xs text-muted-foreground">
                        Every export, every variant — ultra compact, grouped by family.
                    </p>
                </header>

                {/* ── GLOBAL CONTROL BAR ──────────────────────────── */}
                <div className="sticky top-0 z-40 -mx-6 border-y bg-background/85 px-6 py-2.5 backdrop-blur-md">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {/* palette */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">palette</span>
                            <div className="flex flex-wrap items-center gap-2.5">
                                {PALETTES.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        aria-label={p}
                                        aria-pressed={palette === p}
                                        onClick={() => setPalette(p)}
                                        className={
                                            "size-5 rounded-full border transition-transform " +
                                            (palette === p
                                                ? "ring-2 ring-ring ring-offset-2 ring-offset-background border-transparent scale-110"
                                                : "border-border/60 hover:scale-110")
                                        }
                                        style={swatchStyles[p]}
                                        title={p}
                                    />
                                ))}
                            </div>
                        </div>

                        <Separator orientation="vertical" className="h-6" />

                        {/* surface */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">surface</span>
                            <ToggleGroup
                                type="single"
                                value={surface}
                                onValueChange={(v) => v && setSurface(v as SurfaceId)}
                                size="sm"
                            >
                                {SURFACES.map((s) => (
                                    <ToggleGroupItem key={s} value={s} className="px-2 text-[11px]">
                                        {s}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>

                        <Separator orientation="vertical" className="h-6" />

                        {/* radius */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">radius</span>
                            <ToggleGroup
                                type="single"
                                value={radius}
                                onValueChange={(v) => v && setRadius(v as RadiusId)}
                                size="sm"
                            >
                                {RADII.map((r) => (
                                    <ToggleGroupItem key={r} value={r} className="px-2 text-[11px]">
                                        {r}
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>

                        <Separator orientation="vertical" className="h-6" />

                        {/* iconWeight */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">icon weight</span>
                            <ToggleGroup
                                type="single"
                                value={iconWeight}
                                onValueChange={(v) => v && setIconWeightAxis(v as IconWeightId)}
                                size="sm"
                            >
                                {ICON_WEIGHTS.map((w) => (
                                    <ToggleGroupItem key={w} value={w} className="px-2 text-[11px]">
                                        <MagnifyingGlassIcon weight={w} className="size-3.5" />
                                        <span className="ml-1">{w}</span>
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                        </div>

                        <Separator orientation="vertical" className="h-6" />

                        {/* animated */}
                        <Label className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">animated</span>
                            <Switch checked={animated} onCheckedChange={setAnimated} size="sm" />
                        </Label>

                        <Separator orientation="vertical" className="h-6" />

                        {/* smooth scrolling */}
                        <Label className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">smooth scroll</span>
                            <Switch checked={smoothScrolling} onCheckedChange={setSmoothScrolling} size="sm" />
                        </Label>

                        <Separator orientation="vertical" className="h-6" />

                        {/* theme mode */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">mode</span>
                            <ThemeModeMultiToggle
                                appearance="icon"
                                size="sm"
                                initialMode={initialPrefs.themeMode}
                            />
                        </div>
                    </div>
                </div>

                {/* ── COMPONENT-LEVEL OVERRIDES ───────────────────── */}
                {/*
                    Demonstrates that a component-level prop overrides the
                    provider default set by the global toolbar. Each cell
                    starts with an "inherit" row (no prop on the component →
                    picks up whatever the provider currently has) followed by
                    explicit-override rows so you can A/B which side wins.
                    Use `useSaasflareProps` resolution order: component prop >
                    provider context > hardcoded default.
                */}
                <Group title="Component overrides · prop > provider default" cols={1}>
                    <Cell label="surface · Button · Badge · Card · Input">
                        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                            <div className="contents">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                    inherit ({surface})
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button size="sm">Button</Button>
                                    <Button variant="outline" intent="neutral" size="sm">Outline</Button>
                                    <Badge intent="primary">Badge</Badge>
                                    <Badge variant="soft" intent="success">Soft</Badge>
                                    <Card className="px-3 py-1.5 text-xs">Card (inherits {surface})</Card>
                                    <Input placeholder={`surface=inherit (${surface})`} className="w-40" />
                                </div>
                            </div>
                            {SURFACES.map((s) => (
                                <div key={s} className="contents">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">surface={s}</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button surface={s} size="sm">Button</Button>
                                        <Button surface={s} variant="outline" intent="neutral" size="sm">Outline</Button>
                                        <Badge surface={s} intent="primary">Badge</Badge>
                                        <Badge surface={s} variant="soft" intent="success">Soft</Badge>
                                        <Card surface={s} className="px-3 py-1.5 text-xs">Card surface={s}</Card>
                                        <Input surface={s} placeholder={`surface=${s}`} className="w-40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Cell>
                    <Cell label="radius · Button · Badge · Card · Input · Avatar">
                        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                            <div className="contents">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                    inherit ({radius})
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button size="sm">Button</Button>
                                    <Button variant="outline" intent="neutral" size="sm">Outline</Button>
                                    <Badge intent="primary">Badge</Badge>
                                    <Badge variant="soft" intent="info">Soft</Badge>
                                    <Card className="px-3 py-1.5 text-xs">Card</Card>
                                    <Input placeholder={`radius=inherit (${radius})`} className="w-36" />
                                    <Avatar><AvatarFallback>CM</AvatarFallback></Avatar>
                                </div>
                            </div>
                            {RADII.map((r) => (
                                <div key={r} className="contents">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">radius={r}</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button radius={r} size="sm">Button</Button>
                                        <Button radius={r} variant="outline" intent="neutral" size="sm">Outline</Button>
                                        <Badge radius={r} intent="primary">Badge</Badge>
                                        <Badge radius={r} variant="soft" intent="info">Soft</Badge>
                                        <Card radius={r} className="px-3 py-1.5 text-xs">Card</Card>
                                        <Input radius={r} placeholder={`radius=${r}`} className="w-36" />
                                        <Avatar radius={r}><AvatarFallback>CM</AvatarFallback></Avatar>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Cell>
                    <Cell label="animated · hover/tap to feel the difference">
                        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                            <div className="contents">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                    inherit ({String(animated)})
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button size="sm">Hover/tap me</Button>
                                    <Button variant="outline" intent="neutral" size="sm">Outline</Button>
                                    <Badge intent="primary">Badge</Badge>
                                    <Card className="px-3 py-1.5 text-xs">Card</Card>
                                </div>
                            </div>
                            {[true, false].map((a) => (
                                <div key={String(a)} className="contents">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                        animated={String(a)}
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button animated={a} size="sm">Hover/tap me</Button>
                                        <Button animated={a} variant="outline" intent="neutral" size="sm">Outline</Button>
                                        <Badge animated={a} intent="primary">Badge</Badge>
                                        <Card animated={a} className="px-3 py-1.5 text-xs">Card</Card>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Cell>
                    <Cell label="iconWeight · raw glyphs + Button propagation">
                        <div className="grid w-full grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                            <div className="contents">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                    inherit ({iconWeight})
                                </span>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-foreground">
                                        <InfoIcon className="size-5" />
                                        <CheckCircleIcon className="size-5" />
                                        <WarningIcon className="size-5" />
                                        <XCircleIcon className="size-5" />
                                        <MagnifyingGlassIcon className="size-5" />
                                    </div>
                                    <Button size="sm" variant="outline" intent="neutral">
                                        <MagnifyingGlassIcon /> Search
                                    </Button>
                                    <GoogleAuthButton className="w-auto" />
                                </div>
                            </div>
                            {ICON_WEIGHTS.map((w) => (
                                <div key={w} className="contents">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">iconWeight={w}</span>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-foreground">
                                            <InfoIcon weight={w} className="size-5" />
                                            <CheckCircleIcon weight={w} className="size-5" />
                                            <WarningIcon weight={w} className="size-5" />
                                            <XCircleIcon weight={w} className="size-5" />
                                            <MagnifyingGlassIcon weight={w} className="size-5" />
                                        </div>
                                        <Button size="sm" variant="outline" intent="neutral">
                                            <MagnifyingGlassIcon weight={w} /> Search
                                        </Button>
                                        <GoogleAuthButton iconWeight={w} className="w-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Cell>
                </Group>

                {/* ── BUTTONS ─────────────────────────────────────── */}
                <Group title="Buttons · variants × intents" cols={1}>
                    {VARIANTS.map((v) => (
                        <Cell key={v} label={`variant=${v}`}>
                            {INTENTS.map((i) => (
                                <Button key={i} variant={v} intent={i} size="xs">{i}</Button>
                            ))}
                        </Cell>
                    ))}
                </Group>

                <Group title="Buttons · sizes & icon sizes" cols={2}>
                    <Cell label="size">
                        {SIZES.map((s) => (
                            <Button key={s} size={s} variant="solid">{s}</Button>
                        ))}
                    </Cell>
                    <Cell label="icon sizes">
                        {ICON_SIZES.map((s) => (
                            <Button key={s} size={s} variant="outline" intent="neutral" aria-label={s}>
                                <MagnifyingGlassIcon />
                            </Button>
                        ))}
                    </Cell>
                    <Cell label="states">
                        <Button variant="solid">Idle</Button>
                        <Button variant="solid" disabled>Disabled</Button>
                        <Button variant="outline" intent="danger">With <XCircleIcon /></Button>
                        <Button variant="solid" fullWidth>fullWidth</Button>
                    </Cell>
                    <Cell label="StatefulButton">
                        <StatefulButton onClick={fire} loading={loading} loadingText="Loading…">
                            Trigger
                        </StatefulButton>
                        <StatefulButton variant="outline" intent="neutral" loading={loading}>
                            No text swap
                        </StatefulButton>
                    </Cell>
                </Group>

                <Group title="ButtonGroup" cols={2}>
                    <Cell label="horizontal">
                        <ButtonGroup>
                            <Button variant="outline" intent="neutral">Left</Button>
                            <Button variant="outline" intent="neutral">Mid</Button>
                            <Button variant="outline" intent="neutral">Right</Button>
                        </ButtonGroup>
                    </Cell>
                    <Cell label="with text + separator">
                        <ButtonGroup>
                            <ButtonGroupText>https://</ButtonGroupText>
                            <Button variant="outline" intent="neutral">saasflare.io</Button>
                            <ButtonGroupSeparator />
                            <Button variant="outline" intent="neutral">Copy</Button>
                        </ButtonGroup>
                    </Cell>
                </Group>

                {/* ── BADGES ──────────────────────────────────────── */}
                <Group title="Badges · variants × intents" cols={1}>
                    {BADGE_VARIANTS.map((v) => (
                        <Cell key={v} label={`variant=${v}`}>
                            {INTENTS.map((i) => (
                                <Badge key={i} variant={v} intent={i}>{i}</Badge>
                            ))}
                        </Cell>
                    ))}
                </Group>

                {/* ── ALERTS ──────────────────────────────────────── */}
                <Group title="Alerts · intents" cols={2}>
                    {(["neutral", "info", "success", "warning", "danger"] as const).map((i) => (
                        <Alert key={i} intent={i}>
                            <InfoIcon />
                            <AlertTitle>{i}</AlertTitle>
                            <AlertDescription>Soft alert with intent={i}.</AlertDescription>
                        </Alert>
                    ))}
                </Group>

                {/* ── AVATAR ──────────────────────────────────────── */}
                <Group title="Avatar · sizes, group, badge, UserAvatar" cols={2}>
                    <Cell label="sizes">
                        {(["sm", "default", "lg"] as const).map((s) => (
                            <Avatar key={s} size={s}>
                                <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="user" />
                                <AvatarFallback>CM</AvatarFallback>
                            </Avatar>
                        ))}
                    </Cell>
                    <Cell label="badge + fallback">
                        <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/96?img=8" alt="user" />
                            <AvatarFallback>JD</AvatarFallback>
                            <AvatarBadge className="bg-success" />
                        </Avatar>
                        <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
                        <Avatar><AvatarFallback>YZ</AvatarFallback></Avatar>
                    </Cell>
                    <Cell label="AvatarGroup">
                        <AvatarGroup>
                            <Avatar><AvatarImage src="https://i.pravatar.cc/96?img=1" alt="" /><AvatarFallback>A</AvatarFallback></Avatar>
                            <Avatar><AvatarImage src="https://i.pravatar.cc/96?img=2" alt="" /><AvatarFallback>B</AvatarFallback></Avatar>
                            <Avatar><AvatarImage src="https://i.pravatar.cc/96?img=3" alt="" /><AvatarFallback>C</AvatarFallback></Avatar>
                            <AvatarGroupCount>+4</AvatarGroupCount>
                        </AvatarGroup>
                    </Cell>
                    <Cell label="UserAvatar sizes">
                        {(["sm", "md", "lg"] as const).map((s) => (
                            <UserAvatar key={s} src={null} name="Dr. Chris" initials="CM" size={s} />
                        ))}
                    </Cell>
                </Group>

                {/* ── INPUTS ──────────────────────────────────────── */}
                <Group title="Inputs · text, textarea, search, group" cols={2}>
                    <Cell label="Input"><Input placeholder="email@saasflare.io" /></Cell>
                    <Cell label="Input · invalid"><Input aria-invalid placeholder="invalid" defaultValue="bad" /></Cell>
                    <Cell label="Input · disabled"><Input disabled placeholder="disabled" /></Cell>
                    <Cell label="Textarea"><Textarea placeholder="Write something…" /></Cell>
                    <Cell label="SearchField">
                        <SearchField placeholder="Search…" />
                    </Cell>
                    <Cell label="SearchField · loading">
                        <SearchField placeholder="Searching…" loading defaultValue="query" />
                    </Cell>
                    <Cell label="InputGroup">
                        <InputGroup>
                            <InputGroupAddon><MagnifyingGlassIcon /></InputGroupAddon>
                            <InputGroupInput placeholder="Find anything" />
                        </InputGroup>
                    </Cell>
                    <Cell label="NativeSelect">
                        <NativeSelect defaultValue="b">
                            <NativeSelectOption value="a">Option A</NativeSelectOption>
                            <NativeSelectOption value="b">Option B</NativeSelectOption>
                            <NativeSelectOption value="c">Option C</NativeSelectOption>
                        </NativeSelect>
                    </Cell>
                </Group>

                {/* ── TOGGLES ─────────────────────────────────────── */}
                <Group title="Toggles · checkbox, switch, radio, toggle" cols={2}>
                    <Cell label="Checkbox">
                        <Checkbox checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
                        <Checkbox defaultChecked />
                        <Checkbox />
                        <Checkbox disabled />
                    </Cell>
                    <Cell label="Switch">
                        <Switch checked={switched} onCheckedChange={setSwitched} />
                        <Switch size="sm" defaultChecked />
                        <Switch />
                        <Switch disabled />
                    </Cell>
                    <Cell label="RadioGroup">
                        <RadioGroup defaultValue="b" className="flex gap-3">
                            {["a", "b", "c"].map((v) => (
                                <Label key={v} className="flex items-center gap-1.5">
                                    <RadioGroupItem value={v} /> {v}
                                </Label>
                            ))}
                        </RadioGroup>
                    </Cell>
                    <Cell label="Toggle / ToggleGroup">
                        <Toggle aria-label="bold">B</Toggle>
                        <Toggle variant="outline" aria-label="italic">I</Toggle>
                        <ToggleGroup type="single" value={toggle} onValueChange={(v) => v && setToggle(v)}>
                            <ToggleGroupItem value="left">L</ToggleGroupItem>
                            <ToggleGroupItem value="center">C</ToggleGroupItem>
                            <ToggleGroupItem value="right">R</ToggleGroupItem>
                        </ToggleGroup>
                    </Cell>
                </Group>

                {/* ── PROGRESS / SLIDER ──────────────────────────── */}
                <Group title="Progress · spinner · slider · skeleton" cols={2}>
                    <Cell label="Progress">
                        <div className="flex w-full flex-col gap-1.5">
                            <Progress value={progress} className="w-full" />
                            <div className="flex gap-1">
                                <Button size="xs" variant="ghost" intent="neutral" onClick={() => setProgress((p) => Math.max(0, p - 10))}>-</Button>
                                <Button size="xs" variant="ghost" intent="neutral" onClick={() => setProgress((p) => Math.min(100, p + 10))}>+</Button>
                            </div>
                        </div>
                    </Cell>
                    <Cell label="Slider">
                        <Slider value={slider} onValueChange={setSlider} className="w-full" />
                    </Cell>
                    <Cell label="Spinner">
                        <Spinner /><Spinner className="size-5" /><Spinner className="size-7 text-primary" />
                    </Cell>
                    <Cell label="Skeleton">
                        <div className="flex w-full flex-col gap-1.5">
                            <Skeleton as="text" className="h-3 w-2/3" />
                            <Skeleton as="text" className="h-3 w-1/2" />
                            <Skeleton as="card" className="h-10 w-full" />
                        </div>
                    </Cell>
                </Group>

                {/* ── DROPDOWNS / SELECTS ────────────────────────── */}
                <Group title="Select · DropdownMenu · Combobox" cols={2}>
                    <Cell label="Select">
                        <Select defaultValue="apple">
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="cherry">Cherry</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Cell>
                    <Cell label="DropdownMenu">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" intent="neutral" size="sm">Open menu</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Account</DropdownMenuLabel>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </Cell>
                    <Cell label="Combobox">
                        <Combobox>
                            <ComboboxTrigger asChild>
                                <Button variant="outline" intent="neutral" size="sm" className="w-44 justify-between">
                                    {combo || <span className="text-muted-foreground">Pick a framework…</span>}
                                </Button>
                            </ComboboxTrigger>
                            <ComboboxContent>
                                <ComboboxInput placeholder="Search framework…" />
                                <ComboboxEmpty>None found.</ComboboxEmpty>
                                <ComboboxList>
                                    <ComboboxGroup heading="Frameworks">
                                        {["Next.js", "Remix", "Astro", "SvelteKit"].map((f) => (
                                            <ComboboxItem
                                                key={f}
                                                value={f}
                                                selected={combo === f}
                                                onSelect={() => setCombo(f)}
                                            >
                                                {f}
                                            </ComboboxItem>
                                        ))}
                                    </ComboboxGroup>
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Cell>
                </Group>

                {/* ── OVERLAYS ───────────────────────────────────── */}
                <Group title="Overlays · Dialog · AlertDialog · Sheet · Popover · HoverCard · Tooltip" cols={3}>
                    <Cell label="Dialog">
                        <Dialog>
                            <DialogTrigger asChild><Button size="sm">Open dialog</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription>Standard dialog overlay.</DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" intent="neutral">Cancel</Button>
                                    <Button>Confirm</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </Cell>
                    <Cell label="AlertDialog">
                        <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="sm" variant="outline" intent="danger">Delete</Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete account?</AlertDialogTitle>
                                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </Cell>
                    <Cell label="Sheet">
                        <Sheet>
                            <SheetTrigger asChild><Button size="sm" variant="outline" intent="neutral">Open sheet</Button></SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Sheet panel</SheetTitle>
                                    <SheetDescription>Side-anchored content.</SheetDescription>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
                    </Cell>
                    <Cell label="Popover">
                        <Popover>
                            <PopoverTrigger asChild><Button size="sm" variant="ghost" intent="neutral">Popover</Button></PopoverTrigger>
                            <PopoverContent className="text-xs">Floating popover content.</PopoverContent>
                        </Popover>
                    </Cell>
                    <Cell label="HoverCard">
                        <HoverCard openDelay={120}>
                            <HoverCardTrigger asChild><Button size="sm" variant="link">@saasflare</Button></HoverCardTrigger>
                            <HoverCardContent className="text-xs">Hover summary.</HoverCardContent>
                        </HoverCard>
                    </Cell>
                    <Cell label="Tooltip">
                        <Tooltip>
                            <TooltipTrigger asChild><Button size="sm" variant="outline" intent="neutral">Hover me</Button></TooltipTrigger>
                            <TooltipContent>Tooltip text</TooltipContent>
                        </Tooltip>
                    </Cell>
                </Group>

                {/* ── NAV ─────────────────────────────────────────── */}
                <Group title="Navigation · Tabs · Breadcrumb · Pagination" cols={1}>
                    <Cell label="Tabs">
                        <Tabs value={tab} onValueChange={setTab} className="w-full">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="text-xs text-muted-foreground">Overview pane.</TabsContent>
                            <TabsContent value="analytics" className="text-xs text-muted-foreground">Analytics pane.</TabsContent>
                            <TabsContent value="settings" className="text-xs text-muted-foreground">Settings pane.</TabsContent>
                        </Tabs>
                    </Cell>
                    <Cell label="Breadcrumb">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem><BreadcrumbLink href="#">Settings</BreadcrumbLink></BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem><BreadcrumbPage>Billing</BreadcrumbPage></BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </Cell>
                    <Cell label="Pagination">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                                <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                                <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                                <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
                                <PaginationItem><PaginationEllipsis /></PaginationItem>
                                <PaginationItem><PaginationNext href="#" /></PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </Cell>
                </Group>

                {/* ── DISCLOSURE ─────────────────────────────────── */}
                <Group title="Accordion · Item · Field · Form" cols={2}>
                    <Cell label="Accordion">
                        <Accordion type="single" collapsible defaultValue="i1" className="w-full">
                            <AccordionItem value="i1">
                                <AccordionTrigger>Item one</AccordionTrigger>
                                <AccordionContent className="text-xs text-muted-foreground">Body of item one.</AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="i2">
                                <AccordionTrigger>Item two</AccordionTrigger>
                                <AccordionContent className="text-xs text-muted-foreground">Body of item two.</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </Cell>
                    <Cell label="Item">
                        <Item>
                            <ItemMedia><CheckIcon /></ItemMedia>
                            <ItemContent>
                                <ItemTitle>Two-factor auth</ItemTitle>
                                <ItemDescription>Enabled via authenticator app.</ItemDescription>
                            </ItemContent>
                            <ItemActions><Button size="xs" variant="outline" intent="neutral">Manage</Button></ItemActions>
                        </Item>
                    </Cell>
                    <Cell label="Field group">
                        <FieldGroup className="w-full">
                            <Field>
                                <FieldLabel htmlFor="email-fld">Email</FieldLabel>
                                <Input id="email-fld" placeholder="hi@saasflare.io" />
                                <FieldDescription>We never share your email.</FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="pw-fld">Password</FieldLabel>
                                <Input id="pw-fld" type="password" aria-invalid />
                                <FieldError>At least 8 characters.</FieldError>
                            </Field>
                        </FieldGroup>
                    </Cell>
                    <Cell label="Kbd">
                        <KbdGroup>
                            <Kbd>⌘</Kbd>
                            <Kbd>⇧</Kbd>
                            <Kbd>K</Kbd>
                        </KbdGroup>
                        <KbdGroup>
                            <Kbd>Ctrl</Kbd><span>+</span><Kbd>S</Kbd>
                        </KbdGroup>
                    </Cell>
                </Group>

                {/* ── DATA ───────────────────────────────────────── */}
                <Group title="Data · Table · ScrollArea · Separator" cols={1}>
                    <Cell label="Table">
                        <Table>
                            <TableCaption className="text-xs">Recent invoices.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { id: "INV-001", status: "Paid", amt: "$120.00", intent: "success" as const },
                                    { id: "INV-002", status: "Pending", amt: "$240.00", intent: "warning" as const },
                                    { id: "INV-003", status: "Failed", amt: "$60.00", intent: "danger" as const },
                                ].map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.id}</TableCell>
                                        <TableCell><Badge variant="soft" intent={r.intent}>{r.status}</Badge></TableCell>
                                        <TableCell className="text-right">{r.amt}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Cell>
                    <Cell label="ScrollArea">
                        <ScrollArea className="h-24 w-full rounded-md border p-2 text-xs">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="py-0.5">Row {i + 1} — lorem ipsum dolor sit amet.</div>
                            ))}
                        </ScrollArea>
                    </Cell>
                    <Cell label="Separator">
                        <div className="flex w-full items-center gap-2">
                            <span>A</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span>B</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span>C</span>
                        </div>
                        <Separator />
                    </Cell>
                </Group>

                {/* ── COMPOSED ───────────────────────────────────── */}
                <Group title="Composed · MetricCard · PricingCard · SectionCard · Card" cols={3}>
                    <MetricCard label="Revenue" value="$48,200" trend={{ value: 8.2, direction: "up" }} />
                    <MetricCard label="Churn" value="1.4%" trend={{ value: 0.3, direction: "down" }} />
                    <MetricCard label="Active users" value="12,304" trend={{ value: 0, direction: "flat" }} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan</CardTitle>
                            <CardDescription>Your current subscription.</CardDescription>
                            <CardAction><Badge variant="soft" intent="success">Active</Badge></CardAction>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">Pro tier · billed monthly.</CardContent>
                        <CardFooter><Button size="sm" variant="outline" intent="neutral">Manage</Button></CardFooter>
                    </Card>
                    <SectionCard title="Notifications" description="Choose where you receive updates.">
                        <div className="flex items-center justify-between text-xs">
                            <span>Email</span><Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span>SMS</span><Switch />
                        </div>
                    </SectionCard>
                    <PricingCard
                        name="Pro"
                        price="$29"
                        period="month"
                        description="For growing teams"
                        features={["Unlimited projects", "Priority support", "Advanced analytics"]}
                        cta={<Button fullWidth>Get started</Button>}
                        featured
                    />
                </Group>

                {/* ── EMPTY STATES ────────────────────────────────── */}
                <Group title="Empty states · Empty · EmptyState" cols={2}>
                    <Cell label="EmptyState">
                        <EmptyState
                            icon={<WarningIcon />}
                            title="No projects"
                            description="Create your first project to begin."
                            action={<Button size="sm">Create project</Button>}
                        />
                    </Cell>
                    <Cell label="Empty (composable)">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon"><InfoIcon /></EmptyMedia>
                                <EmptyTitle>Inbox is clear</EmptyTitle>
                                <EmptyDescription>Nothing to see here right now.</EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button size="sm" variant="outline" intent="neutral">Refresh</Button>
                            </EmptyContent>
                        </Empty>
                    </Cell>
                </Group>

                {/* ── DATA TOOLBAR ────────────────────────────────── */}
                <Group title="DataToolbar" cols={1}>
                    <Cell label="search + filters + actions">
                        <DataToolbar className="w-full">
                            <DataToolbarSearch>
                                <SearchField placeholder="Search rows…" />
                            </DataToolbarSearch>
                            <DataToolbarFilters>
                                <Select defaultValue="all">
                                    <SelectTrigger size="sm" className="w-32"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </DataToolbarFilters>
                            <DataToolbarActions>
                                <Button size="sm" variant="outline" intent="neutral">Export</Button>
                                <Button size="sm">New</Button>
                            </DataToolbarActions>
                        </DataToolbar>
                    </Cell>
                </Group>

                {/* ── BRAND / AUTH ───────────────────────────────── */}
                <Group title="Social Auth · brand-locked icons" cols={3}>
                    <GoogleAuthButton />
                    <GitHubAuthButton />
                    <AppleAuthButton />
                    <MicrosoftAuthButton />
                    <XAuthButton />
                    <DiscordAuthButton />
                    <FacebookAuthButton />
                    <LinkedInAuthButton />
                    <SlackAuthButton />
                    <GoogleAuthButton iconWeight="colorful" label="Continue with Google (colored)" />
                    <GitHubAuthButton iconWeight="duotone" />
                    <AppleAuthButton iconWeight="fill" />
                </Group>

                {/* ── CLAY SURFACE ─────────────────────────────────
                    Pillow finish for cards + CTAs. Palette-agnostic — colors
                    come from --card (surface) and --accent (shadow tinting),
                    so swap the palette in the header toggle to see clay
                    rotate across all 24 brand presets. */}
                <Group title="Clay surface · pillow finish across palette + light/dark" cols={3}>
                    <Cell label="Card · surface=clay">
                        <Card surface="clay" className="w-full p-5">
                            <div className="mb-3 text-sm font-semibold">Pro AI chat</div>
                            <p className="text-xs text-muted-foreground">
                                You stop rebuilding the same UI decisions over and over.
                                Clay gives you a soft 3D pillow finish without the
                                glass-blur cost.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <Button surface="clay" size="sm">Pause</Button>
                                <Button surface="clay" variant="ghost" size="sm">Save</Button>
                            </div>
                        </Card>
                    </Cell>
                    <Cell label="Card + Badge + Input · surface=clay">
                        <Card surface="clay" className="w-full p-5">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-sm font-semibold">Shopping experience</span>
                                <Badge surface="clay" intent="primary" variant="soft">New</Badge>
                            </div>
                            <Input surface="clay" placeholder="Search products..." className="mb-3" />
                            <div className="text-xs text-muted-foreground">$1350 · Knitted sneakers</div>
                            <Button surface="clay" size="sm" className="mt-3">Add to bag</Button>
                        </Card>
                    </Cell>
                    <Cell label="Intent variants · surface=clay">
                        <Card surface="clay" className="w-full p-5">
                            <div className="mb-3 text-sm font-semibold">Pillow shadow stack</div>
                            <div className="flex flex-wrap gap-2">
                                <Button surface="clay" size="sm" intent="primary">Primary</Button>
                                <Button surface="clay" size="sm" intent="success">Success</Button>
                                <Button surface="clay" size="sm" intent="warning">Warning</Button>
                                <Button surface="clay" size="sm" intent="danger">Danger</Button>
                                <Button surface="clay" size="sm" intent="neutral">Neutral</Button>
                            </div>
                            <p className="mt-3 text-[10px] text-muted-foreground">
                                Toggle palette + theme in header → shadow tint follows --accent.
                            </p>
                        </Card>
                    </Cell>
                </Group>

                {/* ── THEME TOGGLES ──────────────────────────────── */}
                <Group title="Theme toggles" cols={2}>
                    <Cell label="ThemeModeToggle">
                        <ThemeModeToggle initialResolvedTheme={resolveDark(initialPrefs.themeMode) ? "dark" : "light"} />
                        <ThemeModeToggle showText initialResolvedTheme={resolveDark(initialPrefs.themeMode) ? "dark" : "light"} />
                    </Cell>
                    <Cell label="ThemeModeMultiToggle · appearance × radius">
                        {(["icon", "icon-inherit", "button"] as const).map((a) => (
                            <div key={a} className="flex flex-col items-start gap-1">
                                <span className="text-[9px] font-mono uppercase text-muted-foreground">{a}</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {RADII.map((r) => (
                                        <ThemeModeMultiToggle
                                            key={r}
                                            appearance={a}
                                            radius={r}
                                            size="sm"
                                            initialMode={initialPrefs.themeMode}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Cell>
                </Group>

                <footer className="mt-4 border-t pt-4 text-[10px] text-muted-foreground">
                    @saasflare/ui · catalog renders on dark / saasflare palette by default.
                </footer>
            </main>
        </TooltipProvider>
    )
}
