"use client"

import { Field, FieldDescription, FieldLabel, Input } from "@saasflare/ui"

/** A field with a label, control, and helper description. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <Field>
                <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
                <Input id="workspace-name" placeholder="Acme Inc." />
                <FieldDescription>
                    This is the name your teammates will see.
                </FieldDescription>
            </Field>
        </div>
    )
}
