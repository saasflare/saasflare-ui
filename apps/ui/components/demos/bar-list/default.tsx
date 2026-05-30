"use client"

import { BarList } from "@saasflare/ui"

/** Top referring sources by sessions — the classic "top N" ranking. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <BarList
                data={[
                    { name: "Google", value: 18420 },
                    { name: "Direct", value: 11230 },
                    { name: "GitHub", value: 7640 },
                    { name: "Twitter / X", value: 4310 },
                    { name: "Product Hunt", value: 2870 },
                ]}
            />
        </div>
    )
}
