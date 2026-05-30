"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@saasflare/ui/carousel"

/** A carousel showing several metric tiles per view via item basis classes. */
export function Demo() {
    return (
        <Carousel opts={{ align: "start" }} className="w-full max-w-xs">
            <CarouselContent>
                {Array.from({ length: 8 }).map((_, i) => (
                    <CarouselItem key={i} className="basis-1/3">
                        <div className="flex aspect-square items-center justify-center rounded-md border bg-muted">
                            <span className="text-xl font-semibold">{(i + 1) * 12}k</span>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
