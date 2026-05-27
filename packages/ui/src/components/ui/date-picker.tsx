// @draft
"use client"

/**
 * @fileoverview Saasflare DatePicker — controlled/uncontrolled single-date
 * input. Sibling to DateRangePicker. Composes the existing Button, Popover,
 * and Calendar (in single mode).
 * @author Saasflare™
 *
 * @module packages/ui/components/ui/date-picker
 * @package ui
 * @layer core
 *
 * @example
 * const [date, setDate] = useState<Date | undefined>();
 * <DatePicker value={date} onChange={setDate} />
 */

import * as React from "react"
import { useState } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

/** Inline calendar glyph — local phosphor barrel doesn't ship one. */
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

/** Props for the DatePicker component. */
export interface DatePickerProps extends SaasflareComponentProps {
    /** Controlled value. */
    value?: Date
    /** Uncontrolled default value. */
    defaultValue?: Date
    /** Called when the user picks a date. */
    onChange?: (date: Date | undefined) => void
    /** Placeholder shown when no date is set. */
    placeholder?: string
    /** Earliest pickable date. */
    minDate?: Date
    /** Latest pickable date. */
    maxDate?: Date
    /** Disable the trigger. */
    disabled?: boolean
    /** Format function for the trigger label. Default: locale-aware. */
    formatDate?: (date: Date) => string
    /** Additional class names on the trigger. */
    className?: string
}

function defaultFormat(d: Date): string {
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

/**
 * Single-date input + popover calendar. Composes Button + Popover + Calendar.
 *
 * @component
 * @layer core
 */
export function DatePicker({
    value,
    defaultValue,
    onChange,
    placeholder = "Pick a date",
    minDate,
    maxDate,
    disabled = false,
    formatDate = defaultFormat,
    className,
    surface,
    radius,
    animated,
    iconWeight,
}: DatePickerProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

    const isControlled = value !== undefined
    const [internal, setInternal] = useState<Date | undefined>(defaultValue)
    const date = isControlled ? value : internal

    const handleSelect = (next: Date | undefined) => {
        if (!isControlled) setInternal(next)
        onChange?.(next)
    }

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
                    data-slot="date-picker-trigger"
                    className={cn(
                        "min-w-44 justify-start gap-2 font-normal",
                        !date && "text-muted-foreground",
                        className,
                    )}
                >
                    <CalendarIcon className="size-4" />
                    <span className="truncate">{date ? formatDate(date) : placeholder}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                data-slot="date-picker-content"
                align="start"
                className="w-auto p-0"
            >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    defaultMonth={date ?? new Date()}
                    disabled={
                        minDate || maxDate
                            ? (d: Date) =>
                                  (minDate ? d < minDate : false) ||
                                  (maxDate ? d > maxDate : false)
                            : undefined
                    }
                />
            </PopoverContent>
        </Popover>
    )
}
