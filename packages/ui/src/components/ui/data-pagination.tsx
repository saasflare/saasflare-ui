// @toreview
"use client"

/**
 * @fileoverview DataPagination — a total-driven, batteries-included pagination
 * control. A fully additive sibling to the `Pagination` compound (NOT a rename
 * or overload of it): give it `total` + `pageSize` (or a precomputed
 * `pageCount`) and it renders prev/next controls, numbered page links with
 * ellipsis truncation, an optional page-size `<select>`, and an optional
 * "X–Y of N" summary in a single prop call.
 *
 * It is built ENTIRELY on existing primitives — it composes the `Pagination*`
 * parts and drives them with the {@link usePagination} hook (zero new range /
 * ellipsis logic, zero new runtime deps). Use the `Pagination` compound when you
 * need full hand-wired control; reach for `DataPagination` for the common
 * total-driven case (e.g. a table footer).
 *
 * @module packages/ui/components/ui/data-pagination
 * @layer core
 *
 * @component
 * @example
 * import { DataPagination } from '@saasflare/ui';
 * <DataPagination total={248} pageSize={20} showSummary onPageChange={fetchPage} />
 */

import * as React from "react"

import { cn } from "../../lib"
import {
  useSaasflareProps,
  type SaasflareComponentProps,
} from "../../providers"
import {
  usePagination,
  paginationSummary,
  type PaginationSummaryRange,
} from "../../hooks/use-pagination"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./pagination"
import { NativeSelect, NativeSelectOption } from "./native-select"

// React-style dev warnings: the consumer's bundler replaces process.env.NODE_ENV.
declare const process: { readonly env: { readonly NODE_ENV?: string } }

/**
 * Where the page-size selector + range summary sit relative to the page numbers.
 *
 * - `"split"` — summary on the leading edge, numbers centred, size selector on
 *   the trailing edge (the canonical table-footer layout).
 * - `"center"` — everything grouped and centred.
 * - `"end"` — everything grouped on the trailing edge.
 *
 * @example
 * <DataPagination total={248} pageSize={20} layout="end" />
 */
export type DataPaginationLayout = "split" | "center" | "end"

/** Size token for the number links + controls. */
type DataPaginationSize = "xs" | "sm" | "md" | "lg"

/** Maps the public {@link DataPaginationSize} onto the square icon size used for number links. */
const NUMBER_SIZE: Record<DataPaginationSize, "icon-xs" | "icon-sm" | "icon" | "icon-lg"> = {
  xs: "icon-xs",
  sm: "icon-sm",
  md: "icon",
  lg: "icon-lg",
} as const

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

/** i18n / label overrides for {@link DataPagination}. */
export interface DataPaginationLabels {
  /** Accessible label for the "previous" control. Default: `"Previous"`. */
  previous?: string
  /** Accessible label for the "next" control. Default: `"Next"`. */
  next?: string
  /** Builder for the summary string. Receives `{ from, to, total }`. Default: `({ from, to, total }) => `${from}–${to} of ${total}``. */
  summary?: (range: PaginationSummaryRange) => string
  /** Builder for the per-number aria-label. Default: `(p) => `Go to page ${p}``. */
  page?: (page: number) => string
  /** Label/prefix for the page-size select. Default: `"Rows per page"`. */
  pageSize?: string
}

/**
 * Props for {@link DataPagination} — a total-driven, batteries-included
 * pagination control. Mutually-exclusive total inputs: provide EITHER `total`
 * (item count, with `pageSize`) OR `pageCount` (precomputed page count).
 * `pageCount` wins if both are given.
 */
export interface DataPaginationProps
  extends Omit<React.ComponentProps<"nav">, "onChange" | keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Total number of ITEMS across all pages. Used with `pageSize` to derive page count + the "X–Y of N" summary. Ignored if `pageCount` is set. */
  total?: number
  /** Precomputed total number of PAGES. Use when the backend returns a page count directly (no item total). Takes precedence over `total`/`pageSize`. */
  pageCount?: number
  /** Items per page. Required when using `total`; drives summary math + page-count derivation. Default: `10`. */
  pageSize?: number
  /** Controlled active page (1-indexed). When provided, the component is controlled and you MUST update it from `onPageChange`. */
  page?: number
  /** Initial page for uncontrolled mode. Default: `1`. Ignored when `page` is provided. */
  defaultPage?: number
  /** Fired with the next 1-indexed page when the user navigates. Always clamped to `[1, derivedPageCount]`. */
  onPageChange?: (page: number) => void
  /** Sibling pages shown each side of the active page (forwarded to {@link usePagination}). Default: `1`. */
  siblings?: number
  /** Boundary pages pinned at each end (forwarded to {@link usePagination}). Default: `1`. */
  boundaries?: number
  /** Show the prev/next caret controls. Default: `true`. */
  showControls?: boolean
  /** Show numbered page links + ellipsis. When `false`, renders only controls + summary (compact mode). Default: `true`. */
  showNumbers?: boolean
  /** Render the "X–Y of N" summary text. Auto-disabled (with a dev warning) when neither `total` nor an item count is known. Default: `false`. */
  showSummary?: boolean
  /** Render a page-size `<select>` built on {@link NativeSelect}. Requires `onPageSizeChange`. Default: `false`. */
  showPageSize?: boolean
  /** Selectable page sizes for the size selector. Default: `[10, 20, 50, 100]`. */
  pageSizeOptions?: readonly number[]
  /**
   * Fired with the chosen page size. The component does NOT internally manage
   * `pageSize` (controlled-only) — keeps a single source of truth with the
   * consumer. Changing `pageSize` does NOT auto-correct the active page when it
   * exceeds the new page count; reset the page yourself (e.g. `setPage(1)`).
   */
  onPageSizeChange?: (pageSize: number) => void
  /** Visual placement of summary/size-selector vs the page numbers. Default: `"split"` (summary left, numbers center, size right). */
  layout?: DataPaginationLayout
  /** Button-variant size token for prev/next + number links (forwarded to PaginationLink). Default: `"md"` (icon-square numbers + `md` controls). */
  size?: DataPaginationSize
  /** Accessible label for the nav landmark. Default: `"pagination"`. */
  "aria-label"?: string
  /** i18n / label overrides. */
  labels?: DataPaginationLabels
}

