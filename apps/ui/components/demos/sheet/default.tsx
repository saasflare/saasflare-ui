"use client"

import {
    Button,
    Input,
    Label,
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@saasflare/ui"

/** A right-side panel for editing settings, with a form body and footer. */
export function Demo() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Edit profile</Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Update your account details. Changes are saved instantly.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 px-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sheet-name">Display name</Label>
                        <Input id="sheet-name" defaultValue="Lina Hartmann" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sheet-email">Email</Label>
                        <Input id="sheet-email" type="email" defaultValue="lina@acme.io" />
                    </div>
                </div>
                <SheetFooter>
                    <Button>Save changes</Button>
                    <SheetClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
