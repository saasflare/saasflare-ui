"use client"

import { Label, RadioGroup, RadioGroupItem } from "@saasflare/ui"

/** A radio group with labelled options and a default selection. */
export function Demo() {
    return (
        <RadioGroup defaultValue="monthly">
            <div className="flex items-center gap-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly — $12/mo</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">Yearly — $120/yr</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="lifetime" id="lifetime" />
                <Label htmlFor="lifetime">Lifetime — $399</Label>
            </div>
        </RadioGroup>
    )
}
