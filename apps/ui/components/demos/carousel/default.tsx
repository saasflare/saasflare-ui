"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@saasflare/ui/carousel"

const plans = ["Starter", "Team", "Business", "Enterprise"]

/** A horizontal carousel stepping through pricing tiers one slide at a time. */
export function Demo() {
    return (
        <Carousel className="w-full max-w-xs">
            <CarouselContent>
                {plans.map((plan) => (
                    <CarouselItem key={plan}>
                        <div className="flex aspect-square items-center justify-center rounded-md border bg-muted">
                            <span className="text-2xl font-semibold tracking-tight">{plan}</span>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
