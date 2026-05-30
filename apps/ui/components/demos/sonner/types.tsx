"use client"

import { Button, Toaster } from "@saasflare/ui"
import { toast } from "sonner"

/** Each toast type — success, info, warning, error, and a promise toast. */
export function Demo() {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="soft" onClick={() => toast.success("Deployment live")}>
                    Success
                </Button>
                <Button variant="soft" onClick={() => toast.info("New region available")}>
                    Info
                </Button>
                <Button
                    variant="soft"
                    onClick={() => toast.warning("Usage limit approaching")}
                >
                    Warning
                </Button>
                <Button variant="soft" onClick={() => toast.error("Payment failed")}>
                    Error
                </Button>
                <Button
                    variant="soft"
                    onClick={() =>
                        toast.promise(
                            new Promise((resolve) => setTimeout(resolve, 1500)),
                            {
                                loading: "Deploying…",
                                success: "Deployed to production",
                                error: "Deployment failed",
                            },
                        )
                    }
                >
                    Promise
                </Button>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}
