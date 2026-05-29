"use client"

import { TestimonialCard } from "@saasflare/ui"

const TESTIMONIALS = [
    {
        quote: "We replaced three internal libraries with Saasflare and never looked back.",
        name: "Marcus Lee",
        role: "Staff Engineer, Vercel-scale startup",
        avatar: "https://i.pravatar.cc/96?img=14",
        rating: 5 as const,
    },
    {
        quote: "The theming system alone paid for itself. One palette swap, every app updated.",
        name: "Dana Whitfield",
        role: "Design Lead, Orbital",
        avatar: "https://i.pravatar.cc/96?img=49",
        rating: 5 as const,
    },
]

/** A pair of testimonials side by side for a social-proof section. */
export function Demo() {
    return (
        <div className="grid w-full gap-4 md:grid-cols-2">
            {TESTIMONIALS.map((testimonial) => (
                <TestimonialCard
                    key={testimonial.name}
                    quote={testimonial.quote}
                    name={testimonial.name}
                    role={testimonial.role}
                    avatar={testimonial.avatar}
                    rating={testimonial.rating}
                />
            ))}
        </div>
    )
}
