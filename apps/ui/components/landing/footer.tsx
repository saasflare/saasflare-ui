"use client"

/**
 * @fileoverview Landing footer — primary nav links, resources, and brand line.
 * Client component: it renders the `Icons` namespace (see landing-nav for the
 * RSC-boundary rationale).
 */
import Link from "next/link"
import { Icons } from "@saasflare/ui"

interface FooterLink {
    readonly label: string
    readonly href: string
    readonly external?: boolean
}

const COLUMNS: ReadonlyArray<{ readonly title: string; readonly links: readonly FooterLink[] }> = [
    {
        title: "Product",
        links: [
            { label: "Components", href: "/catalog" },
            { label: "Getting started", href: "/docs/getting-started" },
            { label: "Theming", href: "/docs/theming" },
        ],
    },
    {
        title: "Developers",
        links: [
            { label: "Docs", href: "/docs" },
            { label: "MCP server", href: "/api/mcp" },
            { label: "llms.txt", href: "/llms.txt" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "npm", href: "https://www.npmjs.com/package/@saasflare/ui", external: true },
            { label: "GitHub", href: "https://github.com/saasflare/saasflare-ui", external: true },
        ],
    },
]

/** Multi-column footer with brand wordmark. */
export function Footer() {
    return (
        <footer className="border-t">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <span className="flex items-center gap-2 font-semibold">
                        <Icons.logo className="size-5 text-[var(--intent-text)]" />
                        Saasflare UI
                    </span>
                    <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                        The AI-native React design system. Open source, themeable, and built to be
                        understood by humans and models alike.
                    </p>
                </div>
                {COLUMNS.map((col) => (
                    <div key={col.title}>
                        <span className="text-sm font-semibold">{col.title}</span>
                        <ul className="mt-3 flex flex-col gap-2">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
                    <span>© {2026} Saasflare™. Released under the MIT License.</span>
                    <span>Built with @saasflare/ui — dogfooded, end to end.</span>
                </div>
            </div>
        </footer>
    )
}
