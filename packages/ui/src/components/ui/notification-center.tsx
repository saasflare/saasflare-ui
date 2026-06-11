// @draft
"use client"

/**
 * @fileoverview Saasflare NotificationCenter — bell-icon trigger + dropdown
 * with a list of notifications and per-item read/dismiss controls.
 * @author Saasflare™
 *
 * Composes the existing Button + Popover + Badge primitives. Designed for
 * the "in-app inbox" pattern (unread badge on a header bell). Controlled
 * via the `items` array — saasflare-ui does NOT own the data store; the
 * consumer is expected to wire reads/dismisses through whichever state
 * layer they use (React state, react-query, RTK, etc.).
 *
 * @module packages/ui/components/ui/notification-center
 * @package ui
 * @layer core
 *
 * @example
 * <NotificationCenter
 *   items={[
 *     { id: "1", title: "New comment", description: "Lina replied to your post", timestamp: "5m ago", read: false },
 *     { id: "2", title: "Build passed", timestamp: "1h ago", read: true },
 *   ]}
 *   onMarkRead={(id) => api.read(id)}
 *   onMarkAllRead={() => api.readAll()}
 * />
 */

import { type ReactNode } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { Badge } from "./badge"
import { Button } from "./button"
import { CheckIcon } from "./phosphor"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

/** A single notification item. */
export interface NotificationItem {
    /** Stable unique id. */
    id: string
    /** Bold title line. */
    title: ReactNode
    /** Secondary body line. */
    description?: ReactNode
    /** Display timestamp (already formatted — e.g. "5m ago"). */
    timestamp?: string
    /** Whether the notification has been read. */
    read?: boolean
    /** Optional leading icon. */
    icon?: ReactNode
    /** Optional href — wraps the row in `<a>`. */
    href?: string
}

/** Props for the NotificationCenter component. */
export interface NotificationCenterProps extends SaasflareComponentProps {
    /** Notifications to display. */
    items: NotificationItem[]
    /** Header title in the popover. Default: `"Notifications"`. */
    title?: string
    /** Called when the user clicks a row (also passes the item). */
    onItemClick?: (item: NotificationItem) => void
    /** Called when "Mark as read" is tapped on a row. */
    onMarkRead?: (id: string) => void
    /** Called when "Mark all as read" is tapped. Hide the action by omitting this. */
    onMarkAllRead?: () => void
    /** Custom empty-state content. */
    emptyState?: ReactNode
    /** Maximum items rendered (older ones truncated). */
    limit?: number
    /** Additional class names on the trigger button. */
    triggerClassName?: string
    /** Additional class names on the popover content. */
    contentClassName?: string
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    )
}

/**
 * Bell trigger + dropdown inbox of notifications.
 *
 * @component
 * @layer core
 */
export function NotificationCenter({
    items,
    title = "Notifications",
    onItemClick,
    onMarkRead,
    onMarkAllRead,
    emptyState,
    limit,
    triggerClassName,
    contentClassName,
    surface,
    radius,
    animated,
    iconWeight,
}: NotificationCenterProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

    const visible = typeof limit === "number" ? items.slice(0, limit) : items
    const unreadCount = items.filter((i) => !i.read).length

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    intent="neutral"
                    size="icon"
                    aria-label={`${title}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
                    surface={sf.surface}
                    radius={sf.radius}
                    animated={sf.animated}
                    iconWeight={sf.iconWeight}
                    data-slot="notification-center-trigger"
                    className={cn("relative", triggerClassName)}
                >
                    <BellIcon className="size-4" />
                    {unreadCount > 0 && (
                        <span
                            data-slot="notification-center-badge"
                            aria-hidden="true"
                            className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                data-slot="notification-center-content"
                align="end"
                className={cn("w-80 p-0", contentClassName)}
            >
                <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{title}</p>
                        {unreadCount > 0 && (
                            <Badge variant="soft" intent="primary" size="sm">
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                    {onMarkAllRead && unreadCount > 0 && (
                        <button
                            type="button"
                            data-slot="notification-center-mark-all"
                            onClick={onMarkAllRead}
                            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                <div
                    data-slot="notification-center-list"
                    className="max-h-96 overflow-y-auto"
                >
                    {visible.length === 0 ? (
                        <div
                            data-slot="notification-center-empty"
                            className="px-4 py-8 text-center text-sm text-muted-foreground"
                        >
                            {emptyState ?? "You're all caught up."}
                        </div>
                    ) : (
                        visible.map((item) => {
                            const inner = (
                                <>
                                    {!item.read && (
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                                            />
                                            <span className="sr-only">Unread</span>
                                        </>
                                    )}
                                    {item.icon !== undefined && (
                                        <span className="mt-0.5 flex shrink-0 items-center [&_svg]:size-4 text-muted-foreground">
                                            {item.icon}
                                        </span>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {item.title}
                                        </p>
                                        {item.description !== undefined && (
                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                {item.description}
                                            </p>
                                        )}
                                        {item.timestamp && (
                                            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                                                {item.timestamp}
                                            </p>
                                        )}
                                    </div>
                                    {!item.read && onMarkRead && (
                                        <button
                                            type="button"
                                            data-slot="notification-center-mark"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                onMarkRead(item.id)
                                            }}
                                            aria-label="Mark as read"
                                            className="relative shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <CheckIcon weight={sf.iconWeight} className="size-3" />
                                        </button>
                                    )}
                                </>
                            )

                            const rowClass = cn(
                                "relative flex items-start gap-2 border-b px-3 py-2.5 last:border-b-0",
                                "transition-colors hover:bg-accent/40",
                                !item.read && "bg-primary/5",
                            )
                            const onClick = () => onItemClick?.(item)
                            const titleLabel =
                                typeof item.title === "string" ? item.title : "Notification"
                            const actionLabel = item.read ? titleLabel : `Unread: ${titleLabel}`

                            /* Stretched-overlay pattern: the row action is a SIBLING
                             * of the content (absolute inset-0), never its ancestor,
                             * so the nested mark-as-read <button> stays valid HTML.
                             * The positioned mark-as-read button paints above it. */
                            const overlay = item.href ? (
                                <a
                                    href={item.href}
                                    data-slot="notification-center-item-action"
                                    onClick={onClick}
                                    aria-label={actionLabel}
                                    className="absolute inset-0"
                                />
                            ) : onItemClick ? (
                                <button
                                    type="button"
                                    data-slot="notification-center-item-action"
                                    onClick={onClick}
                                    aria-label={actionLabel}
                                    className="absolute inset-0 cursor-pointer"
                                />
                            ) : null

                            return (
                                <div
                                    key={item.id}
                                    data-slot="notification-center-item"
                                    data-read={String(!!item.read)}
                                    className={rowClass}
                                >
                                    {overlay}
                                    {inner}
                                </div>
                            )
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
