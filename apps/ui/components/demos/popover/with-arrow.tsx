"use client"

import {
    Button,
    Input,
    Label,
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
} from "@saasflare/ui"

/**
 * `PopoverArrow` points the panel at its trigger. Rendered inside
 * `PopoverContent`, Radix positions it from the resolved side/align.
 */
export function Demo() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open settings</Button>
            </PopoverTrigger>
            <PopoverContent align="start">
                <PopoverArrow />
                <div className="space-y-3">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Dimensions</p>
                        <p className="text-sm text-muted-foreground">
                            Set the export size for this asset.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="popover-arrow-width">Width</Label>
                        <Input
                            id="popover-arrow-width"
                            defaultValue="1280"
                            className="col-span-2 h-8"
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="popover-arrow-height">Height</Label>
                        <Input
                            id="popover-arrow-height"
                            defaultValue="720"
                            className="col-span-2 h-8"
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
