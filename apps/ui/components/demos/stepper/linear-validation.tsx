"use client"

import { useState } from "react"
import { Stepper, StepperPanel } from "@saasflare/ui"

/**
 * Linear wizard with an async gate on step 1: Next runs a simulated 600ms check,
 * shows the loading state, and blocks with an inline error on failure.
 */
export function Demo() {
    const [code, setCode] = useState("")

    // Resolves a validation result: pass when the code is "1234", else an error string.
    const validate = (step: number) =>
        new Promise<boolean | string>((resolve) => {
            if (step !== 1) {
                resolve(true)
                return
            }
            setTimeout(() => {
                resolve(code.trim() === "1234" ? true : "Invalid code — try 1234.")
            }, 600)
        })

    return (
        <Stepper
            linear
            validate={validate}
            items={[
                { title: "Email" },
                { title: "Verify" },
                { title: "Finish" },
            ]}
        >
            <StepperPanel value={0}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Enter your email</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        We'll send a one-time code to confirm it's you.
                    </p>
                </div>
            </StepperPanel>

            <StepperPanel value={1}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Verify the code</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Type <span className="font-mono text-foreground">1234</span> to pass the gate; anything
                        else is rejected after the check.
                    </p>
                    <input
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        inputMode="numeric"
                        placeholder="Verification code"
                        className="mt-4 w-40 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
            </StepperPanel>

            <StepperPanel value={2}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Verified</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        The gate passed — Finish to complete.
                    </p>
                </div>
            </StepperPanel>
        </Stepper>
    )
}