/** Default summary string builder: `"1–20 of 248"`. */
function defaultSummary(range: PaginationSummaryRange): string {
  return `${range.from}–${range.to} of ${range.total}`
}

/** Default per-number aria-label builder. */
function defaultPageLabel(page: number): string {
  return `Go to page ${page}`
}

/**
 * Total-driven pagination control. Composes the existing `Pagination` compound
 * + the {@link usePagination} hook into a single semantic component with an
 * optional page-size selector and "X–Y of N" summary. Controlled or
 * uncontrolled. Inherits the `surface`/`radius`/`animated`/`iconWeight` axes
 * from {@link SaasflareShell} and forwards them into the compound parts so the
 * whole control is visually coherent.
 *
 * For full, hand-wired control over each link, use the lower-level `Pagination`
 * compound directly.
 *
 * @component
 * @layer core
 *
 * @example
 * // Uncontrolled, total-driven
 * <DataPagination total={248} pageSize={20} showSummary onPageChange={fetchPage} />
 *
 * @example
 * // Controlled with page-size selector (table footer)
 * <DataPagination
 *   total={count} pageSize={size} page={page}
 *   showSummary showPageSize pageSizeOptions={[10, 25, 50]}
 *   onPageChange={setPage} onPageSizeChange={(s) => { setSize(s); setPage(1) }}
 * />
 *
 * @example
 * // Compact: controls + summary only, no numbers
 * <DataPagination pageCount={9} page={p} showNumbers={false} showSummary onPageChange={setP} />
 */
