// @draft
"use client"

/**
 * @fileoverview Saasflare TreeView — recursive expand/collapse tree.
 * @author Saasflare™
 *
 * Renders a hierarchical list of nodes with disclosure carets. Supports
 * controlled + uncontrolled expansion and selection, keyboard navigation
 * (Arrow keys, Home/End), and per-node leading icons.
 *
 * @module packages/ui/components/ui/tree-view
 * @package ui
 * @layer core
 *
 * @example
 * <TreeView
 *   data={[
 *     {
 *       id: "src", label: "src",
 *       children: [
 *         { id: "src/app", label: "app" },
 *         { id: "src/lib", label: "lib", children: [{ id: "src/lib/cn", label: "cn.ts" }] },
 *       ],
 *     },
 *   ]}
 * />
 */

import {
    useCallback,
    useMemo,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { CaretRightIcon } from "./phosphor"

/** A single tree node. */
export interface TreeNode {
    /** Unique node id (stable across renders). */
    id: string
    /** Display label or any ReactNode. */
    label: ReactNode
    /** Leading icon (e.g. file/folder glyph). */
    icon?: ReactNode
    /** Child nodes (omit for leaves). */
    children?: TreeNode[]
    /** Disable interaction for this node. */
    disabled?: boolean
}

/** Props for the TreeView component. */
export interface TreeViewProps extends SaasflareComponentProps {
    /** Tree data, top-level nodes. */
    data: TreeNode[]
    /** Controlled expanded ids. */
    expanded?: string[]
    /** Uncontrolled initial expansion. */
    defaultExpanded?: string[]
    /** Called when a node is expanded/collapsed. */
    onExpand?: (ids: string[]) => void
    /** Controlled selected id. */
    selected?: string | null
    /** Uncontrolled initial selection. */
    defaultSelected?: string | null
    /** Called when selection changes. */
    onSelect?: (id: string | null) => void
    /** Additional class names on the root. */
    className?: string
}

interface FlatNode {
    node: TreeNode
    depth: number
    parentId: string | null
}

/** Flatten the visible (expanded) tree into a list for keyboard nav. */
function flattenVisible(data: TreeNode[], expanded: Set<string>): FlatNode[] {
    const out: FlatNode[] = []
    const walk = (nodes: TreeNode[], depth: number, parentId: string | null) => {
        for (const node of nodes) {
            out.push({ node, depth, parentId })
            if (node.children && expanded.has(node.id)) {
                walk(node.children, depth + 1, node.id)
            }
        }
    }
    walk(data, 0, null)
    return out
}

/**
 * Recursive expand/collapse tree with keyboard navigation.
 *
 * @component
 * @layer core
 */
export function TreeView({
    data,
    expanded,
    defaultExpanded,
    onExpand,
    selected,
    defaultSelected,
    onSelect,
    className,
    surface,
    radius,
    animated,
    iconWeight,
}: TreeViewProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

    const isExpandedControlled = expanded !== undefined
    const [internalExpanded, setInternalExpanded] = useState<string[]>(
        defaultExpanded ?? [],
    )
    const expandedSet = useMemo(
        () => new Set(isExpandedControlled ? (expanded as string[]) : internalExpanded),
        [isExpandedControlled, expanded, internalExpanded],
    )

    const isSelectedControlled = selected !== undefined
    const [internalSelected, setInternalSelected] = useState<string | null>(
        defaultSelected ?? null,
    )
    const currentSelected = isSelectedControlled ? selected : internalSelected

    const toggle = useCallback(
        (id: string) => {
            const next = new Set(expandedSet)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            const arr = Array.from(next)
            if (!isExpandedControlled) setInternalExpanded(arr)
            onExpand?.(arr)
        },
        [expandedSet, isExpandedControlled, onExpand],
    )

    const select = useCallback(
        (id: string | null) => {
            if (!isSelectedControlled) setInternalSelected(id)
            onSelect?.(id)
        },
        [isSelectedControlled, onSelect],
    )

    const flat = useMemo(() => flattenVisible(data, expandedSet), [data, expandedSet])

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
        const item = flat[index]
        if (!item || item.node.disabled) return
        const moveTo = (i: number) => {
            const target = flat[i]
            if (!target) return
            select(target.node.id)
            const el = e.currentTarget.parentElement?.querySelectorAll<HTMLDivElement>(
                "[data-slot='tree-view-row']",
            )[i]
            el?.focus()
        }
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                moveTo(Math.min(index + 1, flat.length - 1))
                break
            case "ArrowUp":
                e.preventDefault()
                moveTo(Math.max(index - 1, 0))
                break
            case "ArrowRight":
                e.preventDefault()
                if (item.node.children && !expandedSet.has(item.node.id)) {
                    toggle(item.node.id)
                } else {
                    moveTo(index + 1)
                }
                break
            case "ArrowLeft":
                e.preventDefault()
                if (item.node.children && expandedSet.has(item.node.id)) {
                    toggle(item.node.id)
                } else if (item.parentId) {
                    const parentIdx = flat.findIndex((f) => f.node.id === item.parentId)
                    if (parentIdx >= 0) moveTo(parentIdx)
                }
                break
            case "Home":
                e.preventDefault()
                moveTo(0)
                break
            case "End":
                e.preventDefault()
                moveTo(flat.length - 1)
                break
            case "Enter":
            case " ":
                e.preventDefault()
                if (item.node.children) toggle(item.node.id)
                select(item.node.id)
                break
        }
    }

    return (
        <div
            data-slot="tree-view"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            role="tree"
            className={cn("text-sm select-none", className)}
        >
            {flat.map(({ node, depth }, index) => {
                const hasChildren = !!node.children?.length
                const isExpanded = expandedSet.has(node.id)
                const isSelected = currentSelected === node.id
                return (
                    <div
                        key={node.id}
                        data-slot="tree-view-row"
                        role="treeitem"
                        aria-expanded={hasChildren ? isExpanded : undefined}
                        aria-selected={isSelected}
                        aria-level={depth + 1}
                        aria-disabled={node.disabled || undefined}
                        tabIndex={isSelected || (currentSelected === null && index === 0) ? 0 : -1}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onClick={() => {
                            if (node.disabled) return
                            if (hasChildren) toggle(node.id)
                            select(node.id)
                        }}
                        className={cn(
                            "flex h-7 cursor-pointer items-center gap-1 rounded px-1.5",
                            "transition-colors hover:bg-accent/40",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected && "bg-accent/60 text-foreground",
                            node.disabled && "pointer-events-none opacity-50",
                        )}
                        style={{ paddingLeft: 6 + depth * 16 }}
                    >
                        {hasChildren ? (
                            <CaretRightIcon
                                className={cn(
                                    "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
                                    isExpanded && "rotate-90",
                                )}
                            />
                        ) : (
                            <span className="size-3.5 shrink-0" aria-hidden="true" />
                        )}
                        {node.icon !== undefined && (
                            <span className="flex shrink-0 items-center [&_svg]:size-4">
                                {node.icon}
                            </span>
                        )}
                        <span className="truncate">{node.label}</span>
                    </div>
                )
            })}
        </div>
    )
}
