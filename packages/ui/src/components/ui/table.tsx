// @toreview
/**
 * @fileoverview Table primitives — composable data table with header, body, footer,
 * row, cell, head, and caption sub-components. Pure Tailwind CSS implementation
 * with no external UI library dependency. Part of the Saasflare base component layer.
 * @module packages/core/components/ui/table
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

interface TableProps extends Omit<React.ComponentProps<"table">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

function Table({ className, surface, radius, animated, ...props }: TableProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

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

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

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
