"use client"

import { useEffect, useState } from "react"
import { Progress } from "@saasflare/ui"

/** A live upload progress bar that fills on mount. */
export function Demo() {
    const [value, setValue] = useState(8)

    useEffect(() => {
        const timer = setInterval(() => {
            setValue((v) => (v >= 100 ? 8 : v + 6))
        }, 600)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploading backup…</span>
                <span className="font-medium tabular-nums">{value}%</span>
            </div>
            <Progress value={value} />
        </div>
    )
}
