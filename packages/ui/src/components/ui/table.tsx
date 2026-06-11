// @toreview
/**
 * @fileoverview Table primitives — composable data table with header, body, footer,
 * row, cell, head, and caption sub-components. Pure Tailwind CSS implementation
 * with no external UI library dependency. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/table
 * @layer core
 *
 * @component
 * @example
 * import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@saasflare/ui';
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Acme Corp</TableCell>
 *       <TableCell>Active</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
"use client"

import * as React from "react"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link Table}. Extends {@link SaasflareComponentProps} so
 * `surface`, `radius`, `animated`, and `iconWeight` can be supplied
 * per-instance or inherited from the provider.
 */
interface TableProps extends Omit<React.ComponentProps<"table">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/**
 * Data table root — a styled `<table>` wrapped in a horizontally scrollable
 * container so wide tables stay usable on narrow viewports. Compose with
 * {@link TableHeader}, {@link TableBody}, {@link TableRow}, and friends.
 *
 * @component
 * @layer core
 */
function Table({ className, surface, radius, animated, iconWeight, ...props }: TableProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        {...props}
        data-slot="table"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={cn("w-full caption-bottom text-sm", className)}
      />
    </div>
  )
}

/**
 * Table header section (`<thead>`) — wraps the heading row(s).
 *
 * @component
 * @layer core
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

/**
 * Table body section (`<tbody>`) holding the data rows.
 *
 * @component
 * @layer core
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

/**
 * Table footer section (`<tfoot>`) — muted emphasis for totals or summary rows.
 *
 * @component
 * @layer core
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Table row (`<tr>`) with hover and `data-state="selected"` highlighting.
 *
 * @component
 * @layer core
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

/**
 * Header cell (`<th>`) inside a {@link TableHeader} row.
 *
 * @component
 * @layer core
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Data cell (`<td>`) inside a body or footer row.
 *
 * @component
 * @layer core
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Table caption rendered below the table.
 *
 * @component
 * @layer core
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  type TableProps,
}
