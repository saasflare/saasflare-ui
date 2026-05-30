"use client"

import {
    Checkbox,
    Field,
    FieldDescription,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
} from "@saasflare/ui"

/** A fieldset grouping related checkboxes under a legend. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <FieldSet>
                <FieldLegend>Email notifications</FieldLegend>
                <FieldDescription>
                    Choose which updates land in your inbox.
                </FieldDescription>
                <Field orientation="horizontal">
                    <Checkbox id="notif-deploys" defaultChecked />
                    <FieldLabel htmlFor="notif-deploys">
                        <FieldTitle>Deployment results</FieldTitle>
                    </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                    <Checkbox id="notif-invoices" />
                    <FieldLabel htmlFor="notif-invoices">
                        <FieldTitle>Invoices and receipts</FieldTitle>
                    </FieldLabel>
                </Field>
            </FieldSet>
        </div>
    )
}
