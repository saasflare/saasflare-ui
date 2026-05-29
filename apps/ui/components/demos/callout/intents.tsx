"use client"

import { Callout, CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon } from "@saasflare/ui"

/** Callout across its color intents — info, success, warning, and danger. */
export function Demo() {
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            <Callout intent="info" title="Tip" icon={<InfoIcon />}>
                Connect a custom domain to serve your app from your own URL.
            </Callout>
            <Callout intent="success" title="Verified" icon={<CheckCircleIcon />}>
                Your domain DNS records are configured correctly.
            </Callout>
            <Callout intent="warning" title="Action required" icon={<WarningIcon />}>
                Your SSL certificate expires in 7 days. Renew it to keep traffic secure.
            </Callout>
            <Callout intent="danger" title="Build failed" icon={<XCircleIcon />}>
                The deployment was rolled back after the health check timed out.
            </Callout>
        </div>
    )
}
