"use client"

/**
 * @fileoverview Sticky landing navigation — wordmark, primary links, GitHub,
 * and the lead CTA. Client component because it renders the `Icons` namespace,
 * whose members are only addressable inside the client graph (the namespace
 * object resolves to a client reference across the RSC boundary).
 */
import Link from "next/link"
import { Button, Icons } from "@saasflare/ui"

const NAV_LINKS = [
    { label: "Components", href: "/catalog" },
    { label: "Docs", href: "/docs" },
    { label: "Theming", href: "/docs/theming" },
] as const

/** Top navigation bar with blurred sticky backdrop. */
export function LandingNav() {
    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Icons.logo className="size-6 text-[var(--intent-text)]" />
                    Saasflare UI
                </Link>

                <div className="hidden items-center gap-6 md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <a
                            href="https://github.com/saasflare/saasflare-ui"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                        >
                            <Icons.github className="size-4" />
                        </a>
                    </Button>
                    <Button intent="primary" size="sm" asChild>
                        <Link href="/docs/getting-started">Get started</Link>
                    </Button>
                </div>
            </nav>
        </header>
    )
}
