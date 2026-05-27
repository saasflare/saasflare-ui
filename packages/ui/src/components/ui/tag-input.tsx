// @draft
"use client"

/**
 * @fileoverview Saasflare TagInput — input that converts entries into
 * removable pills on Enter / comma. Controlled or uncontrolled.
 * @author Saasflare™
 *
 * Used for keyword fields, recipient lists, tag editors. Self-contained
 * (no `react-tag-input`). Pills render as Saasflare-styled chips with an
 * inline remove ("×") affordance.
 *
 * @module packages/ui/components/ui/tag-input
 * @package ui
 * @layer core
 *
 * @example
 * const [tags, setTags] = useState<string[]>([]);
 * <TagInput value={tags} onChange={setTags} placeholder="Add a tag…" />
 */

import {
    useCallback,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
    type ReactNode,
} from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the TagInput component. */
export interface TagInputProps extends SaasflareComponentProps {
    /** Controlled list of tags. */
    value?: string[]
    /** Uncontrolled initial tags. */
    defaultValue?: string[]
    /** Called whenever the tag list changes. */
    onChange?: (tags: string[]) => void
    /** Placeholder shown in the input. */
    placeholder?: string
    /** Maximum number of tags accepted. */
    maxTags?: number
    /** Characters that commit the current input as a tag. Default: `[",", "Enter"]`. */
    separators?: string[]
    /** Reject duplicate tags. Default: `true`. */
    unique?: boolean
    /** Disable the input. */
    disabled?: boolean
    /** Custom renderer for each pill. Falls back to the default pill UI. */
    renderTag?: (tag: string, onRemove: () => void) => ReactNode
    /** Additional class names on the outer wrapper. */
    className?: string
    /** Accessible label. */
    "aria-label"?: string
}

/**
 * Input field that converts text into removable tag pills.
 *
 * @component
 * @layer core
 */
export function TagInput({
    value,
    defaultValue,
    onChange,
    placeholder,
    maxTags,
    separators = [",", "Enter"],
    unique = true,
    disabled = false,
    renderTag,
    className,
    surface,
    radius,
    animated,
    "aria-label": ariaLabel,
}: TagInputProps) {
    const sf = useSaasflareProps({ surface, radius, animated })
    const isControlled = value !== undefined
    const [internal, setInternal] = useState<string[]>(defaultValue ?? [])
    const tags = isControlled ? value : internal
    const [draft, setDraft] = useState("")

    const commit = useCallback(
        (raw: string) => {
            const trimmed = raw.trim()
            if (!trimmed) return
            if (unique && tags.includes(trimmed)) return
            if (typeof maxTags === "number" && tags.length >= maxTags) return
            const next = [...tags, trimmed]
            if (!isControlled) setInternal(next)
            onChange?.(next)
            setDraft("")
        },
        [isControlled, maxTags, onChange, tags, unique],
    )

    const removeAt = useCallback(
        (index: number) => {
            const next = tags.filter((_, i) => i !== index)
            if (!isControlled) setInternal(next)
            onChange?.(next)
        },
        [isControlled, onChange, tags],
    )

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value
        // Allow paste of "a, b, c" — split on the first separator if it's not Enter.
        const sep = separators.find((s) => s !== "Enter" && v.includes(s))
        if (sep) {
            const parts = v.split(sep)
            for (let i = 0; i < parts.length - 1; i++) commit(parts[i])
            setDraft(parts[parts.length - 1] ?? "")
        } else {
            setDraft(v)
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (separators.includes(e.key) || (e.key === "," && separators.includes(","))) {
            e.preventDefault()
            commit(draft)
            return
        }
        if (e.key === "Backspace" && draft === "" && tags.length > 0) {
            e.preventDefault()
            removeAt(tags.length - 1)
        }
    }

    return (
        <div
            data-slot="tag-input"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-disabled={String(disabled)}
            className={cn(
                "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm shadow-xs",
                "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
                "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
                className,
            )}
        >
            {tags.map((tag, i) => {
                const onRemove = () => removeAt(i)
                if (renderTag) return <span key={`${tag}-${i}`}>{renderTag(tag, onRemove)}</span>
                return (
                    <span
                        key={`${tag}-${i}`}
                        data-slot="tag-input-tag"
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                        <span className="truncate">{tag}</span>
                        <button
                            type="button"
                            data-slot="tag-input-remove"
                            onClick={onRemove}
                            disabled={disabled}
                            aria-label={`Remove ${tag}`}
                            className="inline-flex size-3.5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                        >
                            <svg
                                viewBox="0 0 12 12"
                                width="10"
                                height="10"
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            >
                                <path d="M3 3l6 6M9 3l-6 6" />
                            </svg>
                        </button>
                    </span>
                )
            })}
            <input
                data-slot="tag-input-field"
                type="text"
                value={draft}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={() => commit(draft)}
                disabled={disabled}
                placeholder={tags.length === 0 ? placeholder : undefined}
                aria-label={ariaLabel ?? "Add tag"}
                className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
        </div>
    )
}
