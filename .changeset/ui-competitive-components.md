---
"@saasflare/ui": minor
---

Add data-driven and wizard components plus Button/overlay parity — all additive, no breaking changes.

**New components**

- **`DataTable`** + **`useDataTable`** — dependency-free, typed data grid built on the Table primitives: typed column defs, client-side single/multi-column sort, row selection (current-page select-all), client-side pagination, density, sticky header, loading/empty states, and a documented `manualSort`/`manualPagination` escape hatch for server-side / TanStack. Sort + select + paginate in ~15 LOC with zero extra dependencies.
- **`MultiSelect`** — searchable multi-select (Popover + cmdk) with chips, select-all, `max`, `+N more` collapse, and async option loading via `onSearchChange`. Plain `string[]` value.
- **`Stepper`** + **`useStepper`** (+ `StepperNav` / `StepperPanel` / `StepperContent`) — a controlled multi-step wizard over the existing visual `Steps`: linear / non-linear flow, optional steps, and an async validation gate before advancing. The headless `useStepper` hook composes with the bare `Steps` indicator too.
- **`DataPagination`** + **`paginationSummary`** — total-driven pagination convenience: prev/next, numbered pages with ellipsis, an optional page-size selector, and an "X–Y of N" summary. One component wires a whole table footer.

**API parity additions**

- **`Button`** — new optional `startContent`, `endContent`, `isLoading`, `isIconOnly`, and `spinnerPlacement` props (`StatefulButton` now delegates its loading state to `Button.isLoading`).
- **Overlays** — `DialogContent` gains `showCloseButton` (defaults to current behavior); `PopoverArrow`, `TooltipArrow`, and `HoverCardArrow` sub-components added for the floating overlays.
- `Step` gains an additive optional `optional` prop.
