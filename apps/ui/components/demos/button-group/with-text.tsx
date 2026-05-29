"use client"

import {
    Button,
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
} from "@saasflare/ui"

/** Static text label and a separator joined to interactive buttons. */
export function Demo() {
    return (
        <ButtonGroup>
            <ButtonGroupText>app.saasflare.io/</ButtonGroupText>
            <Button variant="outline">acme</Button>
            <ButtonGroupSeparator />
            <Button variant="outline">Copy</Button>
        </ButtonGroup>
    )
}
