"use client"

/**
 * @fileoverview Proof section — breadth (marquee), differentiators, and every
 * way to connect (npm / MCP / shadcn CLI) in one compact, asymmetric block.
 * Folds the former AiNative + Showcase + Install sections into a single screen.
 */
import Link from "next/link"
import {
    Button,
    CodeBlock,
    Icons,
    Marquee,
    SpotlightCard,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@saasflare/ui"
import type { ReactNode } from "react"

const ROW_ONE = [
    "Button", "Combobox", "DatePicker", "Command", "Dialog", "Drawer", "Calendar",
    "DataTable", "Chart", "BarList", "Tracker", "Stepper", "Timeline", "Carousel", "Tabs",
] as const

const ROW_TWO = [
    "BentoGrid", "Marquee", "BorderBeam", "ShimmerButton", "SpotlightCard",
    "AuroraBackground", "GradientText", "TracingBeam", "Confetti", "Dock",
    "ParticlesBackground", "TextGenerate", "FlipWords", "Compare", "Lightbox",
] as const

const NPM_SNIPPET = `pnpm add @saasflare/ui

import "@saasflare/ui/styles"          // tokens + palettes
import { SaasflareShell, Button } from "@saasflare/ui"

<SaasflareShell>
  <Button intent="primary">Ship it</Button>
</SaasflareShell>`

const MCP_SNIPPET = `{
  "mcpServers": {
    "saasflare-ui": {
      "url": "https://ui.saasflare.io/api/mcp"
    }
  }
}`

const SHADCN_SNIPPET = `# every component is a shadcn registry item
npx shadcn@latest add \\
  "https://ui.saasflare.io/r/button.json"`

interface Feature {
    readonly icon: ReactNode
    readonly title: string
    readonly description: string
}

const FEATURES: readonly Feature[] = [
    {
        icon: <Icons.puzzle className="size-5" />,
        title: "Your AI gets the source of truth",
        description:
            "MCP server at /api/mcp, llms.txt, and a full registry — Cursor or Claude pulls live props and examples instead of guessing.",
    },
    {
        icon: <Icons.sparkles className="size-5" />,
        title: "Animated & accessible by default",
        description:
            "Motion springs behind one animated switch, reduced-motion respected by every effect, focus rings and ARIA throughout.",
    },
    {
        icon: <Icons.check className="size-5" />,
        title: "Typed, tested, tree-shakeable",
        description:
            "Strict TypeScript with zero any, a regression suite in CI, and per-module dist — server components import only what they use.",
    },
]

interface ProofProps {
    readonly componentCount: number
}

/** Marquee + differentiators + connect tabs in one compact block. */
export function Proof({ componentCount }: ProofProps) {
    return (
        <section className="py-14">
            <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-6">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {componentCount} components. Every one themeable.
                </h2>
                <Button variant="outline" asChild>
                    <Link href="/catalog">
                        Explore the catalog
                        <Icons.chevronRight className="size-4" />
                    </Link>
                </Button>
            </div>

            <div className="relative mt-8 flex flex-col gap-3 overflow-hidden">
                <Marquee pauseOnHover>
                    {ROW_ONE.map((n) => (
                        <span
                            key={n}
                            className="flex h-9 items-center rounded-full border bg-background px-4 text-sm font-medium text-muted-foreground"
                        >
                            {n}
                        </span>
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover>
                    {ROW_TWO.map((n) => (
                        <span
                            key={n}
                            className="flex h-9 items-center rounded-full border bg-background px-4 text-sm font-medium text-muted-foreground"
                        >
                            {n}
                        </span>
                    ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-4 px-6 lg:grid-cols-[1fr_440px]">
                <div className="flex flex-col gap-4">
                    {FEATURES.map((f) => (
                        <SpotlightCard key={f.title} className="flex items-start gap-4 p-5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--intent)]/15 text-[var(--intent-text)]">
                                {f.icon}
                            </div>
                            <div>
                                <h3 className="text-base font-semibold">{f.title}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                    {f.description}
                                </p>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>

                <div className="rounded-xl border bg-card p-5">
                    <h3 className="text-sm font-semibold">Connect any way you build</h3>
                    <Tabs defaultValue="npm" className="mt-3">
                        <TabsList>
                            <TabsTrigger value="npm">npm</TabsTrigger>
                            <TabsTrigger value="mcp">MCP</TabsTrigger>
                            <TabsTrigger value="shadcn">shadcn CLI</TabsTrigger>
                        </TabsList>
                        <TabsContent value="npm" className="mt-3">
                            <CodeBlock code={NPM_SNIPPET} language="tsx" />
                        </TabsContent>
                        <TabsContent value="mcp" className="mt-3">
                            <CodeBlock code={MCP_SNIPPET} language="json" filename="mcp.json" />
                        </TabsContent>
                        <TabsContent value="shadcn" className="mt-3">
                            <CodeBlock code={SHADCN_SNIPPET} language="bash" />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    )
}
