"use client"

import { Button, Input, Label, SectionCard } from "@saasflare/ui"

/** A titled settings panel with a footer action. */
export function Demo() {
    return (
        <SectionCard
            className="w-full max-w-md"
            title="General"
            description="Basic information about your project."
            footer={<Button size="sm">Save changes</Button>}
        >
            <div className="space-y-2">
                <Label htmlFor="project-name">Project name</Label>
                <Input id="project-name" defaultValue="Saasflare Web" />
            </div>
        </SectionCard>
    )
}
