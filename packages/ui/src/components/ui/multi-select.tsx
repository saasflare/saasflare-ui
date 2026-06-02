"use client"

/**
 * @fileoverview Saasflare MultiSelect — searchable, chip-rendering multi-select.
 * @module packages/ui/components/ui/multi-select
 * @package ui
 * @layer core
 *
 * Data-driven (`options` array), self-contained multi-select built on the SAME
 * stack as the single-select Combobox (Radix Popover + cmdk) with zero new
 * runtime dependencies. It owns its own selection / query / open state
 * (controlled OR uncontrolled), so consumers get select-all, max, clearable,
 * and chips out of the box instead of hand-wiring Combobox + Badge + useState
 * (the gap the Combobox JSDoc explicitly calls out as "not built in").
 *
 * Async option loading is supported and DOCUMENTED rather than a new prop
 * surface: pass `loading` + an updated `options` array and debounce your fetch
 * off `onSearchChange`. The presence of `onSearchChange` flips cmdk to
 * `shouldFilter={false}` so the server is the filter; omit it for built-in
 * client-side fuzzy search.
 *
 * Select-all scope: operates on the CURRENTLY-FILTERED, non-disabled options
 * (and respects `max`), toggling between "select all" and "Clear".
 *
 * @example
 * import { MultiSelect, type MultiSelectOption } from "@saasflare/ui"
 *
 * const options: MultiSelectOption[] = [
 *   { value: "react", label: "React" },
 *   { value: "vue", label: "Vue" },
 *   { value: "svelte", label: "Svelte" },
 * ]
 *
 * const [value, setValue] = React.useState<string[]>([])
 * <MultiSelect options={options} value={value} onValueChange={setValue} />
 */

import * as React from "react"
import { AnimatePresence, m } from "motion/react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { spring, useSaasflareMotion } from "./motion-config"
import { CaretDownIcon, CheckIcon, CircleNotchIcon, MagnifyingGlassIcon, XIcon } from "./phosphor"
import { Badge } from "./badge"

// React-style dev warnings: the consumer's bundler replaces process.env.NODE_ENV.
declare const process: { readonly env: { readonly NODE_ENV?: string } }

/**
 * Motion-wrapped chip span for the AnimatePresence enter/exit path. MUST be
 * defined at module top level — defining it inside the component creates a fresh
 * component identity per render and breaks React reconciliation (button.tsx
 * MotionSlot rule).
 */
const MotionChip = m.create("span")

/** A selectable option in {@link MultiSelect}. */
export interface MultiSelectOption {
  /** Stable unique key + the value stored in `value[]`. */
  value: string
  /** Visible label (also the chip text + the search match target). */
  label: string
  /** Optional group heading; options sharing a `group` render under one cmdk group. */
  group?: string
  /** Disable selecting/deselecting this option. */
  disabled?: boolean
  /** Optional leading node (icon/avatar) rendered in the list row. */
  icon?: React.ReactNode
}

/** Motion/HTML event keys that collide with React's — stripped from the root div. */
type MultiSelectDomConflicts =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onChange"
  | "value"
  | "defaultValue"

