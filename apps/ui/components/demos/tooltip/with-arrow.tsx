"use client"

import {
    Button,
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@saasflare/ui"

/**
 * `TooltipArrow` rides inside `TooltipContent` and inherits the primary fill,
 * connecting the single-line label to its trigger.
 */
export function Demo() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                    Copy link
                    <TooltipArrow />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
