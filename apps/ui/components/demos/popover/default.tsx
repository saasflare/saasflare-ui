"use client"

import {
    Button,
    Input,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@saasflare/ui"

/** A popover with a small form for adjusting dimensions. */
export function Demo() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open settings</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Dimensions</p>
                        <p className="text-sm text-muted-foreground">
                            Set the export size for this asset.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="popover-width">Width</Label>
                        <Input id="popover-width" defaultValue="1280" className="col-span-2 h-8" />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="popover-height">Height</Label>
                        <Input id="popover-height" defaultValue="720" className="col-span-2 h-8" />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
