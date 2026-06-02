// @draft
"use client"

/**
 * @fileoverview DataTable — typed, dependency-free data grid built on the
 * Saasflare Table primitives. Consumers pass `data: T[]` + typed `columns` and
 * get client-side multi-column sort, row selection (controlled/uncontrolled),
 * client-side pagination (via {@link usePagination}), sticky header, density,
 * and empty/loading states out of the box — zero TanStack, zero wiring.
 * @module packages/ui/components/ui/data-table
 * @layer composed
 *
 * Server-side / TanStack: pass `manualSort` + `manualPagination` and drive
 * state from `onSortChange` / `onPageChange`. The component stays
 * dependency-free; `@tanstack/react-table` is NEVER a dependency of `@saasflare/ui`.
 *
 * @component
 * @example
 * import { DataTable } from "@saasflare/ui";
 * <DataTable
 *   data={users}
 *   columns={[
 *     { accessorKey: "name", header: "Name", sortable: true },
 *     { accessorKey: "email", header: "Email" },
 *   ]}
 *   getRowId="id"
 *   selectionMode="multiple"
 *   pageSize={10}
 * />
 */

import * as React from "react"
import { CaretUpIcon, CaretDownIcon } from "./phosphor"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table"
import { Checkbox } from "./checkbox"
import { Skeleton } from "./skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./pagination"
import {
  useDataTable,
  type DataTableColumn,
  type DataTableSort,
  type DataTableAlign,
  type DataTableDensity,
  type DataTableSelectionMode,
} from "../../hooks/use-data-table"

export type { DataTableColumn, DataTableSort, DataTableAlign, DataTableDensity }

interface DataTableProps<T>
  extends Omit<React.ComponentProps<"table">, "children" | keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Row data. */
  data: T[]
  /** Typed column definitions. */
  columns: DataTableColumn<T>[]
  /** Stable row key. String key of `T` or a function. Falls back to row index (logs a dev warning, since index keys break selection across sort/paginate). */
  getRowId?: keyof T | ((row: T, index: number) => string)

  // ── Sorting (multi-column, asc → desc → none cycle) ───────────────────────
  /** Uncontrolled initial sort. */
  defaultSort?: DataTableSort[]
  /** Controlled sort state. Presence switches sorting to controlled. */
  sort?: DataTableSort[]
  /** Fires on header activation with the next sort array. */
  onSortChange?: (sort: DataTableSort[]) => void
  /** Allow stacking multiple sort columns (shift-click adds a column). Default `false` (single-column). */
  multiSort?: boolean
  /** Skip internal sorting (server/TanStack drives order). Header still emits `onSortChange`. Default `false`. */
  manualSort?: boolean

  // ── Selection (header + per-row checkbox) ─────────────────────────────────
  /** `"none"` (default) | `"single"` | `"multiple"`. Renders a leading checkbox column when not `"none"`. */
  selectionMode?: DataTableSelectionMode
  /** Uncontrolled initial selected row-id set. */
  defaultSelectedKeys?: string[]
  /** Controlled selected row-id set. */
  selectedKeys?: string[]
  /** Fires with the next selected row-id array. */
  onSelectedKeysChange?: (keys: string[]) => void
  /** Predicate to disable selection for specific rows (their checkbox is disabled + excluded from select-all). */
  isRowSelectable?: (row: T) => boolean

  // ── Pagination (reuses usePagination) ─────────────────────────────────────
  /** Rows per page. Omit / `0` disables pagination (renders all rows, no footer). */
  pageSize?: number
  /** Uncontrolled initial page (1-indexed). Default `1`. */
  defaultPage?: number
  /** Controlled page (1-indexed). */
  page?: number
  /** Fires on page change. */
  onPageChange?: (page: number) => void
  /** Skip internal pagination/slicing (server drives the window). `data` is treated as the current page; pass `rowCount` for the footer. Default `false`. */
  manualPagination?: boolean
  /** Total row count when `manualPagination` — drives the page-count math in the footer. */
  rowCount?: number

  // ── States / chrome ───────────────────────────────────────────────────────
  /** Loading flag — renders `loadingRows` skeleton rows; disables sort/select while true. */
  loading?: boolean
  /** Skeleton row count while `loading`. Default = `pageSize || 5`. */
  loadingRows?: number
  /** Rendered in a full-width body row when `data` is empty and not loading. Defaults to a built-in message. */
  emptyState?: React.ReactNode
  /** Pin the header on vertical scroll within a `maxHeight` container. Default `false`. */
  stickyHeader?: boolean
  /** Max body height (enables internal scroll; required for `stickyHeader` to be useful). e.g. `"24rem"`. */
  maxHeight?: number | string
  /** Density preset. Default `"comfortable"`. */
  density?: DataTableDensity
  /** Optional row click handler. Receives row + index. Adds `cursor-pointer` + keyboard activation when set. */
  onRowClick?: (row: T, index: number) => void
  /** Accessible caption (visually hidden by default) describing the table. */
  caption?: React.ReactNode
  /** Hide the built-in pagination footer even when paginated (consumer renders own Pagination). Default `false`. */
  hidePagination?: boolean
}

