"use client"

import { Field, FieldError, FieldLabel, Input } from "@saasflare/ui"

/** A field in its invalid state, showing an error message. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <Field data-invalid="true">
                <FieldLabel htmlFor="billing-email">Billing email</FieldLabel>
                <Input id="billing-email" defaultValue="acme.com" aria-invalid />
                <FieldError>Enter a valid email address.</FieldError>
            </Field>
        </div>
    )
}
