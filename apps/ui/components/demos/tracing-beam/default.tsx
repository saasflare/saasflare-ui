"use client"

import { TracingBeam } from "@saasflare/ui"

/** A scroll-progress beam alongside long-form content. */
export function Demo() {
    return (
        <div className="w-full rounded-lg border bg-fd-card p-8">
            <TracingBeam>
                <article className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold">Getting started</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Install the package and wrap your app in the SaasflareShell provider.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Theming</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Swap palettes with a single data attribute on the html element.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Going to production</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Build, deploy to the edge, and watch the beam fill as you read.
                        </p>
                    </div>
                </article>
            </TracingBeam>
        </div>
    )
}
