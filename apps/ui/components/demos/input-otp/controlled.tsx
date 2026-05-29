"use client"

import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@saasflare/ui/input-otp"

/** A controlled four-digit code that confirms once complete. */
export function Demo() {
    const [value, setValue] = useState("")

    return (
        <div className="flex flex-col gap-2">
            <InputOTP maxLength={4} value={value} onChange={setValue}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-muted-foreground">
                {value.length === 4 ? "Code complete" : "Enter the 4-digit code"}
            </p>
        </div>
    )
}
