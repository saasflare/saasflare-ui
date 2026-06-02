"use client"

import { Stepper, StepperPanel } from "@saasflare/ui"

/** Uncontrolled wizard: items drive the indicator, the built-in nav handles Back / Next / Finish. */
export function Demo() {
    return (
        <Stepper
            items={[
                { title: "Account", description: "Your login" },
                { title: "Profile", description: "About you" },
                { title: "Done", description: "All set" },
            ]}
        >
            <StepperPanel value={0}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Create your account</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Pick a workspace name and an email to sign in with.
                    </p>
                </div>
            </StepperPanel>

            <StepperPanel value={1}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">Tell us about you</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a display name and avatar so teammates recognise you.
                    </p>
                </div>
            </StepperPanel>

            <StepperPanel value={2}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground">You're all set</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Hit Finish to drop into your new workspace.
                    </p>
                </div>
            </StepperPanel>
        </Stepper>
    )
}
