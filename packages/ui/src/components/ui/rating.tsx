// @draft
"use client"

/**
 * @fileoverview Saasflare Rating — star rating input with half-star and
 * read-only support.
 * @author Saasflare™
 *
 * Self-contained: inline SVG star, no `react-rating` dep. Supports
 * controlled/uncontrolled, half-precision via `allowHalf`, keyboard
 * adjustment (arrow keys), and a read-only display mode for showing
 * average scores.
 *
 * @module packages/ui/components/ui/rating
 * @package ui
 * @layer core
 *
 * @example
 * const [score, setScore] = useState(0);
 * <Rating value={score} onChange={setScore} allowHalf />
 *
 * @example
 * // Display-only average score
 * <Rating value={4.3} readOnly allowHalf size="sm" />
 */

import { useCallback, useState, type MouseEvent } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

const SIZE_PX = { sm: 14, md: 20, lg: 28, xl: 36 } as const
export type RatingSize = keyof typeof SIZE_PX

/** Props for the Rating component. */
export interface RatingProps extends SaasflareComponentProps {
    /** Controlled value (0..count). */
    value?: number
    /** Uncontrolled initial value. */
    defaultValue?: number
    /** Called when the user clicks a star. */
    onChange?: (value: number) => void
    /** Number of stars. Default: `5`. */
    count?: number
    /** Allow half-star granularity. Default: `false`. */
    allowHalf?: boolean
    /** Read-only display mode (no interaction, no hover preview). */
    readOnly?: boolean
    /** Disable the rating. */
    disabled?: boolean
    /** Star size. Default: `"md"`. */
    size?: RatingSize
    /** Star color (any CSS color). Default: `var(--warning)` — brand-independent gold. */
    color?: string
    /** Additional class names. */
    className?: string
    /** Accessible label. */
    "aria-label"?: string
}

function StarPath({
    fillPercent,
    color,
    px,
    onClick,
    onMouseMove,
}: {
    fillPercent: number
    color: string
    px: number
    onClick?: (e: MouseEvent<SVGSVGElement>) => void
    onMouseMove?: (e: MouseEvent<SVGSVGElement>) => void
}) {
    const id = `star-clip-${Math.random().toString(36).slice(2, 8)}`
    return (
        <svg
            viewBox="0 0 24 24"
            width={px}
            height={px}
            onClick={onClick}
            onMouseMove={onMouseMove}
            aria-hidden="true"
            style={{ display: "block" }}
        >
            <defs>
                <clipPath id={id}>
                    <rect x="0" y="0" width={24 * fillPercent} height="24" />
                </clipPath>
            </defs>
            <path
                d="M12 2.5l2.92 6.34 6.96.66-5.23 4.7 1.56 6.8L12 17.6l-6.21 3.4 1.56-6.8L2.12 9.5l6.96-.66z"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M12 2.5l2.92 6.34 6.96.66-5.23 4.7 1.56 6.8L12 17.6l-6.21 3.4 1.56-6.8L2.12 9.5l6.96-.66z"
                fill={color}
                clipPath={`url(#${id})`}
            />
        </svg>
    )
}

/**
 * Star rating input with half-star and read-only support.
 *
 * @component
 * @layer core
 */
export function Rating({
    value,
    defaultValue,
    onChange,
    count = 5,
    allowHalf = false,
    readOnly = false,
    disabled = false,
    size = "md",
    color = "var(--warning)",
    className,
    surface,
    radius,
    animated,
    "aria-label": ariaLabel,
}: RatingProps) {
    const sf = useSaasflareProps({ surface, radius, animated })
    const isControlled = value !== undefined
    const [internal, setInternal] = useState<number>(defaultValue ?? 0)
    const [hover, setHover] = useState<number | null>(null)
    const current = isControlled ? (value as number) : internal
    const display = hover ?? current
    const px = SIZE_PX[size]
    const interactive = !readOnly && !disabled

    const commit = useCallback(
        (next: number) => {
            const clamped = Math.max(0, Math.min(count, next))
            if (!isControlled) setInternal(clamped)
            onChange?.(clamped)
        },
        [count, isControlled, onChange],
    )

    const computeScore = (i: number, e: MouseEvent<SVGSVGElement>): number => {
        if (!allowHalf) return i + 1
        const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
        const halfway = rect.left + rect.width / 2
        return e.clientX < halfway ? i + 0.5 : i + 1
    }

    return (
        <div
            data-slot="rating"
            data-size={size}
            data-readonly={String(readOnly)}
            data-disabled={String(disabled)}
            data-surface={sf.surface}
            data-animated={String(sf.animated)}
            role={interactive ? "slider" : "img"}
            aria-label={ariaLabel ?? `Rating: ${current} of ${count}`}
            aria-valuemin={interactive ? 0 : undefined}
            aria-valuemax={interactive ? count : undefined}
            aria-valuenow={interactive ? current : undefined}
            tabIndex={interactive ? 0 : -1}
            onKeyDown={
                interactive
                    ? (e) => {
                          const inc = allowHalf ? 0.5 : 1
                          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                              e.preventDefault()
                              commit(current + inc)
                          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                              e.preventDefault()
                              commit(current - inc)
                          } else if (e.key === "Home") {
                              e.preventDefault()
                              commit(0)
                          } else if (e.key === "End") {
                              e.preventDefault()
                              commit(count)
                          }
                      }
                    : undefined
            }
            onMouseLeave={interactive ? () => setHover(null) : undefined}
            className={cn(
                "inline-flex items-center gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                interactive && "cursor-pointer",
                disabled && "cursor-not-allowed opacity-50",
                className,
            )}
        >
            {Array.from({ length: count }, (_, i) => {
                const fillPercent = Math.max(0, Math.min(1, display - i))
                return (
                    <StarPath
                        key={i}
                        fillPercent={fillPercent}
                        color={color}
                        px={px}
                        onClick={
                            interactive
                                ? (e) => commit(computeScore(i, e))
                                : undefined
                        }
                        onMouseMove={
                            interactive
                                ? (e) => setHover(computeScore(i, e))
                                : undefined
                        }
                    />
                )
            })}
        </div>
    )
}
