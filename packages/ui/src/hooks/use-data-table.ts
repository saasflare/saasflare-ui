// @draft
"use client"

/**
 * @fileoverview Headless sort / selection / pagination engine for {@link DataTable}.
 * Pure state machine — no markup, no design tokens. Each of the three axes
 * (sort, selection, pagination) is independently controllable, following the
 * repo's controlled/uncontrolled precedence (prop present ⇒ controlled; else
 * internal `useState` seeded from a `default*`). Power users / a TanStack
 * recipe can borrow this without the rendered grid.
 * @module packages/ui/hooks/use-data-table
 * @package ui
 *
 * @example
 * const t = useDataTable({ data, columns, getRowId: "id", pageSize: 10 });
 * // t.rows         → current page (sorted + sliced)
 * // t.toggleSort   → cycle a column asc → desc → none
 * // t.toggleRow    → flip a row's selection (keyed by stable rowId)
 */

import { useCallback, useMemo, useRef, useState } from "react"
import { usePagination, type PaginationRangeItem } from "./use-pagination"

declare const process: { readonly env: { readonly NODE_ENV?: string } }

/** Text alignment for a DataTable column's header + cells. */
export type DataTableAlign = "start" | "center" | "end"

/** Row density preset. Controls cell padding + header height. */
export type DataTableDensity = "comfortable" | "compact"

/** Selection cardinality. `"none"` hides the leading checkbox column. */
export type DataTableSelectionMode = "none" | "single" | "multiple"

/**
 * Typed column definition. `T` is the row shape; `accessorKey` is constrained
 * to keys of `T` so the accessor is fully type-checked and IntelliSense-driven.
 *
 * @example
 * const columns: DataTableColumn<User>[] = [
 *   { accessorKey: "name", header: "Name", sortable: true },
 *   { id: "actions", header: "", cell: (row) => <RowMenu id={row.id} />, align: "end" },
 * ]
 */
export interface DataTableColumn<T> {
  /** Stable column id. Defaults to `String(accessorKey)` when omitted. Required if no `accessorKey` (e.g. an actions column). */
  id?: string
  /** Key of the row object to read the value from. Omit for derived/action columns that only use `cell`. */
  accessorKey?: keyof T
  /** Header content — string or node. */
  header: React.ReactNode
  /** Custom cell renderer. Receives the full row + row index. Falls back to `String(row[accessorKey])`. */
  cell?: (row: T, rowIndex: number) => React.ReactNode
  /** Enables click-to-sort on this column's header. Requires a sortable value (uses `sortFn` or default comparator). Default `false`. */
  sortable?: boolean
  /** Custom comparator for sorting. Defaults to a locale-aware string / numeric compare on `row[accessorKey]`. */
  sortFn?: (a: T, b: T) => number
  /** Header + cell alignment. Default `"start"`. */
  align?: DataTableAlign
  /** CSS width applied to the column (`<col>` style), e.g. `"40%"` or `160`. */
  width?: number | string
  /** Per-cell className for the `<td>`. */
  className?: string
  /** Per-header className for the `<th>`. */
  headerClassName?: string
  /** Accessible label for the header when `header` is a non-text node (icon-only / actions column). */
  ariaLabel?: string
}

/** One sort instruction. `desc:false` = ascending. */
export interface DataTableSort {
  /** Column id this sort applies to. */
  id: string
  /** `true` = descending, `false` = ascending. */
  desc: boolean
}

