// @toreview
"use client"

/**
 * @fileoverview Saasflare DataToolbar — toolbar for data views with search, filters, and actions.
 * @module packages/ui/components/ui/data-toolbar
 * @layer core
 *
 * A flexible toolbar layout for tables, lists, and data grids.
 * Provides slots for search, filters, view toggles, and bulk actions.
 *
 * @example
 * import { DataToolbar, DataToolbarSearch, DataToolbarActions, DataToolbarFilters } from "@saasflare/ui";
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

/**
 * Props for {@link DataToolbar}.
 *
 * Extends the native div props with {@link SaasflareComponentProps}, so
 * `surface`, `radius`, `animated`, and `iconWeight` can be supplied
 * per-instance or inherited from <SaasflareProvider>.
 */
interface DataToolbarProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/** Props for {@link DataToolbarSearch}. */
interface DataToolbarSearchProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/** Props for {@link DataToolbarFilters}. */
interface DataToolbarFiltersProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/** Props for {@link DataToolbarActions}. */
interface DataToolbarActionsProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

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
function DataToolbar({ className, surface, radius, animated, iconWeight, ...props }: DataToolbarProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

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
 *
 * @example
 * <DataToolbarSearch>
 *   <SearchField placeholder="Search users..." />
 * </DataToolbarSearch>
 */
function DataToolbarSearch({ className, surface, radius, animated, iconWeight, ...props }: DataToolbarSearchProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      data-slot="data-toolbar-search"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
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
 *
 * @example
 * <DataToolbarFilters>
 *   <Select>...</Select>
 * </DataToolbarFilters>
 */
function DataToolbarFilters({ className, surface, radius, animated, iconWeight, ...props }: DataToolbarFiltersProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      data-slot="data-toolbar-filters"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
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
 *
 * @example
 * <DataToolbarActions>
 *   <Button size="sm">Export</Button>
 * </DataToolbarActions>
 */
function DataToolbarActions({ className, surface, radius, animated, iconWeight, ...props }: DataToolbarActionsProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      data-slot="data-toolbar-actions"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
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
  type DataToolbarSearchProps,
  type DataToolbarFiltersProps,
  type DataToolbarActionsProps,
}