/** Maps column alignment to text + flex justification classes. */
const ALIGN_TEXT: Record<DataTableAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
}
const ALIGN_JUSTIFY: Record<DataTableAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
}

/** Density → cell/header sizing classes. `comfortable` uses the Table primitive defaults. */
const DENSITY_HEAD: Record<DataTableDensity, string> = {
  comfortable: "",
  compact: "h-8 py-1",
}
const DENSITY_CELL: Record<DataTableDensity, string> = {
  comfortable: "",
  compact: "py-1",
}

/** Resolves a stable column id for keys + sort lookups. */
function columnId<T>(column: DataTableColumn<T>, index: number): string {
  if (column.id !== undefined) return column.id
  if (column.accessorKey !== undefined) return String(column.accessorKey)
  return `col-${index}`
}

/** Sort indicator built from Phosphor carets (asc / desc / both-at-half-opacity). */
function SortIndicator({
  direction,
  weight,
}: {
  direction: "asc" | "desc" | "none"
  weight: SaasflareComponentProps["iconWeight"]
}) {
  if (direction === "asc") {
    return <CaretUpIcon weight={weight} className="size-3.5 text-foreground" aria-hidden />
  }
  if (direction === "desc") {
    return <CaretDownIcon weight={weight} className="size-3.5 text-foreground" aria-hidden />
  }
  return (
    <span className="relative inline-flex size-3.5 flex-col items-center justify-center text-muted-foreground/50" aria-hidden>
      <CaretUpIcon weight={weight} className="size-2.5 -mb-1" />
      <CaretDownIcon weight={weight} className="size-2.5 -mt-1" />
    </span>
  )
}

/**
 * Dependency-free, typed, sortable + selectable + paginated data table built on
 * the Saasflare Table primitives. Resolves the four design axes
 * (surface/radius/animated/iconWeight) and emits data-surface/data-radius/data-animated.
 *
 * Selection note: the header "select all" checkbox operates on the
 * **current page** only (it toggles the visible page's selectable rows;
 * off-page selections are preserved).
 *
 * @component
 * @layer composed
 *
 * @example
 * <DataTable
 *   data={users}
 *   columns={[
 *     { accessorKey: "name", header: "Name", sortable: true },
 *     { accessorKey: "email", header: "Email" },
 *     { accessorKey: "plan", header: "Plan", sortable: true, align: "end" },
 *   ]}
 *   getRowId="id"
 *   selectionMode="multiple"
 *   pageSize={10}
 *   stickyHeader
 *   maxHeight="24rem"
 * />
 */
