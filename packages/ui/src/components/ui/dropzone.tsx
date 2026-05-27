// @draft
"use client"

/**
 * @fileoverview Saasflare Dropzone — drag-and-drop file upload area.
 * @author Saasflare™
 *
 * Self-contained dropzone: handles drag-over highlight, drop, click-to-open
 * (via {@link useFileDialog}), and disabled / max-size / accept filtering.
 * Calls back with the accepted + rejected file lists; rendering of the
 * accepted file UI is left to the consumer (or the default body slot).
 *
 * Saasflare does not bundle `react-dropzone`; this is a ~150-line replacement
 * that integrates with the surface/radius/animated system.
 *
 * @module packages/ui/components/ui/dropzone
 * @package ui
 * @layer core
 *
 * @example
 * <Dropzone
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024}
 *   onDrop={(accepted, rejected) => upload(accepted)}
 * />
 */

import { useCallback, useState, type DragEvent, type ReactNode } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useFileDialog } from "../../hooks/use-file-dialog"

/** Reason a file was rejected by the dropzone's built-in validation. */
export type DropzoneRejectionReason = "too-large" | "type-mismatch"

/** A rejected file with the reason. */
export interface DropzoneRejection {
    file: File
    reason: DropzoneRejectionReason
}

/** Props for the Dropzone component. */
export interface DropzoneProps extends SaasflareComponentProps {
    /** Called with `(accepted, rejected)` when the user drops or picks files. */
    onDrop?: (accepted: File[], rejected: DropzoneRejection[]) => void
    /** MIME types or extensions to accept (matches `<input accept>`). */
    accept?: string
    /** Maximum file size in bytes. */
    maxSize?: number
    /** Allow multiple file selection. Default: `true`. */
    multiple?: boolean
    /** Disable the dropzone. */
    disabled?: boolean
    /** Render-prop body. Receives `isDragActive`. Falls back to the default UI. */
    children?: ReactNode | ((state: { isDragActive: boolean }) => ReactNode)
    /** Additional class names. */
    className?: string
}

function matchesAccept(file: File, accept?: string): boolean {
    if (!accept) return true
    const parts = accept.split(",").map((s) => s.trim().toLowerCase())
    const name = file.name.toLowerCase()
    const type = file.type.toLowerCase()
    return parts.some((p) => {
        if (p.startsWith(".")) return name.endsWith(p)
        if (p.endsWith("/*")) return type.startsWith(p.slice(0, -1))
        return type === p
    })
}

function partition(
    files: File[],
    accept?: string,
    maxSize?: number,
): { accepted: File[]; rejected: DropzoneRejection[] } {
    const accepted: File[] = []
    const rejected: DropzoneRejection[] = []
    for (const file of files) {
        if (!matchesAccept(file, accept)) {
            rejected.push({ file, reason: "type-mismatch" })
            continue
        }
        if (typeof maxSize === "number" && file.size > maxSize) {
            rejected.push({ file, reason: "too-large" })
            continue
        }
        accepted.push(file)
    }
    return { accepted, rejected }
}

/**
 * Drag-and-drop file upload area with click-to-open fallback.
 *
 * @component
 * @layer core
 */
export function Dropzone({
    onDrop,
    accept,
    maxSize,
    multiple = true,
    disabled = false,
    children,
    className,
    surface,
    radius,
    animated,
}: DropzoneProps) {
    const sf = useSaasflareProps({ surface, radius, animated })
    const [isDragActive, setIsDragActive] = useState(false)

    const handle = useCallback(
        (files: File[]) => {
            const { accepted, rejected } = partition(files, accept, maxSize)
            onDrop?.(accepted, rejected)
        },
        [accept, maxSize, onDrop],
    )

    const { open } = useFileDialog({
        accept,
        multiple,
        onChange: handle,
    })

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (disabled) return
        setIsDragActive(true)
    }
    const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragActive(false)
    }
    const onDropEvent = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragActive(false)
        if (disabled) return
        const files = Array.from(e.dataTransfer.files)
        handle(multiple ? files : files.slice(0, 1))
    }

    return (
        <div
            data-slot="dropzone"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            data-active={String(isDragActive)}
            data-disabled={String(disabled)}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            onClick={() => !disabled && open()}
            onKeyDown={(e) => {
                if (disabled) return
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    open()
                }
            }}
            onDragOver={onDragOver}
            onDragEnter={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDropEvent}
            className={cn(
                "flex min-h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed",
                "border-border bg-background/40 p-6 text-center text-sm text-muted-foreground",
                "transition-[border-color,background-color] duration-200",
                "hover:border-primary/40 hover:bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "data-[active=true]:border-primary/60 data-[active=true]:bg-primary/10",
                "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                className,
            )}
        >
            {typeof children === "function" ? (
                children({ isDragActive })
            ) : children !== undefined ? (
                children
            ) : (
                <div className="flex flex-col items-center gap-1">
                    <p className="font-medium text-foreground">
                        {isDragActive ? "Drop files here" : "Drag files here or click to browse"}
                    </p>
                    {accept && <p className="text-xs">Accepts: {accept}</p>}
                    {typeof maxSize === "number" && (
                        <p className="text-xs">Max size: {(maxSize / 1024 / 1024).toFixed(1)} MB</p>
                    )}
                </div>
            )}
        </div>
    )
}
