"use client"

/**
 * @fileoverview "AI-native" section — the core differentiator vs. shadcn/HeroUI.
 *
 * Four spotlight cards covering the AI surface that already ships in this repo:
 * the MCP server (`/api/mcp`), the `llms.txt` catalog, copy-for-LLM on docs
 * pages, and IntelliSense-grade types. Each maps to a real, shipped capability.
 */
import { Icons, SpotlightCard } from "@saasflare/ui"
import type { ReactNode } from "react"

interface AiFeature {
    readonly icon: ReactNode
    readonly title: string
    readonly description: string
}

const FEATURES: readonly AiFeature[] = [
    {
        icon: <Icons.puzzle className="size-5" />,
        title: "MCP server built in",
        description:
            "Point Cursor, Claude, or any MCP client at /api/mcp and it pulls live component APIs, props, and examples straight into the conversation.",
    },
    {
        icon: <Icons.code className="size-5" />,
        title: "llms.txt, ready to fetch",
        description:
            "A complete machine-readable catalog at /llms.txt and /llms-full.txt — drop the whole design system into any model's context in one request.",
    },
    {
        icon: <Icons.copy className="size-5" />,
        title: "Paste-ready specs",
        description:
            "Ask your assistant for any component and the get_component tool returns its exact props, variants, and examples — plus a machine-readable registry at /registry.json. No scraping, no guesswork.",
    },
    {
        icon: <Icons.sparkles className="size-5" />,
        title: "IntelliSense-grade types",
        description:
            "Strict TypeScript with JSDoc on every export. Completions, hover docs, and example imports are correct the first time — for you and your copilot.",
    },
]

/** Grid of spotlight cards describing the AI-native capabilities. */
export function AiNative() {
    return (
        <section className="mx-auto max-w-6xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Built for the way you build now
                </h2>
                <p className="mt-4 text-balance text-muted-foreground">
                    Most libraries make your AI guess. Saasflare UI hands it the source of truth —
                    so generated UI is correct, typed, and on-brand from the first prompt.
                </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURES.map((f) => (
                    <SpotlightCard key={f.title} className="h-full">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--intent)]/15 text-[var(--intent-text)]">
                            {f.icon}
                        </div>
                        <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {f.description}
                        </p>
                    </SpotlightCard>
                ))}
            </div>
        </section>
    )
}
