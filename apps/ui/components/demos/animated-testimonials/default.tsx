"use client"

import { AnimatedTestimonials } from "@saasflare/ui"

const testimonials = [
    {
        quote: "We replaced three internal tools with this in a single sprint. The rollout took an afternoon.",
        name: "Priya Nair",
        role: "Head of Platform",
        company: "Northwind",
        avatar: "https://i.pravatar.cc/120?img=45",
    },
    {
        quote: "Billing used to be our most-reported bug source. It has been quiet for four months.",
        name: "Jordan Avery",
        role: "Founding Engineer",
        company: "Lumen",
        avatar: "https://i.pravatar.cc/120?img=12",
    },
    {
        quote: "The part I did not expect: our designers ship changes now without opening a ticket.",
        name: "Marco Lindqvist",
        role: "Design Lead",
        company: "Fieldnote",
        avatar: "https://i.pravatar.cc/120?img=68",
    },
]

/** Auto-rotating quotes with crossfade and manual navigation. */
export function Demo() {
    return (
        <div className="w-full max-w-2xl">
            <AnimatedTestimonials testimonials={testimonials} />
        </div>
    )
}
