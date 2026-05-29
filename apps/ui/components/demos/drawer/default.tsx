"use client"

import { Button } from "@saasflare/ui"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@saasflare/ui/drawer"

/** A bottom drawer with drag-to-dismiss, a header, and a footer action. */
export function Demo() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Invite teammates</DrawerTitle>
                        <DrawerDescription>
                            Send an invite link to add members to the Acme workspace.
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button>Send invites</Button>
                        <DrawerClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