/** Props for {@link MultiSelect}. Extends the 4-axis Saasflare contract. */
export interface MultiSelectProps
  extends Omit<React.ComponentProps<"div">, MultiSelectDomConflicts | keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Options to choose from. Update this array (+ `loading`) for async loading. */
  options: MultiSelectOption[]
  /** Controlled selected values (array of `option.value`). */
  value?: string[]
  /** Uncontrolled initial selection. @default [] */
  defaultValue?: string[]
  /** Fires on every selection change with the next value array. */
  onValueChange?: (value: string[]) => void
  /** Trigger placeholder when nothing is selected. @default "Select…" */
  placeholder?: string
  /** Search input placeholder. @default "Search…" */
  searchPlaceholder?: string
  /** Node shown when the query matches no option. @default "No results." */
  emptyMessage?: React.ReactNode
  /** Max number of selectable values. Over-limit options become non-interactive (data-disabled) and a "Max N selected" hint shows. */
  max?: number
  /** Show a clear-all (×) affordance on the trigger when selection is non-empty. @default true */
  clearable?: boolean
  /** Show a "Select all / Clear" header row (operates on the CURRENTLY FILTERED, non-disabled options). @default false */
  selectAll?: boolean
  /** Label for the select-all row. @default "Select all" */
  selectAllLabel?: string
  /** Keep the popover open after a selection (true) or close on each pick (false). @default true for multi */
  closeOnSelect?: boolean
  /** Max chip ROWS shown collapsed on the trigger before overflowing to "+N more" (HeroUI isMultiline analog). @default 1 */
  maxRows?: number
  /** Async: render a spinner row + aria-busy; pair with `onSearchChange` for server filtering. @default false */
  loading?: boolean
  /** Controlled search query (optional). */
  searchValue?: string
  /** Fires on query change. PRESENCE of this prop flips cmdk to `shouldFilter={false}` (server-side filtering); omit it for built-in client fuzzy search. */
  onSearchChange?: (query: string) => void
  /** Disable the whole control. */
  disabled?: boolean
  /** Forwarded to the cmdk list for ARIA. */
  "aria-label"?: string
  /** className on the trigger button (root data-axes div wraps it). */
  className?: string
  /** className on the popover content. */
  contentClassName?: string
}

/**
 * Approximate the number of chips that fit in `maxRows` rows before collapsing
 * to a "+N more" badge. Pragmatic v1 heuristic: ~3 chips per row (no pixel
 * measuring). Documented so behaviour is predictable rather than fragile.
 */
const CHIPS_PER_ROW = 3

/**
 * Searchable, chip-rendering multi-select on Radix Popover + cmdk.
 *
 * Resolves the four orthogonal axes (`surface` / `radius` / `animated` /
 * `iconWeight`) via {@link useSaasflareProps} and emits `data-surface` /
 * `data-radius` / `data-animated` on the root; the axes are forwarded to the
 * PORTALLED popover content so `surface="glass"` theming carries into the
 * dropdown.
 *
 * Selection is controlled via `value` or uncontrolled via `defaultValue`
 * (identical guard to tag-input). `onValueChange` always fires with the next
 * array. Select-all is CURRENT-FILTER scope and respects `max`.
 *
 * @component
 * @layer core
 *
 * @param {MultiSelectOption[]} options - Options to choose from.
 * @param {string[]} value - Controlled selected values.
 * @param {string[]} defaultValue - Uncontrolled initial selection.
 * @param {(value: string[]) => void} onValueChange - Fires on every selection change.
 * @param {number} max - Max selectable values; over-limit options become non-interactive.
 * @param {boolean} selectAll - Show a select-all / clear header row.
 * @param {boolean} loading - Async spinner row + aria-busy.
 * @param {(query: string) => void} onSearchChange - Lifts the query AND flips cmdk to server-side filtering.
 * @param {string} surface - Surface style override (inherits from provider when omitted).
 * @param {string} radius - Radius preset override (inherits from provider when omitted).
 * @param {string} iconWeight - Phosphor icon weight override (inherits from provider when omitted).
 * @param {boolean} animated - Gate motion effects (inherits from provider when omitted).
 *
 * @example
 * // Controlled multi-select with chips + search
 * const [value, setValue] = React.useState<string[]>(["react"])
 * <MultiSelect
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *   ]}
 *   value={value}
 *   onValueChange={setValue}
 * />
 *
 * @example
 * // Select-all header + max limit + collapse to "+N more"
 * <MultiSelect options={options} selectAll max={3} maxRows={1} />
 *
 * @example
 * // Async server filtering: presence of onSearchChange disables client filter
 * <MultiSelect
 *   options={remoteOptions}
 *   loading={isFetching}
 *   onSearchChange={(q) => debouncedFetch(q)}
 * />
 */
