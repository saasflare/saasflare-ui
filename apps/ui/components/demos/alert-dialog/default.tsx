"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Button,
} from "@saasflare/ui"

/** A destructive confirmation dialog with cancel and confirm actions. */
export function Demo() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" intent="danger">
                    Delete workspace
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this workspace?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently removes the workspace, its members, and all projects. This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete workspace</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
