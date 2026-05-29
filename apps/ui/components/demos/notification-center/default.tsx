"use client"

import { useState } from "react"
import { NotificationCenter, type NotificationItem } from "@saasflare/ui"

const INITIAL: NotificationItem[] = [
    {
        id: "1",
        title: "New comment on “Q3 roadmap”",
        description: "Lina replied: “Can we ship the billing rework first?”",
        timestamp: "5m ago",
        read: false,
    },
    {
        id: "2",
        title: "Deployment succeeded",
        description: "Version 2.4.0 is live in production.",
        timestamp: "1h ago",
        read: false,
    },
    {
        id: "3",
        title: "Invoice paid",
        description: "Acme Inc. paid invoice #1043.",
        timestamp: "Yesterday",
        read: true,
    },
]

/** A bell trigger with an unread badge and a dropdown inbox of notifications. */
export function Demo() {
    const [items, setItems] = useState(INITIAL)

    return (
        <NotificationCenter
            items={items}
            onMarkRead={(id) =>
                setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)))
            }
            onMarkAllRead={() => setItems((prev) => prev.map((i) => ({ ...i, read: true })))}
        />
    )
}
