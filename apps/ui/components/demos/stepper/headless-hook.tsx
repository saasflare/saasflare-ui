"use client"

import {
    useStepper,
    Steps,
    Step,
    Button,
    CaretLeftIcon,
    CaretRightIcon,
    CheckIcon,
} from "@saasflare/ui"

const STEPS = [
    { title: "Connect", description: "Link a repo" },
    { title: "Configure", description: "Set env vars" },
    { title: "Deploy", description: "Ship it" },
] as const

/**
 * Headless usage: `useStepper` drives the bare visual `Steps` indicator plus a
 * fully custom `Button` nav — no `<Stepper>` wrapper. The same hook composes
 * with any layout you build.
 */
export function Demo() {
    const stepper = useStepper({ count: STEPS.length })

    return (
        <div className="flex flex-col gap-6">
            <Steps current={stepper.activeStep}>
                {STEPS.map((step) => (
                    <Step key={step.title} title={step.title} description={step.description} />
                ))}
            </Steps>

            <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground">
                    {STEPS[stepper.activeStep].title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Step {stepper.activeStep + 1} of {stepper.count} — driven entirely by the headless hook.
                </p>
            </div>

            <div className="flex items-center justify-between gap-3">
                <Button
                    variant="ghost"
                    intent="neutral"
                    startContent={<CaretLeftIcon aria-hidden="true" />}
                    disabled={!stepper.canBack}
                    onClick={() => stepper.back()}
                >
                    Back
                </Button>

                <Button
                    intent="primary"
                    endContent={
                        stepper.isLast ? (
                            <CheckIcon aria-hidden="true" />
                        ) : (
                            <CaretRightIcon aria-hidden="true" />
                        )
                    }
                    onClick={() => {
                        void stepper.next()
                    }}
                >
                    {stepper.isLast ? "Deploy" : "Next"}
                </Button>
            </div>
        </div>
    )
}
