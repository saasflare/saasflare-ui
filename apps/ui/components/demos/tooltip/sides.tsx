"use client"

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@saasflare/ui"

/** Tooltips positioned on each side of their trigger. */
export function Demo() {
    const sides = ["top", "right", "bottom", "left"] as const

    return (
        <TooltipProvider>
            <div className="flex flex-wrap items-center gap-3">
                {sides.map((side) => (
                    <Tooltip key={side}>
                        <TooltipTrigger asChild>
                            <Button variant="outline" className="capitalize">
                                {side}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side={side}>Anchored {side}</TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}
