// @draft
"use client"

/**
 * @fileoverview Programmatically open the native file picker. Returns the
 * selected files plus an `open()` trigger. Used by Dropzone but also useful
 * for any "Click to upload" affordance without rendering an `<input>`.
 * @author Saasflare™
 * @module packages/ui/hooks/use-file-dialog
 * @package ui
 *
 * @example
 * const { files, open, reset } = useFileDialog({ accept: "image/*", multiple: true });
 * <Button onClick={open}>Choose files</Button>
 * {files?.length ? <p>{files.length} file(s) selected</p> : null}
 */

import { useCallback, useRef, useState } from "react"

/** Options for {@link useFileDialog}. */
export interface UseFileDialogOptions {
    /** MIME types or extensions to filter (matches `<input accept>`). */
    accept?: string
    /** Allow multiple selection. Default: `false`. */
    multiple?: boolean
    /** Restrict to a folder picker (only supported in Chromium). */
    directory?: boolean
    /** Camera capture mode for mobile (`"user"` | `"environment"`). */
    capture?: "user" | "environment"
    /** Called after the user picks files. */
    onChange?: (files: File[]) => void
}

/** Return value of {@link useFileDialog}. */
export interface UseFileDialogReturn {
    /** Most recently picked files (empty array if reset/never opened). */
    files: File[]
    /** Open the native file picker. */
    open: () => void
    /** Clear the current selection. */
    reset: () => void
}

/**
 * Returns an `open()` trigger that pops the native file picker, plus the
 * selected `files`. No DOM rendered by the consumer is required — the hook
 * mounts a hidden `<input>` lazily on first call.
 *
 * @param options - Configuration mirroring `<input type="file">` attributes.
 * @returns The selected files and control callbacks.
 */
export function useFileDialog(options: UseFileDialogOptions = {}): UseFileDialogReturn {
    const { accept, multiple = false, directory = false, capture, onChange } = options
    const [files, setFiles] = useState<File[]>([])
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleChange = useCallback(
        (e: Event) => {
            const target = e.target as HTMLInputElement
            const picked = Array.from(target.files ?? [])
            setFiles(picked)
            onChange?.(picked)
            // Reset the input value so picking the same file twice still fires.
            target.value = ""
        },
        [onChange],
    )

    const ensureInput = useCallback((): HTMLInputElement => {
        if (typeof document === "undefined") {
            throw new Error("useFileDialog: open() called outside the browser")
        }
        if (inputRef.current) return inputRef.current
        const input = document.createElement("input")
        input.type = "file"
        input.style.display = "none"
        if (accept) input.accept = accept
        if (multiple) input.multiple = true
        if (capture) input.capture = capture
        if (directory) {
            // Non-standard but supported in Chromium.
            input.setAttribute("webkitdirectory", "")
            input.setAttribute("directory", "")
        }
        input.addEventListener("change", handleChange)
        document.body.appendChild(input)
        inputRef.current = input
        return input
    }, [accept, multiple, directory, capture, handleChange])

    const open = useCallback(() => {
        ensureInput().click()
    }, [ensureInput])

    const reset = useCallback(() => {
        setFiles([])
        if (inputRef.current) inputRef.current.value = ""
    }, [])

    return { files, open, reset }
}
