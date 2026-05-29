"use client"

import {
    Button,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@saasflare/ui"

/** The sheet can slide in from any edge via the `side` prop. */
export function Demo() {
    const sides = ["top", "right", "bottom", "left"] as const

    return (
        <div className="flex flex-wrap items-center gap-3">
            {sides.map((side) => (
                <Sheet key={side}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="capitalize">
                            {side}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={side}>
                        <SheetHeader>
                            <SheetTitle className="capitalize">{side} sheet</SheetTitle>
                            <SheetDescription>
                                This panel slides in from the {side} edge of the viewport.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    )
}