function DataTable<T>(props: DataTableProps<T>): React.JSX.Element {
  const {
    data,
    columns,
    getRowId,
    defaultSort,
    sort,
    onSortChange,
    multiSort = false,
    manualSort = false,
    selectionMode = "none",
    defaultSelectedKeys,
    selectedKeys,
    onSelectedKeysChange,
    isRowSelectable,
    pageSize = 0,
    defaultPage = 1,
    page,
    onPageChange,
    manualPagination = false,
    rowCount,
    loading = false,
    loadingRows,
    emptyState,
    stickyHeader = false,
    maxHeight,
    density = "comfortable",
    onRowClick,
    caption,
    hidePagination = false,
    className,
    surface,
    radius,
    animated,
    iconWeight,
    ...tableProps
  } = props

  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  const table = useDataTable<T>({
    data,
    columns,
    getRowId,
    defaultSort,
    sort,
    onSortChange,
    multiSort,
    manualSort,
    selectionMode,
    defaultSelectedKeys,
    selectedKeys,
    onSelectedKeysChange,
    isRowSelectable,
    pageSize,
    defaultPage,
    page,
    onPageChange,
    manualPagination,
    rowCount,
  })

  const hasSelection = selectionMode !== "none"
  const totalCols = columns.length + (hasSelection ? 1 : 0)
  const paginationEnabled = pageSize > 0
  const showFooter = paginationEnabled && !hidePagination
  const skeletonRows = loadingRows ?? (pageSize > 0 ? pageSize : 5)
  const interactionsDisabled = loading

  const containerStyle: React.CSSProperties | undefined =
    maxHeight !== undefined ? { maxHeight, overflowY: "auto" } : undefined

  const headerStickyClass = stickyHeader ? "sticky top-0 z-10 bg-card" : ""

  /** Renders the per-row leading selection checkbox cell. */
  const renderSelectionCell = (row: T, index: number) => {
    if (!hasSelection) return null
    const id = table.rowId(row, index)
    const disabled = interactionsDisabled || (isRowSelectable ? !isRowSelectable(row) : false)
    return (
      <TableCell className={cn("w-px", DENSITY_CELL[density])}>
        <Checkbox
          checked={table.isSelected(id)}
          disabled={disabled}
          onCheckedChange={() => table.toggleRow(id)}
          onClick={(event) => event.stopPropagation()}
          aria-label="Select row"
          surface={sf.surface}
          radius={sf.radius}
          animated={sf.animated}
          iconWeight={sf.iconWeight}
        />
      </TableCell>
    )
  }

  /** Ignore row-click activation that originated on an interactive descendant. */
  const isInteractiveTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false
    return Boolean(target.closest('button, a, input, [role="checkbox"], [role="button"], select, textarea'))
  }

  const handleRowActivate = (row: T, index: number, target: EventTarget | null) => {
    if (!onRowClick || interactionsDisabled) return
    if (isInteractiveTarget(target)) return
    onRowClick(row, index)
  }

  const selectAllChecked: boolean | "indeterminate" =
    table.selectAllState === "all" ? true : table.selectAllState === "some" ? "indeterminate" : false

  return (
    <div className="w-full space-y-4">
      <div
        data-slot="data-table"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={cn(maxHeight !== undefined && "relative w-full overflow-auto rounded-xl border")}
        style={containerStyle}
      >
        <Table
          {...tableProps}
          surface={sf.surface}
          radius={sf.radius}
          animated={sf.animated}
          className={className}
        >
          {caption ? <TableCaption className="sr-only">{caption}</TableCaption> : null}

          <TableHeader className={headerStickyClass}>
            <TableRow>
              {hasSelection ? (
                <TableHead className={cn("w-px", DENSITY_HEAD[density])}>
                  {selectionMode === "multiple" ? (
                    <Checkbox
                      checked={selectAllChecked}
                      disabled={interactionsDisabled || table.rows.length === 0}
                      onCheckedChange={() => table.toggleSelectAll()}
                      aria-label="Select all rows on this page"
                      surface={sf.surface}
                      radius={sf.radius}
                      animated={sf.animated}
                      iconWeight={sf.iconWeight}
                    />
                  ) : null}
                </TableHead>
              ) : null}

              {columns.map((column, index) => {
                const id = columnId(column, index)
                const align = column.align ?? "start"
                const direction = table.sortDirectionFor(id)
                const sortable = Boolean(column.sortable) && !interactionsDisabled
                const ariaSort: React.AriaAttributes["aria-sort"] =
                  !column.sortable ? undefined : direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"

                return (
                  <TableHead
                    key={id}
                    aria-sort={ariaSort}
                    aria-label={column.ariaLabel}
                    className={cn(ALIGN_TEXT[align], DENSITY_HEAD[density], column.headerClassName)}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={(event) => table.toggleSort(id, event.shiftKey || event.metaKey || event.ctrlKey)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            table.toggleSort(id, event.shiftKey)
                          }
                        }}
                        className={cn(
                          "inline-flex w-full items-center gap-1.5 rounded-sm font-medium outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          ALIGN_JUSTIFY[align],
                        )}
                      >
                        <span>{column.header}</span>
                        <SortIndicator direction={direction} weight={sf.iconWeight} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {hasSelection ? (
                    <TableCell className={cn("w-px", DENSITY_CELL[density])}>
                      <Skeleton className="size-4" />
                    </TableCell>
                  ) : null}
                  {columns.map((column, colIndex) => (
                    <TableCell key={columnId(column, colIndex)} className={cn(DENSITY_CELL[density], column.className)}>
                      <Skeleton className="h-4 w-full max-w-[12rem]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={totalCols} className="h-24 text-center text-muted-foreground">
                  {emptyState ?? "No results."}
                </TableCell>
              </TableRow>
            ) : (
              table.rows.map((row, index) => {
                const id = table.rowId(row, index)
                const selected = hasSelection && table.isSelected(id)
                const clickable = Boolean(onRowClick) && !interactionsDisabled
                return (
                  <TableRow
                    key={id}
                    data-state={selected ? "selected" : undefined}
                    role={clickable ? "button" : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    onClick={clickable ? (event) => handleRowActivate(row, index, event.target) : undefined}
                    onKeyDown={
                      clickable
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              if (isInteractiveTarget(event.target)) return
                              event.preventDefault()
                              onRowClick?.(row, index)
                            }
                          }
                        : undefined
                    }
                    className={clickable ? "cursor-pointer" : undefined}
                  >
                    {renderSelectionCell(row, index)}
                    {columns.map((column, colIndex) => {
                      const cid = columnId(column, colIndex)
                      const align = column.align ?? "start"
                      const content = column.cell
                        ? column.cell(row, index)
                        : column.accessorKey !== undefined
                          ? formatCell(row[column.accessorKey])
                          : null
                      return (
                        <TableCell
                          key={cid}
                          className={cn(ALIGN_TEXT[align], DENSITY_CELL[density], column.className)}
                        >
                          {content}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            )}
          </TableBody>

          {showFooter ? (
            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={totalCols} className="bg-transparent">
                  <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    {hasSelection ? (
                      <span className="text-sm font-normal text-muted-foreground">
                        {table.selectedKeys.size} of {table.selectableCount} selected
                      </span>
                    ) : (
                      <span />
                    )}
                    <Pagination
                      className="mx-0 w-auto justify-end"
                      surface={sf.surface}
                      radius={sf.radius}
                      animated={sf.animated}
                      iconWeight={sf.iconWeight}
                    >
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            role="button"
                            aria-disabled={table.activePage <= 1}
                            className={cn(table.activePage <= 1 && "pointer-events-none opacity-50")}
                            onClick={() => table.setPage(table.activePage - 1)}
                          />
                        </PaginationItem>
                        {table.range.map((item, i) =>
                          item === "dots" ? (
                            <PaginationItem key={`dots-${i}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={item}>
                              <PaginationLink
                                role="button"
                                isActive={item === table.activePage}
                                onClick={() => table.setPage(item)}
                              >
                                {item}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}
                        <PaginationItem>
                          <PaginationNext
                            role="button"
                            aria-disabled={table.activePage >= table.pageCount}
                            className={cn(table.activePage >= table.pageCount && "pointer-events-none opacity-50")}
                            onClick={() => table.setPage(table.activePage + 1)}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          ) : null}
        </Table>
      </div>
    </div>
  )
}

/** Coerces a cell value to a renderable node — leaves React nodes intact, stringifies primitives. */
function formatCell(value: unknown): React.ReactNode {
  if (value == null) return null
  if (React.isValidElement(value)) return value
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return String(value)
}

export { DataTable, type DataTableProps }