export function DataPagination({
  total,
  pageCount,
  pageSize = 10,
  page,
  defaultPage = 1,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  showControls = true,
  showNumbers = true,
  showSummary = false,
  showPageSize = false,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
  layout = "split",
  size = "md",
  className,
  surface,
  radius,
  animated,
  iconWeight,
  labels,
  "aria-label": ariaLabel = "pagination",
  ...props
}: DataPaginationProps): React.JSX.Element {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const sizeSelectId = React.useId()

  // Whether we actually know an item total (needed for the summary). Only the
  // `total` input carries item-level information; `pageCount` is page-level only.
  const hasItemTotal = pageCount == null && total != null

  // Derived page count (pure): pageCount wins; otherwise ceil(items / pageSize).
  const safePageSize = Math.max(1, Math.floor(pageSize))
  const derivedPageCount =
    pageCount != null
      ? Math.max(1, Math.floor(pageCount))
      : Math.max(1, Math.ceil(Math.max(0, total ?? 0) / safePageSize))

  const { activePage, range, setPage, next, previous } = usePagination({
    total: derivedPageCount,
    page,
    initialPage: defaultPage,
    siblings,
    boundaries,
    onChange: onPageChange,
  })

  const isFirst = activePage <= 1
  const isLast = activePage >= derivedPageCount

  // ---- dev-only warnings (additive, no runtime cost in production) ----------
  if (process.env.NODE_ENV !== "production") {
    if (showSummary && !hasItemTotal) {
      warnOnce(
        "data-pagination-summary-no-total",
        "<DataPagination showSummary /> needs an item `total` to render the \"X–Y of N\" range. " +
          "Only `pageCount` was provided (page-level), so the summary is hidden. " +
          "Pass `total` + `pageSize` to enable it.",
      )
    }
    if (showPageSize && !onPageSizeChange) {
      warnOnce(
        "data-pagination-pagesize-no-handler",
        "<DataPagination showPageSize /> requires `onPageSizeChange` — `pageSize` is controlled-only, " +
          "so the size selector is inert without it.",
      )
    }
  }

  const resolvedShowSummary = showSummary && hasItemTotal
  const summaryRange = resolvedShowSummary
    ? paginationSummary(activePage, safePageSize, total ?? 0)
    : null
  const summaryText = summaryRange
    ? (labels?.summary ?? defaultSummary)(summaryRange)
    : null

  const pageLabel = labels?.page ?? defaultPageLabel
  const previousLabel = labels?.previous ?? "Previous"
  const nextLabel = labels?.next ?? "Next"
  const pageSizeLabel = labels?.pageSize ?? "Rows per page"

  const handleNumberClick = (event: React.MouseEvent<HTMLAnchorElement>, n: number): void => {
    event.preventDefault()
    setPage(n)
  }

  const handlePrevious = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault()
    if (!isFirst) previous()
  }

  const handleNext = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault()
    if (!isLast) next()
  }

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onPageSizeChange?.(Number(event.target.value))
  }

  const numberSize = NUMBER_SIZE[size]
  const disabledLinkClass = "pointer-events-none opacity-50"

  // ---- the inner Pagination <nav> (owns role=navigation + the axis attrs) ---
  const nav = (
    <Pagination
      className={cn("mx-0 w-auto", className)}
      aria-label={ariaLabel}
      surface={sf.surface}
      radius={sf.radius}
      animated={sf.animated}
      iconWeight={sf.iconWeight}
      {...props}
    >
      <PaginationContent>
        {showControls ? (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-label={previousLabel}
              aria-disabled={isFirst || undefined}
              data-disabled={isFirst || undefined}
              tabIndex={isFirst ? -1 : undefined}
              className={cn(isFirst && disabledLinkClass)}
              surface={sf.surface}
              radius={sf.radius}
              iconWeight={sf.iconWeight}
              onClick={handlePrevious}
            >
              <span className="hidden sm:block">{previousLabel}</span>
            </PaginationPrevious>
          </PaginationItem>
        ) : null}

        {showNumbers
          ? range.map((item, index) =>
              item === "dots" ? (
                <PaginationItem key={`dots-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    size={numberSize}
                    isActive={item === activePage}
                    aria-label={pageLabel(item)}
                    surface={sf.surface}
                    radius={sf.radius}
                    iconWeight={sf.iconWeight}
                    onClick={(event) => handleNumberClick(event, item)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )
          : null}

        {showControls ? (
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-label={nextLabel}
              aria-disabled={isLast || undefined}
              data-disabled={isLast || undefined}
              tabIndex={isLast ? -1 : undefined}
              className={cn(isLast && disabledLinkClass)}
              surface={sf.surface}
              radius={sf.radius}
              iconWeight={sf.iconWeight}
              onClick={handleNext}
            >
              <span className="hidden sm:block">{nextLabel}</span>
            </PaginationNext>
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  )

  // ---- summary + size selector (presentational siblings, no nav semantics) --
  const summaryNode = summaryText ? (
    <p
      data-slot="data-pagination-summary"
      aria-live="polite"
      className="text-sm text-muted-foreground"
    >
      {summaryText}
    </p>
  ) : null

  const sizeNode = showPageSize ? (
    <div data-slot="data-pagination-page-size" className="flex items-center gap-2">
      <label htmlFor={sizeSelectId} className="text-sm whitespace-nowrap text-muted-foreground">
        {pageSizeLabel}
      </label>
      <NativeSelect
        id={sizeSelectId}
        size="sm"
        value={String(safePageSize)}
        disabled={!onPageSizeChange}
        aria-label={pageSizeLabel}
        surface={sf.surface}
        radius={sf.radius}
        iconWeight={sf.iconWeight}
        onChange={handlePageSizeChange}
      >
        {pageSizeOptions.map((option) => (
          <NativeSelectOption key={option} value={String(option)}>
            {option}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  ) : null

  // If there are no surrounding pieces, the nav stands alone (still semantic).
  if (!summaryNode && !sizeNode) return nav

  const layoutClass =
    layout === "split"
      ? "justify-between"
      : layout === "end"
        ? "justify-end"
        : "justify-center"

  return (
    <div
      data-slot="data-pagination"
      data-layout={layout}
      className={cn("flex w-full flex-wrap items-center gap-4", layoutClass)}
    >
      {layout === "split" ? (
        <>
          {summaryNode ?? <span aria-hidden className="hidden sm:block" />}
          {nav}
          {sizeNode ?? <span aria-hidden className="hidden sm:block" />}
        </>
      ) : (
        <>
          {summaryNode}
          {nav}
          {sizeNode}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// dev-only one-shot warning registry (module-scoped; stripped to a no-op in
// production by the NODE_ENV guard at the call sites above)
// ---------------------------------------------------------------------------
const warnedKeys = new Set<string>()

/** Logs `message` to `console.warn` at most once per `key` (dev only). */
function warnOnce(key: string, message: string): void {
  if (warnedKeys.has(key)) return
  warnedKeys.add(key)
  // eslint-disable-next-line no-console
  console.warn(message)
}
