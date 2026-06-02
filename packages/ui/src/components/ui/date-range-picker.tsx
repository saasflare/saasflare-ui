// @draft
"use client"

/**
 * @fileoverview Saasflare DateRangePicker — controlled/uncontrolled date-range
 * input. Composes the existing Button, Popover, and Calendar (in range mode).
 * @author Saasflare™
 *
 * Drops into form contexts as a trigger button that opens a popover with a
 * two-month range calendar. Emits `{ from, to }` via `onChange`. Built
 * exclusively from existing Saasflare primitives — no new third-party deps
 * (Calendar already wraps react-day-picker).
 *
 * @module packages/ui/components/ui/date-range-picker
 * @package ui
 * @layer core
 *
 * @example
 * const [range, setRange] = useState<DateRange | undefined>();
 * <DateRangePicker value={range} onChange={setRange} />
 */

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

/** Inline calendar glyph — the local phosphor barrel doesn't ship a
 * Calendar icon, and adding one for a single use isn't worth the surface. */
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}

/** Inclusive date range, identical shape to react-day-picker's `DateRange`. */
export interface DateRange {
    from: Date | undefined
    to?: Date | undefined
}

/** Props for the DateRangePicker component. */
export interface DateRangePickerProps extends SaasflareComponentProps {
    /** Controlled value. */
    value?: DateRange
    /** Uncontrolled default value. */
    defaultValue?: DateRange
    /** Called when the user picks a new range. */
    onChange?: (range: DateRange | undefined) => void
    /** Placeholder shown in the trigger when no range is set. */
    placeholder?: string
    /** Number of months shown side-by-side. Default: `2`. */
    numberOfMonths?: number
    /** Earliest pickable date. */
    minDate?: Date
    /** Latest pickable date. */
    maxDate?: Date
    /** Disable the trigger. */
    disabled?: boolean
    /** Format function for the trigger label. Default: locale-aware `toLocaleDateString`. */
    formatRange?: (range: DateRange) => string
    /** Additional class names on the trigger. */
    className?: string
}

function defaultFormat(range: DateRange): string {
    const fmt = (d: Date) =>
        d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    if (!range.from) return ""
    if (!range.to) return fmt(range.from)
    return `${fmt(range.from)} – ${fmt(range.to)}`
}

/**
 * Date-range input + popover calendar. Composes Button + Popover + Calendar.
 *
 * @component
 * @layer core
 */
export function DateRangePicker({
    value,
    defaultValue,
    onChange,
    placeholder = "Pick a date range",
    numberOfMonths = 2,
    minDate,
    maxDate,
    disabled = false,
    formatRange = defaultFormat,
    className,
    surface,
    radius,
    animated,
    iconWeight,
}: DateRangePickerProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

    const isControlled = value !== undefined
    const [internal, setInternal] = React.useState<DateRange | undefined>(defaultValue)
    const range = isControlled ? value : internal

    const handleSelect = (next: DateRange | undefined) => {
        if (!isControlled) setInternal(next)
        onChange?.(next)
    }

    const label = range && range.from ? formatRange(range) : placeholder

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    intent="neutral"
                    disabled={disabled}
                    surface={sf.surface}
                    radius={sf.radius}
                    animated={sf.animated}
                    data-slot="date-range-picker-trigger"
                    className={cn(
                        "min-w-56 justify-start gap-2 font-normal",
                        !range?.from && "text-muted-foreground",
                        className,
                    )}
                >
                    <CalendarIcon className="size-4" />
                    <span className="truncate">{label}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                data-slot="date-range-picker-content"
                align="start"
                className="w-auto p-0"
            >
                <Calendar
                    mode="range"
                    selected={range}
                    onSelect={handleSelect}
                    numberOfMonths={numberOfMonths}
                    defaultMonth={range?.from ?? new Date()}
                    iconWeight={sf.iconWeight}
                    disabled={
                        minDate || maxDate
                            ? (date: Date) =>
                                  (minDate ? date < minDate : false) ||
                                  (maxDate ? date > maxDate : false)
                            : undefined
                    }
                />
            </PopoverContent>
        </Popover>
    )
}
