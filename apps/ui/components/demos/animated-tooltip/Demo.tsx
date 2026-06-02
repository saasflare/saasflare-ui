"use client"

import { AnimatedTooltip } from "@saasflare/ui"

const people = [
    {
        id: 1,
        name: "Jordan Avery",
        designation: "Founding Engineer",
        image: "https://i.pravatar.cc/100?img=12",
    },
    {
        id: 2,
        name: "Priya Nair",
        designation: "Head of Design",
        image: "https://i.pravatar.cc/100?img=45",
    },
    {
        id: 3,
        name: "Marco Lindqvist",
        designation: "Developer Advocate",
        image: "https://i.pravatar.cc/100?img=68",
    },
]

/** Avatar row that reveals a tilting, mouse-tracking tooltip on hover. */
export function Demo() {
    return (
        <div className="flex flex-row items-center justify-center pt-16 pb-4">
            <AnimatedTooltip items={people} />
        </div>
    )
}
