"use client"

import { CategoryBar } from "@saasflare/ui"

/** Storage usage broken down by file type. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <CategoryBar
                segments={[
                    { value: 42, color: "oklch(0.65 0.18 230)", label: "Images" },
                    { value: 28, color: "oklch(0.72 0.17 50)", label: "Documents" },
                    { value: 18, color: "oklch(0.68 0.17 155)", label: "Backups" },
                    { value: 12, color: "oklch(0.70 0 0)", label: "Other" },
                ]}
            />
        </div>
    )
}
