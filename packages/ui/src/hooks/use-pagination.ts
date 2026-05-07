// @draft
"use client"

/**
 * @fileoverview Pagination range calculation with controlled/uncontrolled
 * support. Returns the visible range (with `'dots'` ellipsis markers) and
 * navigation helpers. Pairs with the `Pagination` component in `ui`.
 * @author Saasflare™
 * @module packages/ui/hooks/use-pagination
 * @package ui
 *
 * @example
 * const { activePage, range, setPage, next, previous } = usePagination({ total: 20 });
 * // activePage = 10 → range = [1, 'dots', 9, 10, 11, 'dots', 20]
 */
'use client';

import { useCallback, useMemo, useState } from 'react';

/** An item in the pagination range — either a page number or an ellipsis marker */
export type PaginationRangeItem = number | 'dots';

/** Options for usePagination */
export interface UsePaginationOptions {
    /** Total number of pages (1-indexed max). Values below 1 are clamped to 1. */
    total: number;
    /** Initial active page when uncontrolled. Default: `1` */
    initialPage?: number;
    /** Controlled active page. When provided, the hook operates in controlled mode. */
    page?: number;
    /** Number of sibling pages shown on each side of the active page. Default: `1` */
    siblings?: number;
    /** Number of pages shown at the start and end of the range. Default: `1` */
    boundaries?: number;
    /** Callback fired when the active page changes */
    onChange?: (page: number) => void;
}

/** Return value of usePagination */
export interface UsePaginationReturn {
    /** Current active page (1-indexed, always within `[1, total]`) */
    activePage: number;
    /** Visible range with ellipsis markers (e.g. `[1, 'dots', 9, 10, 11, 'dots', 20]`) */
    range: PaginationRangeItem[];
    /** Set the active page (clamped to `[1, total]`) */
    setPage: (page: number) => void;
    /** Advance to the next page (no-op if on last page) */
    next: () => void;
    /** Go to the previous page (no-op if on first page) */
    previous: () => void;
    /** Jump to the first page */
    first: () => void;
    /** Jump to the last page */
    last: () => void;
}

/** Produces an inclusive numeric range: `buildRange(2, 5) === [2, 3, 4, 5]`. */
function buildRange(start: number, end: number): number[] {
    const length = end - start + 1;
    if (length <= 0) return [];
    return Array.from({ length }, (_, i) => start + i);
}

/**
 * Calculates the visible pagination range and provides navigation controls.
 * Works in both controlled and uncontrolled modes.
 *
 * The range algorithm shows the active page with `siblings` neighbours on
 * each side, `boundaries` pages pinned to the start and end, and `'dots'`
 * ellipsis markers filling the gaps.
 *
 * @param {UsePaginationOptions} options - Pagination configuration
 * @returns {UsePaginationReturn} Active page, range, and navigation helpers
 *
 * @example
 * const { activePage, range, setPage } = usePagination({
 *   total: 20,
 *   siblings: 1,
 *   boundaries: 1,
 * });
 * // activePage = 1  → [1, 2, 3, 4, 5, 'dots', 20]
 * // activePage = 10 → [1, 'dots', 9, 10, 11, 'dots', 20]
 * // activePage = 20 → [1, 'dots', 16, 17, 18, 19, 20]
 */
export function usePagination(options: UsePaginationOptions): UsePaginationReturn {
    const { total, initialPage = 1, page: controlledPage, siblings = 1, boundaries = 1, onChange } = options;

    const safeTotal = Math.max(1, Math.floor(total));
    const isControlled = controlledPage !== undefined;
    const [uncontrolledPage, setUncontrolledPage] = useState(() => Math.min(Math.max(1, initialPage), safeTotal));

    const rawPage = isControlled ? controlledPage : uncontrolledPage;
    const activePage = Math.min(Math.max(1, rawPage), safeTotal);

    const setPage = useCallback(
        (next: number) => {
            const clamped = Math.min(Math.max(1, Math.floor(next)), safeTotal);
            if (!isControlled) setUncontrolledPage(clamped);
            onChange?.(clamped);
        },
        [isControlled, onChange, safeTotal],
    );

    const next = useCallback(() => {
        if (activePage < safeTotal) setPage(activePage + 1);
    }, [activePage, safeTotal, setPage]);

    const previous = useCallback(() => {
        if (activePage > 1) setPage(activePage - 1);
    }, [activePage, setPage]);

    const first = useCallback(() => setPage(1), [setPage]);
    const last = useCallback(() => setPage(safeTotal), [setPage, safeTotal]);

    const range = useMemo<PaginationRangeItem[]>(() => {
        // Total slots visible at once:
        //   boundaries on each side + active + 2 × siblings + 2 ellipsis slots
        const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;

        // If the range fits every page, just return the full sequence.
        if (totalPageNumbers >= safeTotal) {
            return buildRange(1, safeTotal);
        }

        const leftSiblingIdx = Math.max(activePage - siblings, boundaries + 2);
        const rightSiblingIdx = Math.min(activePage + siblings, safeTotal - boundaries - 1);

        const showLeftDots = leftSiblingIdx > boundaries + 2;
        const showRightDots = rightSiblingIdx < safeTotal - boundaries - 1;

        const leftBoundary = buildRange(1, boundaries);
        const rightBoundary = buildRange(safeTotal - boundaries + 1, safeTotal);

        if (!showLeftDots && showRightDots) {
            const leftItemCount = boundaries + 1 + siblings * 2 + 1;
            return [...buildRange(1, leftItemCount), 'dots', ...rightBoundary];
        }

        if (showLeftDots && !showRightDots) {
            const rightItemCount = boundaries + 1 + siblings * 2 + 1;
            return [...leftBoundary, 'dots', ...buildRange(safeTotal - rightItemCount + 1, safeTotal)];
        }

        return [...leftBoundary, 'dots', ...buildRange(leftSiblingIdx, rightSiblingIdx), 'dots', ...rightBoundary];
    }, [activePage, safeTotal, siblings, boundaries]);

    return { activePage, range, setPage, next, previous, first, last };
}
