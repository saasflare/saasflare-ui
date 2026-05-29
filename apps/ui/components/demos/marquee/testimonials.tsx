"use client"

import { Marquee } from "@saasflare/ui"

const quotes = [
    { quote: "Saasflare saved us three months of setup.", author: "Maya, CTO at Globex" },
    { quote: "We launched our MVP in a single weekend.", author: "Dev, Founder at Initech" },
    { quote: "The billing module just works.", author: "Priya, Eng Lead at Hooli" },
]

/** Slower, reversed marquee for testimonial cards. */
export function Demo() {
    return (
        <div className="flex h-64 w-full items-center rounded-lg border bg-fd-card">
            <Marquee reverse speed={60} className="w-full">
                {quotes.map((t) => (
                    <figure
                        key={t.author}
                        className="w-72 rounded-lg border bg-background p-4"
                    >
                        <blockquote className="text-sm">“{t.quote}”</blockquote>
                        <figcaption className="mt-2 text-xs text-muted-foreground">
                            {t.author}
                        </figcaption>
                    </figure>
                ))}
            </Marquee>
        </div>
    )
}
