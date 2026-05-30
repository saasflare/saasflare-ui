"use client"

/**
 * @fileoverview Closing CTA over an aurora backdrop. Primary action sends
 * visitors to the docs; the sub-line is the funnel to the paid Saasflare SaaS
 * starter (the same components, in a full product).
 */
import Link from "next/link"
import { AuroraBackground, Button, Icons } from "@saasflare/ui"

/** Final call-to-action section. */
export function Cta() {
    return (
        <section className="mx-auto max-w-6xl px-6 py-20">
            <AuroraBackground className="flex flex-col items-center rounded-3xl border px-6 py-20 text-center">
                <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-5xl">
                    Ship your next interface this afternoon
                </h2>
                <p className="mt-5 max-w-xl text-balance text-muted-foreground">
                    Free and open source. The same components power the Saasflare SaaS starter —
                    start here, scale into the full product when you&apos;re ready.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button intent="primary" size="lg" asChild>
                        <Link href="/docs/getting-started">
                            Read the docs
                            <Icons.chevronRight className="size-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <a
                            href="https://github.com/saasflare/saasflare-ui"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Icons.github className="size-4" />
                            Star on GitHub
                        </a>
                    </Button>
                </div>
            </AuroraBackground>
        </section>
    )
}