/** Options for {@link useDataTable}. Mirrors the controllable DataTable props (sort/selection/pagination). */
export interface UseDataTableOptions<T> {
  /** Row data. */
  data: T[]
  /** Typed column definitions. */
  columns: DataTableColumn<T>[]
  /** Stable row key — string key of `T` or a function. Falls back to row index (logs a one-time dev warning). */
  getRowId?: keyof T | ((row: T, index: number) => string)
  /** Uncontrolled initial sort. */
  defaultSort?: DataTableSort[]
  /** Controlled sort state. Presence switches sorting to controlled. */
  sort?: DataTableSort[]
  /** Fires on header activation with the next sort array. */
  onSortChange?: (sort: DataTableSort[]) => void
  /** Allow stacking multiple sort columns (additive activation appends/cycles). Default `false`. */
  multiSort?: boolean
  /** Skip internal sorting (server/TanStack drives order). Header still emits `onSortChange`. Default `false`. */
  manualSort?: boolean
  /** Selection cardinality. Default `"none"`. */
  selectionMode?: DataTableSelectionMode
  /** Uncontrolled initial selected row-id set. */
  defaultSelectedKeys?: string[]
  /** Controlled selected row-id set. */
  selectedKeys?: string[]
  /** Fires with the next selected row-id array. */
  onSelectedKeysChange?: (keys: string[]) => void
  /** Predicate to disable selection for specific rows. */
  isRowSelectable?: (row: T) => boolean
  /** Rows per page. Omit / `0` disables pagination (all rows in one view). */
  pageSize?: number
  /** Uncontrolled initial page (1-indexed). Default `1`. */
  defaultPage?: number
  /** Controlled page (1-indexed). */
  page?: number
  /** Fires on page change. */
  onPageChange?: (page: number) => void
  /** Skip internal pagination/slicing (server drives the window). `data` is the current page. Default `false`. */
  manualPagination?: boolean
  /** Total row count when `manualPagination` — drives the footer's page-count math. */
  rowCount?: number
}

/** Resolved table state + actions returned by {@link useDataTable}. */
export interface UseDataTableReturn<T> {
  /** Rows for the current view (sorted + sliced unless manual*). */
  rows: T[]
  /** rowId for a given row. */
  rowId: (row: T, index: number) => string
  /** Active sort instructions (first = primary). */
  sort: DataTableSort[]
  /** Cycle a column's sort asc → desc → none. `additive` keeps other sorted columns (multi-sort). */
  toggleSort: (columnId: string, additive: boolean) => void
  /** Current sort direction for a column. */
  sortDirectionFor: (columnId: string) => "asc" | "desc" | "none"
  /** Selected row ids. */
  selectedKeys: Set<string>
  /** Whether a row id is selected. */
  isSelected: (id: string) => boolean
  /** Flip a single row's selection (respects `selectionMode`). */
  toggleRow: (id: string) => void
  /** "all" | "some" | "none" across selectable rows on the current page. */
  selectAllState: "all" | "some" | "none"
  /** Select / clear exactly the current page's selectable ids (off-page selections preserved). */
  toggleSelectAll: () => void
  /** Active 1-indexed page. */
  activePage: number
  /** Total page count. */
  pageCount: number
  /** Set the active page (clamped). */
  setPage: (page: number) => void
  /** Pagination range (page numbers + `'dots'` markers). */
  range: PaginationRangeItem[]
  /** Total selectable row count across the whole data set (for the footer summary). */
  selectableCount: number
}

/** Resolves the stable `rowId` accessor from the `getRowId` option. */
function resolveRowId<T>(
  getRowId: UseDataTableOptions<T>["getRowId"],
  warnedRef: React.MutableRefObject<boolean>,
): (row: T, index: number) => string {
  if (typeof getRowId === "function") {
    return (row, index) => String(getRowId(row, index))
  }
  if (getRowId !== undefined) {
    const key = getRowId
    return (row) => String((row as Record<keyof T, unknown>)[key])
  }
  return (_row, index) => {
    if (process.env.NODE_ENV !== "production" && !warnedRef.current) {
      warnedRef.current = true
      // eslint-disable-next-line no-console
      console.warn(
        "[DataTable] No `getRowId` provided — falling back to the row index. " +
          "Index keys silently corrupt selection across sort/paginate. Pass a stable key, e.g. getRowId=\"id\".",
      )
    }
    return String(index)
  }
}

