"use client"

import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@saasflare/ui"

/** A tooltip hint revealed on hover or focus of its trigger. */
export function Demo() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>Copies the API key to your clipboard</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
