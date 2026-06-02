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

/**
 * Headless close: `showCloseButton={false}` hides the built-in X and lets the
 * footer own dismissal. Esc and overlay-click still close the dialog.
 */
export function Demo() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit profile</Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Save changes</DialogTitle>
                    <DialogDescription>
                        Your edits to the profile are not saved yet. Press Esc or click outside to
                        discard, or use the buttons below.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="solid">Save</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
