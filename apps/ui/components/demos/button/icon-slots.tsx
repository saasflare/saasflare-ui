"use client"

import { Button, ArrowLeftIcon, ArrowRightIcon } from "@saasflare/ui"

/** Leading + trailing icons via `startContent` / `endContent`, across variants. */
export function Demo() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <Button variant="solid" endContent={<ArrowRightIcon aria-hidden />}>
                Continue
            </Button>
            <Button variant="outline" startContent={<ArrowLeftIcon aria-hidden />}>
                Go back
            </Button>
            <Button
                variant="ghost"
                startContent={<ArrowLeftIcon aria-hidden />}
                endContent={<ArrowRightIcon aria-hidden />}
            >
                Navigate
            </Button>
        </div>
    )
}
