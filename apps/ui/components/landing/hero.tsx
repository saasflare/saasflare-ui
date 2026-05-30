"use client"

/**
 * @fileoverview Landing hero — the AI-native value proposition.
 *
 * Built entirely from `@saasflare/ui` primitives (GradientText, ShimmerButton,
 * Button, Badge, CodeBlock) so the hero itself is a live proof of the design
 * system. Client component because the primary CTA navigates via `useRouter`
 * (ShimmerButton renders a bare `<button>` and has no `asChild`).
 */
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge, Button, CodeBlock, GradientText, Icons, ShimmerButton } from "@saasflare/ui"

const SHADCN_SNIPPET = `npx shadcn@latest add "https://ui.saasflare.io/r/button.json"`

const MCP_SNIPPET = `{
  "mcpServers": {
    "saasflare-ui": {
      "url": "https://ui.saasflare.io/api/mcp"
    }
  }
}`

/**
 * Hero section: eyebrow badge, headline with animated gradient on the key
 * phrase, sub-headline, dual CTA, and an "AI-native" connect block showing the
 * shadcn registry install line and the MCP server config side by side.
 */
export function Hero() {
    const router = useRouter()

    return (
        <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28">
            <Badge variant="soft" intent="primary" className="mb-6 gap-1.5">
                <Icons.sparkles className="size-3" />
                v3.3.0 · 117 components · open source
            </Badge>

            <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                Components your <GradientText>AI already understands</GradientText>.
            </h1>

            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
                A production-grade React + Tailwind v4 design system with an MCP server,{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">llms.txt</code>, and
                copy-for-LLM built into every page. Generate, theme, and ship UI at the speed
                your agents work.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <ShimmerButton onClick={() => router.push("/docs/getting-started")}>
                    Get started
                </ShimmerButton>
                <Button variant="outline" size="lg" asChild>
                    <Link href="/catalog">
                        Browse 117 components
                        <Icons.chevronRight className="size-4" />
                    </Link>
                </Button>
            </div>

            <div className="mt-14 grid w-full gap-4 text-left sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Icons.download className="size-3.5" />
                        Install any component
                    </span>
                    <CodeBlock code={SHADCN_SNIPPET} language="bash" filename="terminal" />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Icons.sparkles className="size-3.5" />
                        Connect your AI editor
                    </span>
                    <CodeBlock code={MCP_SNIPPET} language="json" filename="mcp.json" />
                </div>
            </div>
        </section>
    )
}
