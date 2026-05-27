// @draft
"use client"

/**
 * @fileoverview Saasflare NumberInput — numeric input with stepper buttons.
 * @author Saasflare™
 *
 * Wraps a native `<input type="number">` with +/- steppers, min/max
 * clamping, and configurable step. Honours `disabled` and `readOnly`.
 * Designed to drop into Form contexts unchanged.
 *
 * @module packages/ui/components/ui/number-input
 * @package ui
 * @layer core
 *
 * @example
 * const [n, setN] = useState(1);
 * <NumberInput value={n} onChange={setN} min={0} max={10} step={1} />
 */

import {
    useCallback,
    useState,
    type ChangeEvent,
    type FocusEvent,
} from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the NumberInput component. */
export interface NumberInputProps extends SaasflareComponentProps {
    /** Controlled value. */
    value?: number
    /** Uncontrolled initial value. */
    defaultValue?: number
    /** Called when the value changes (after clamp). */
    onChange?: (value: number) => void
    /** Minimum allowed value. */
    min?: number
    /** Maximum allowed value. */
    max?: number
    /** Step for stepper buttons + arrow keys. Default: `1`. */
    step?: number
    /** Decimal precision for display. Default: derived from `step`. */
    precision?: number
    /** Placeholder shown when empty. */
    placeholder?: string
    /** Disable the input. */
    disabled?: boolean
    /** Read-only input. */
    readOnly?: boolean
    /** Hide the stepper buttons. */
    hideSteppers?: boolean
    /** Additional class names on the outer wrapper. */
    className?: string
    /** Name attribute (for form submission). */
    name?: string
    /** Accessible label. */
    "aria-label"?: string
}

function clamp(n: number, min?: number, max?: number): number {
    let out = n
    if (typeof min === "number") out = Math.max(out, min)
    if (typeof max === "number") out = Math.min(out, max)
    return out
}

function precisionFromStep(step: number): number {
    const s = String(step)
    const dot = s.indexOf(".")
    return dot === -1 ? 0 : s.length - dot - 1
}

/**
 * Numeric input with stepper buttons and clamping.
 *
 * @component
 * @layer core
 */
export function NumberInput({
    value,
    defaultValue,
    onChange,
    min,
    max,
    step = 1,
    precision,
    placeholder,
    disabled = false,
    readOnly = false,
    hideSteppers = false,
    className,
    name,
    surface,
    radius,
    animated,
    "aria-label": ariaLabel,
}: NumberInputProps) {
    const sf = useSaasflareProps({ surface, radius, animated })
    const isControlled = value !== undefined
    const initial = defaultValue ?? (typeof min === "number" ? min : 0)
    const [internal, setInternal] = useState<number>(initial)
    const current = isControlled ? (value as number) : internal
    const decimals = precision ?? precisionFromStep(step)

    const commit = useCallback(
        (next: number) => {
            const clamped = clamp(Number.isFinite(next) ? next : initial, min, max)
            if (!isControlled) setInternal(clamped)
            onChange?.(clamped)
        },
        [initial, isControlled, max, min, onChange],
    )

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value
        if (raw === "" || raw === "-") {
            // Allow transient empty / negative-only state; commit on blur.
            if (!isControlled) setInternal(0)
            return
        }
        const parsed = Number(raw)
        if (Number.isNaN(parsed)) return
        commit(parsed)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const parsed = Number(e.target.value)
        commit(Number.isNaN(parsed) ? initial : parsed)
    }

    const inc = () => commit(current + step)
    const dec = () => commit(current - step)

    const displayValue =
        decimals > 0 && Number.isFinite(current)
            ? current.toFixed(decimals)
            : String(current)

    return (
        <div
            data-slot="number-input"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-disabled={String(disabled)}
            className={cn(
                "inline-flex h-9 w-full min-w-32 items-stretch rounded-md border border-input bg-transparent text-sm shadow-xs",
                "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
                "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
                className,
            )}
        >
            <input
                data-slot="number-input-field"
                type="number"
                inputMode="decimal"
                name={name}
                value={Number.isFinite(current) ? displayValue : ""}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
                readOnly={readOnly}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
                aria-label={ariaLabel}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {!hideSteppers && (
                <div
                    data-slot="number-input-steppers"
                    className="flex flex-col border-l border-input"
                >
                    <button
                        type="button"
                        data-slot="number-input-increment"
                        onClick={inc}
                        disabled={disabled || readOnly || (typeof max === "number" && current >= max)}
                        tabIndex={-1}
                        aria-label="Increment"
                        className="flex h-1/2 w-6 items-center justify-center text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 6.5l3-3 3 3" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        data-slot="number-input-decrement"
                        onClick={dec}
                        disabled={disabled || readOnly || (typeof min === "number" && current <= min)}
                        tabIndex={-1}
                        aria-label="Decrement"
                        className="flex h-1/2 w-6 items-center justify-center border-t border-input text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3.5l3 3 3-3" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}
