"use client"

import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@saasflare/ui"

/** A modal dialog with a trigger, body, and confirm/cancel footer. */
export function Demo() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete project</DialogTitle>
                    <DialogDescription>
                        This permanently removes the project and all of its data. This action cannot
                        be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button intent="danger">Delete</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
