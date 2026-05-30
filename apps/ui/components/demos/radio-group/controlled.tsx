"use client"

import { useState } from "react"
import { Label, RadioGroup, RadioGroupItem } from "@saasflare/ui"

/** A controlled radio group reflecting the selected value. */
export function Demo() {
    const [value, setValue] = useState("dark")

    return (
        <div className="flex flex-col gap-3">
            <RadioGroup value={value} onValueChange={setValue}>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">Light</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">Dark</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">System</Label>
                </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">Theme: {value}</p>
        </div>
    )
}
