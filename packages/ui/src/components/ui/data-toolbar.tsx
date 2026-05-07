// @toreview
"use client"

/**
 * @fileoverview Saasflare DataToolbar — toolbar for data views with search, filters, and actions.
 * @module packages/core/components/ui/data-toolbar
 * @layer core
 *
 * A flexible toolbar layout for tables, lists, and data grids.
 * Provides slots for search, filters, view toggles, and bulk actions.
 *
 * @example
 * import { DataToolbar, DataToolbarSearch, DataToolbarActions, DataToolbarFilters } from "@saasflare/core";
 *
 * <DataToolbar>
 *   <DataToolbarSearch placeholder="Search users..." />
 *   <DataToolbarFilters>
 *     <Select>...</Select>
 *   </DataToolbarFilters>
 *   <DataToolbarActions>
 *     <Button size="sm">Export</Button>
 *   </DataToolbarActions>
 * </DataToolbar>
 */

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

interface DataToolbarProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/**
 * Toolbar container for data views.
 *
 * @component
 * @layer core
 *
 * @example
 * <DataToolbar>
 *   <DataToolbarSearch placeholder="Search..." />
 *   <DataToolbarActions>
 *     <Button size="sm">Add New</Button>
 *   </DataToolbarActions>
 * </DataToolbar>
 */
function DataToolbar({ className, surface, radius, animated, ...props }: DataToolbarProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <div
      {...props}
      data-slot="data-toolbar"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    />
  )
}

/**
 * Search slot within the data toolbar.
 *
 * @component
 * @layer core
 */
function DataToolbarSearch({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-toolbar-search"
      className={cn("w-full sm:max-w-sm", className)}
      {...props}
    />
  )
}

/**
 * Filters slot within the data toolbar.
 *
 * @component
 * @layer core
 */
function DataToolbarFilters({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-toolbar-filters"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

/**
 * Actions slot within the data toolbar (right-aligned).
 *
 * @component
 * @layer core
 */
function DataToolbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-toolbar-actions"
      className={cn("flex items-center gap-2 sm:ml-auto", className)}
      {...props}
    />
  )
}

export {
  DataToolbar,
  DataToolbarSearch,
  DataToolbarFilters,
  DataToolbarActions,
  type DataToolbarProps,
}
