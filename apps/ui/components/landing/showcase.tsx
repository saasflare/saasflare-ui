"use client"

/**
 * @fileoverview Showcase — proves breadth (117 components) and depth (real,
 * composed widgets). Two marquee rows of component names give an at-a-glance
 * sense of scale; the bento grid below frames the catalog's nine families.
 */
import Link from "next/link"
import { BentoGrid, BentoGridItem, Button, Icons, Marquee } from "@saasflare/ui"

const ROW_ONE = [
    "Button",
    "Combobox",
    "DatePicker",
    "Command",
    "Dialog",
    "Drawer",
    "Calendar",
    "DataTable",
    "Chart",
    "BarList",
    "Tracker",
    "Stepper",
    "Timeline",
    "Carousel",
    "Tabs",
] as const

const ROW_TWO = [
    "BentoGrid",
    "Marquee",
    "BorderBeam",
    "ShimmerButton",
    "SpotlightCard",
    "AuroraBackground",
    "GradientText",
    "TracingBeam",
    "Confetti",
    "Dock",
    "ParticlesBackground",
    "TextGenerate",
    "FlipWords",
    "Compare",
    "Lightbox",
] as const

function Pill({ name }: { readonly name: string }) {
    return (
        <span className="flex h-10 items-center rounded-full border bg-background px-4 text-sm font-medium text-muted-foreground">
            {name}
        </span>
    )
}

/** Marquee rows + bento grid summarizing the catalog. */
export function Showcase() {
    return (
        <section className="py-20">
            <div className="mx-auto max-w-2xl px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    117 components. Every one themeable.
                </h2>
                <p className="mt-4 text-balance text-muted-foreground">
                    From primitives to data viz to scroll-driven motion — composed, accessible, and
                    animated by default.
                </p>
            </div>

            <div className="relative mt-12 flex flex-col gap-4 overflow-hidden">
                <Marquee pauseOnHover>
                    {ROW_ONE.map((n) => (
                        <Pill key={n} name={n} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover>
                    {ROW_TWO.map((n) => (
                        <Pill key={n} name={n} />
                    ))}
                </Marquee>
                {/* Fade the marquee edges into the page background. */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
            </div>

            <div className="mx-auto mt-16 max-w-6xl px-6">
                <BentoGrid columns={3}>
                    <BentoGridItem colSpan={2} index={0}>
                        <Icons.palette className="size-5 text-[var(--intent-text)]" />
                        <h3 className="mt-3 text-base font-semibold">Forms, data display & viz</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            39 inputs and data widgets — comboboxes, date pickers, tables, charts,
                            trackers — all driven by the same intent tokens.
                        </p>
                    </BentoGridItem>
                    <BentoGridItem index={1}>
                        <Icons.sparkles className="size-5 text-[var(--intent-text)]" />
                        <h3 className="mt-3 text-base font-semibold">Effects & motion</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            15 scroll- and pointer-driven effects, animated by default.
                        </p>
                    </BentoGridItem>
                    <BentoGridItem index={2}>
                        <Icons.check className="size-5 text-[var(--intent-text)]" />
                        <h3 className="mt-3 text-base font-semibold">Feedback & navigation</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Dialogs, drawers, menus, toasts — accessible primitives you don&apos;t
                            re-implement.
                        </p>
                    </BentoGridItem>
                    <BentoGridItem colSpan={2} index={3}>
                        <Icons.code className="size-5 text-[var(--intent-text)]" />
                        <h3 className="mt-3 text-base font-semibold">Layout & composed widgets</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Bento grids, pricing cards, stat cards, team cards — production blocks,
                            not just primitives.
                        </p>
                    </BentoGridItem>
                </BentoGrid>

                <div className="mt-8 flex justify-center">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/catalog">
                            Explore the full catalog
                            <Icons.chevronRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