export function MultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results.",
  max,
  clearable = true,
  selectAll = false,
  selectAllLabel = "Select all",
  closeOnSelect = true,
  maxRows = 1,
  loading = false,
  searchValue,
  onSearchChange,
  disabled = false,
  surface,
  radius,
  animated,
  iconWeight,
  className,
  contentClassName,
  "aria-label": ariaLabel,
  ...props
}: MultiSelectProps): React.ReactElement {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, spring)

  /* ── Controlled / uncontrolled selection split (tag-input pattern) ── */
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
  const selected = isControlled ? (value as string[]) : internal

  /* ── Query is internal but lift-able via searchValue / onSearchChange ── */
  const isQueryControlled = searchValue !== undefined
  const [internalQuery, setInternalQuery] = React.useState("")
  const query = isQueryControlled ? (searchValue as string) : internalQuery

  /* ── open state is always internal ── */
  const [open, setOpen] = React.useState(false)

  // Presence of onSearchChange means the parent owns filtering (server-side).
  const serverFiltered = onSearchChange !== undefined

  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const listId = React.useId()
  const liveId = React.useId()

  /* ── Fast lookup: value -> option (for chip labels + stale-key fallback) ── */
  const optionByValue = React.useMemo(() => {
    const map = new Map<string, MultiSelectOption>()
    for (const opt of options) map.set(opt.value, opt)
    return map
  }, [options])

  const atMax = typeof max === "number" && selected.length >= max

  const commit = React.useCallback(
    (next: string[]) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  const setQuery = React.useCallback(
    (next: string) => {
      if (!isQueryControlled) setInternalQuery(next)
      onSearchChange?.(next)
    },
    [isQueryControlled, onSearchChange],
  )

  /* ── Toggle: remove if present, else add unless max reached (no-op) ── */
  const toggle = React.useCallback(
    (val: string) => {
      const opt = optionByValue.get(val)
      if (opt?.disabled) return
      if (selected.includes(val)) {
        commit(selected.filter((v) => v !== val))
      } else {
        if (typeof max === "number" && selected.length >= max) return
        commit([...selected, val])
      }
      if (!closeOnSelect) setOpen(false)
    },
    [optionByValue, selected, commit, max, closeOnSelect],
  )

  const removeValue = React.useCallback(
    (val: string) => {
      commit(selected.filter((v) => v !== val))
    },
    [commit, selected],
  )

  const clearAll = React.useCallback(() => {
    commit([])
  }, [commit])

  /* ── Currently visible (filtered) options, for select-all scope. When the
   * parent owns filtering, `options` is already the filtered set; otherwise
   * apply the same case-insensitive label substring cmdk uses for the heading
   * scope. cmdk still drives the actual list rendering + keyboard nav. ── */
  const filteredOptions = React.useMemo(() => {
    if (serverFiltered || query.trim() === "") return options
    const q = query.trim().toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [serverFiltered, query, options])

  // Non-disabled subset of the filtered options drives select-all behaviour.
  const selectableFiltered = React.useMemo(
    () => filteredOptions.filter((o) => !o.disabled),
    [filteredOptions],
  )

  const allFilteredSelected =
    selectableFiltered.length > 0 &&
    selectableFiltered.every((o) => selected.includes(o.value))

  const handleSelectAll = React.useCallback(() => {
    if (allFilteredSelected) {
      // Clear only the filtered, selectable values (leave others intact).
      const filteredVals = new Set(selectableFiltered.map((o) => o.value))
      commit(selected.filter((v) => !filteredVals.has(v)))
      return
    }
    // Add filtered selectable values up to `max`, preserving existing order.
    const next = [...selected]
    const present = new Set(selected)
    for (const o of selectableFiltered) {
      if (typeof max === "number" && next.length >= max) break
      if (!present.has(o.value)) {
        next.push(o.value)
        present.add(o.value)
      }
    }
    commit(next)
  }, [allFilteredSelected, selectableFiltered, selected, commit, max])

  /* ── Dev guidance: max should be ≥ 1 to be meaningful ── */
  if (process.env.NODE_ENV !== "production") {
    if (typeof max === "number" && max < 1) {
      console.warn(
        "[Saasflare][MultiSelect] `max` should be a positive integer; values below 1 disable all selection.",
      )
    }
  }

  /* ── Group options by `group` for cmdk groups, preserving first-seen order. ── */
  const groups = React.useMemo(() => {
    const order: (string | undefined)[] = []
    const byGroup = new Map<string | undefined, MultiSelectOption[]>()
    for (const opt of options) {
      if (!byGroup.has(opt.group)) {
        byGroup.set(opt.group, [])
        order.push(opt.group)
      }
      byGroup.get(opt.group)!.push(opt)
    }
    return order.map((g) => ({ group: g, items: byGroup.get(g)! }))
  }, [options])

  /* ── Trigger Backspace removes the last chip only when there is a selection.
   * (The search input has its own empty-query guard below.) ── */
  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpen(true)
    }
  }

  /* ── Backspace in the EMPTY search input removes the last chip (tag-input
   * parity). Must NOT fire mid-query. ── */
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && query === "" && selected.length > 0) {
      e.preventDefault()
      removeValue(selected[selected.length - 1])
    }
  }

  /* ── Collapse chips to "+N more" past the maxRows-derived threshold. ── */
  const visibleCount = Math.max(1, maxRows) * CHIPS_PER_ROW
  const overflowCount = selected.length > visibleCount ? selected.length - visibleCount : 0
  const visibleSelected = overflowCount > 0 ? selected.slice(0, visibleCount) : selected

  const hasSelection = selected.length > 0
  const showClear = clearable && hasSelection && !disabled

  return (
    <div
      data-slot="multi-select"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      data-disabled={String(disabled)}
      className={cn("w-full", className)}
      {...props}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={ariaLabel}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            data-slot="multi-select-trigger"
            onKeyDown={onTriggerKeyDown}
            className={cn(
              "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none",
              "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
            )}
            data-disabled={String(disabled)}
          >
            {!hasSelection ? (
              <span className="px-1 text-muted-foreground">{placeholder}</span>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {visibleSelected.map((val) => {
                  const opt = optionByValue.get(val)
                  // Stale-value fallback: show the raw key, don't drop the chip.
                  const label = opt?.label ?? val
                  return (
                    <MotionChip
                      key={val}
                      layout={motion.disabled ? false : true}
                      initial={motion.disabled ? false : { opacity: 0, scale: 0.85 }}
                      animate={motion.disabled ? false : { opacity: 1, scale: 1 }}
                      exit={motion.disabled ? undefined : { opacity: 0, scale: 0.85 }}
                      transition={motion.transition}
                      className="inline-flex"
                    >
                      <Badge
                        variant="soft"
                        intent="neutral"
                        animated={false}
                        data-slot="multi-select-chip"
                        className="gap-1 pr-1"
                      >
                        <span className="max-w-[12rem] truncate">{label}</span>
                        <span
                          role="button"
                          tabIndex={disabled ? -1 : 0}
                          aria-label={`Remove ${label}`}
                          data-slot="multi-select-chip-remove"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!disabled) removeValue(val)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              e.stopPropagation()
                              if (!disabled) removeValue(val)
                            }
                          }}
                          className="inline-flex size-3.5 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-ring/50"
                        >
                          <XIcon weight={sf.iconWeight} aria-hidden="true" className="size-2.5" />
                        </span>
                      </Badge>
                    </MotionChip>
                  )
                })}
                {overflowCount > 0 ? (
                  <span key="__overflow" className="inline-flex">
                    <Badge variant="soft" intent="neutral" animated={false} data-slot="multi-select-overflow">
                      {`+${overflowCount} more`}
                    </Badge>
                  </span>
                ) : null}
              </AnimatePresence>
            )}

            <span className="ml-auto flex shrink-0 items-center gap-1 pl-1">
              {showClear ? (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Clear all"
                  data-slot="multi-select-clear"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearAll()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      e.stopPropagation()
                      clearAll()
                    }
                  }}
                  className="inline-flex size-4 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-ring/50"
                >
                  <XIcon weight={sf.iconWeight} aria-hidden="true" className="size-3.5" />
                </span>
              ) : null}
              <CaretDownIcon
                weight={sf.iconWeight}
                aria-hidden="true"
                className="size-4 shrink-0 opacity-50"
              />
            </span>
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            data-slot="multi-select-content"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            align="start"
            sideOffset={6}
            onOpenAutoFocus={(e) => {
              // Keep focus inside the popover (cmdk auto-focuses its input).
              e.preventDefault()
            }}
            className={cn(
              "z-50 w-[var(--radix-popover-trigger-width)] min-w-[12rem] origin-[var(--radix-popover-content-transform-origin)] overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              contentClassName,
            )}
          >
            <CommandPrimitive
              data-slot="multi-select-command"
              shouldFilter={!serverFiltered}
              loop
              className="flex w-full flex-col"
            >
              <div
                data-slot="multi-select-input-wrapper"
                className="flex h-9 items-center gap-2 border-b px-3"
              >
                <MagnifyingGlassIcon
                  weight={sf.iconWeight}
                  className="size-4 shrink-0 opacity-50"
                />
                <CommandPrimitive.Input
                  data-slot="multi-select-input"
                  value={query}
                  onValueChange={setQuery}
                  onKeyDown={onSearchKeyDown}
                  placeholder={searchPlaceholder}
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {atMax ? (
                <div
                  data-slot="multi-select-max-hint"
                  className="border-b px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {`Max ${max} selected`}
                </div>
              ) : null}

              <CommandPrimitive.List
                id={listId}
                role="listbox"
                aria-multiselectable="true"
                aria-busy={loading || undefined}
                aria-label={ariaLabel}
                data-slot="multi-select-list"
                className="max-h-[min(24rem,var(--radix-popover-content-available-height))] scroll-py-1 overflow-x-hidden overflow-y-auto p-1"
              >
                {loading ? (
                  <div
                    data-slot="multi-select-loading"
                    className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"
                  >
                    <CircleNotchIcon
                      weight="regular"
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                    <span>Loading…</span>
                  </div>
                ) : (
                  <>
                    <CommandPrimitive.Empty
                      data-slot="multi-select-empty"
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      {emptyMessage}
                    </CommandPrimitive.Empty>

                    {selectAll && selectableFiltered.length > 0 ? (
                      <CommandPrimitive.Item
                        data-slot="multi-select-select-all"
                        value="__select_all__"
                        onSelect={handleSelectAll}
                        className="relative flex w-full cursor-default items-center gap-2 rounded-sm border-b py-1.5 pr-8 pl-2 text-sm font-medium outline-hidden select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                      >
                        {allFilteredSelected ? "Clear" : selectAllLabel}
                        {allFilteredSelected ? (
                          <CheckIcon weight={sf.iconWeight} className="absolute right-2 size-4" />
                        ) : null}
                      </CommandPrimitive.Item>
                    ) : null}

                    {groups.map(({ group, items }) => {
                      const rows = items.map((opt) => {
                        const isSelected = selected.includes(opt.value)
                        // Over-limit unselected options are non-interactive.
                        const overLimit = !isSelected && atMax
                        const itemDisabled = opt.disabled === true || overLimit
                        return (
                          <CommandPrimitive.Item
                            key={opt.value}
                            data-slot="multi-select-item"
                            value={opt.value}
                            keywords={[opt.label]}
                            disabled={itemDisabled}
                            data-checked={isSelected ? "true" : undefined}
                            onSelect={() => toggle(opt.value)}
                            className="relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                          >
                            {opt.icon ? <span className="shrink-0">{opt.icon}</span> : null}
                            <span className="truncate">{opt.label}</span>
                            {isSelected ? (
                              <CheckIcon
                                weight={sf.iconWeight}
                                data-slot="multi-select-item-indicator"
                                className="absolute right-2 size-4"
                              />
                            ) : null}
                          </CommandPrimitive.Item>
                        )
                      })

                      if (group === undefined) return <React.Fragment key="__ungrouped__">{rows}</React.Fragment>

                      return (
                        <CommandPrimitive.Group
                          key={group}
                          heading={group}
                          data-slot="multi-select-group"
                          className="overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                        >
                          {rows}
                        </CommandPrimitive.Group>
                      )
                    })}
                  </>
                )}
              </CommandPrimitive.List>
            </CommandPrimitive>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {/* Visually-hidden live region announcing the selection count. */}
      <span
        id={liveId}
        aria-live="polite"
        className="sr-only"
      >
        {`${selected.length} selected`}
      </span>
    </div>
  )
}
