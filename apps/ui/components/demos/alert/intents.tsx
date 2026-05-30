"use client"

import {
    Alert,
    AlertDescription,
    AlertTitle,
    CheckCircleIcon,
    InfoIcon,
    WarningIcon,
    XCircleIcon,
} from "@saasflare/ui"

/** Every semantic intent — neutral, info, success, warning, and danger. */
export function Demo() {
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            <Alert intent="neutral">
                <InfoIcon />
                <AlertTitle>Draft saved</AlertTitle>
                <AlertDescription>Your changes are stored locally.</AlertDescription>
            </Alert>
            <Alert intent="info">
                <InfoIcon />
                <AlertTitle>New region available</AlertTitle>
                <AlertDescription>Deploy to eu-central-1 for lower EU latency.</AlertDescription>
            </Alert>
            <Alert intent="success">
                <CheckCircleIcon />
                <AlertTitle>Deployment succeeded</AlertTitle>
                <AlertDescription>Version 2.4.0 is now live in production.</AlertDescription>
            </Alert>
            <Alert intent="warning">
                <WarningIcon />
                <AlertTitle>Usage limit approaching</AlertTitle>
                <AlertDescription>You have used 90% of your monthly API quota.</AlertDescription>
            </Alert>
            <Alert intent="danger">
                <XCircleIcon />
                <AlertTitle>Payment failed</AlertTitle>
                <AlertDescription>Update your card to avoid service interruption.</AlertDescription>
            </Alert>
        </div>
    )
}
