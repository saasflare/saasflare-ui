"use client"

import { TestimonialCard } from "@saasflare/ui"

/** A customer testimonial with avatar, attribution, and a star rating. */
export function Demo() {
    return (
        <TestimonialCard
            className="w-full max-w-sm"
            quote="Saasflare cut our dashboard build time from weeks to a single afternoon. The components just work."
            name="Priya Nair"
            role="Head of Product, Northbeam"
            avatar="https://i.pravatar.cc/96?img=45"
            rating={5}
        />
    )
}