/** Default comparator: numeric for numbers, valueOf for Dates, locale string compare otherwise. */
function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === "number" && typeof b === "number") return a - b
  if (a instanceof Date && b instanceof Date) return a.valueOf() - b.valueOf()
  return String(a).localeCompare(String(b))
}

/**
 * Headless sort/selection/pagination engine for {@link DataTable}. Controlled +
 * uncontrolled for all three axes. Pure — no markup, no design tokens.
 *
 * @example
 * const t = useDataTable({ data, columns, getRowId: "id", pageSize: 10 });
 */
export function useDataTable<T>(options: UseDataTableOptions<T>): UseDataTableReturn<T> {
  const {
    data,
    columns,
    getRowId,
    defaultSort,
    sort: controlledSort,
    onSortChange,
    multiSort = false,
    manualSort = false,
    selectionMode = "none",
    defaultSelectedKeys,
    selectedKeys: controlledSelectedKeys,
    onSelectedKeysChange,
    isRowSelectable,
    pageSize = 0,
    defaultPage = 1,
    page: controlledPage,
    onPageChange,
    manualPagination = false,
    rowCount,
  } = options

  const warnedRef = useRef(false)
  const rowId = useMemo(() => resolveRowId(getRowId, warnedRef), [getRowId])

  // ── Sort axis (controlled / uncontrolled) ────────────────────────────────
  const [uncontrolledSort, setUncontrolledSort] = useState<DataTableSort[]>(
    () => defaultSort ?? [],
  )
  const isSortControlled = controlledSort !== undefined
  const sort = isSortControlled ? controlledSort : uncontrolledSort

  const columnById = useMemo(() => {
    const map = new Map<string, DataTableColumn<T>>()
    for (const col of columns) {
      const id = col.id ?? (col.accessorKey !== undefined ? String(col.accessorKey) : undefined)
      if (id !== undefined) map.set(id, col)
    }
    return map
  }, [columns])

  const commitSort = useCallback(
    (next: DataTableSort[]) => {
      if (!isSortControlled) setUncontrolledSort(next)
      onSortChange?.(next)
    },
    [isSortControlled, onSortChange],
  )

  const toggleSort = useCallback(
    (columnId: string, additive: boolean) => {
      const existing = sort.find((s) => s.id === columnId)
      // Per-column cycle: none → asc → desc → none
      let nextForColumn: DataTableSort | null
      if (!existing) nextForColumn = { id: columnId, desc: false }
      else if (!existing.desc) nextForColumn = { id: columnId, desc: true }
      else nextForColumn = null

      let next: DataTableSort[]
      if (multiSort && additive) {
        const others = sort.filter((s) => s.id !== columnId)
        next = nextForColumn ? [...others, nextForColumn] : others
      } else {
        next = nextForColumn ? [nextForColumn] : []
      }
      commitSort(next)
    },
    [sort, multiSort, commitSort],
  )

  const sortDirectionFor = useCallback(
    (columnId: string): "asc" | "desc" | "none" => {
      const s = sort.find((entry) => entry.id === columnId)
      if (!s) return "none"
      return s.desc ? "desc" : "asc"
    },
    [sort],
  )

  // ── Sorted rows (skipped when manualSort) ────────────────────────────────
  const sortedRows = useMemo(() => {
    if (manualSort || sort.length === 0) return data
    const next = data.slice()
    next.sort((a, b) => {
      for (const instruction of sort) {
        const col = columnById.get(instruction.id)
        if (!col) continue
        let cmp: number
        if (col.sortFn) {
          cmp = col.sortFn(a, b)
        } else if (col.accessorKey !== undefined) {
          cmp = defaultCompare(a[col.accessorKey], b[col.accessorKey])
        } else {
          cmp = 0
        }
        if (cmp !== 0) return instruction.desc ? -cmp : cmp
      }
      return 0
    })
    return next
  }, [data, sort, manualSort, columnById])

  // ── Pagination axis ──────────────────────────────────────────────────────
  const paginationEnabled = pageSize > 0
  const totalRowCount = manualPagination ? Math.max(0, rowCount ?? sortedRows.length) : sortedRows.length
  const pageCount = paginationEnabled ? Math.max(1, Math.ceil(totalRowCount / pageSize)) : 1

  const pagination = usePagination({
    total: pageCount,
    initialPage: defaultPage,
    page: controlledPage,
    onChange: onPageChange,
  })
  const { activePage, setPage, range } = pagination

  const rows = useMemo(() => {
    if (!paginationEnabled || manualPagination) return sortedRows
    const start = (activePage - 1) * pageSize
    return sortedRows.slice(start, start + pageSize)
  }, [sortedRows, paginationEnabled, manualPagination, activePage, pageSize])

  // ── Selection axis (controlled / uncontrolled) ───────────────────────────
  const [uncontrolledSelected, setUncontrolledSelected] = useState<string[]>(
    () => defaultSelectedKeys ?? [],
  )
  const isSelectionControlled = controlledSelectedKeys !== undefined
  const selectedArray = isSelectionControlled ? controlledSelectedKeys : uncontrolledSelected
  const selectedKeys = useMemo(() => new Set(selectedArray), [selectedArray])

  const commitSelection = useCallback(
    (next: string[]) => {
      if (!isSelectionControlled) setUncontrolledSelected(next)
      onSelectedKeysChange?.(next)
    },
    [isSelectionControlled, onSelectedKeysChange],
  )

  const isSelected = useCallback((id: string) => selectedKeys.has(id), [selectedKeys])

  const toggleRow = useCallback(
    (id: string) => {
      if (selectionMode === "none") return
      if (selectionMode === "single") {
        commitSelection(selectedKeys.has(id) ? [] : [id])
        return
      }
      const next = new Set(selectedKeys)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      commitSelection(Array.from(next))
    },
    [selectionMode, selectedKeys, commitSelection],
  )

  // Selectable rows on the CURRENT PAGE (select-all is current-page scope for v1).
  const pageSelectableIds = useMemo(() => {
    if (selectionMode !== "multiple") return [] as string[]
    const ids: string[] = []
    rows.forEach((row, index) => {
      if (isRowSelectable && !isRowSelectable(row)) return
      ids.push(rowId(row, index))
    })
    return ids
  }, [rows, selectionMode, isRowSelectable, rowId])

  const selectAllState = useMemo<"all" | "some" | "none">(() => {
    if (pageSelectableIds.length === 0) return "none"
    let selectedOnPage = 0
    for (const id of pageSelectableIds) if (selectedKeys.has(id)) selectedOnPage += 1
    if (selectedOnPage === 0) return "none"
    if (selectedOnPage === pageSelectableIds.length) return "all"
    return "some"
  }, [pageSelectableIds, selectedKeys])

  const toggleSelectAll = useCallback(() => {
    if (selectionMode !== "multiple" || pageSelectableIds.length === 0) return
    const next = new Set(selectedKeys)
    if (selectAllState === "all") {
      for (const id of pageSelectableIds) next.delete(id)
    } else {
      for (const id of pageSelectableIds) next.add(id)
    }
    commitSelection(Array.from(next))
  }, [selectionMode, pageSelectableIds, selectedKeys, selectAllState, commitSelection])

  // Total selectable count across the whole data set (footer summary).
  const selectableCount = useMemo(() => {
    if (selectionMode === "none") return 0
    if (!isRowSelectable) return data.length
    return data.reduce((acc, row) => (isRowSelectable(row) ? acc + 1 : acc), 0)
  }, [data, selectionMode, isRowSelectable])

  return {
    rows,
    rowId,
    sort,
    toggleSort,
    sortDirectionFor,
    selectedKeys,
    isSelected,
    toggleRow,
    selectAllState,
    toggleSelectAll,
    activePage,
    pageCount,
    setPage,
    range,
    selectableCount,
  }
}
