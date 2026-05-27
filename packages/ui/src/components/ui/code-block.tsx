// @draft
"use client"

/**
 * @fileoverview Saasflare CodeBlock — framing UI for source-code blocks.
 * @author Saasflare™
 *
 * Provides the visual chrome (filename header, language badge, copy button,
 * optional line numbers, scrollable container) around code. Syntax
 * highlighting is intentionally NOT bundled — pass pre-highlighted HTML
 * via the `highlighted` prop (Shiki / Prism / Highlight.js are all heavy
 * and opinionated) or fall back to plain monospace via the `code` prop.
 *
 * @module packages/ui/components/ui/code-block
 * @package ui
 * @layer core
 *
 * @example
 * // Plain (no highlighting)
 * <CodeBlock code={`function hi() { return "hello" }`} language="ts" filename="hi.ts" />
 *
 * @example
 * // With pre-rendered HTML from Shiki on the server
 * <CodeBlock highlighted={await codeToHtml(src, { lang: "ts", theme: "github-dark" })} />
 */

import { useMemo } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useClipboard } from "../../hooks/use-clipboard"
import { CheckIcon } from "./phosphor"

/** Props for the CodeBlock component. */
export interface CodeBlockProps extends SaasflareComponentProps {
    /** Plain source code (rendered as monospace, no highlighting). */
    code?: string
    /** Pre-highlighted HTML — e.g. output from Shiki's `codeToHtml`. */
    highlighted?: string
    /** Language label shown in the header (purely cosmetic). */
    language?: string
    /** Filename shown left of the language badge. */
    filename?: string
    /** Show 1-based line numbers in the gutter. */
    showLineNumbers?: boolean
    /** Hide the top bar (copy button still floats inside the block). */
    hideHeader?: boolean
    /** Hide the copy-to-clipboard button. */
    hideCopyButton?: boolean
    /** Additional class names on the outer wrapper. */
    className?: string
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    )
}

/**
 * Code block with filename header, language badge, copy button, and optional
 * line numbers. Highlighting is BYO (pass `highlighted` HTML or `code` text).
 *
 * @component
 * @layer core
 */
export function CodeBlock({
    code,
    highlighted,
    language,
    filename,
    showLineNumbers = false,
    hideHeader = false,
    hideCopyButton = false,
    className,
    surface,
    radius,
    animated,
}: CodeBlockProps) {
    const sf = useSaasflareProps({ surface, radius, animated })
    const { copy, copied } = useClipboard()

    const plainText = code ?? ""
    const lines = useMemo(
        () => (showLineNumbers && code ? code.split("\n") : null),
        [code, showLineNumbers],
    )

    const onCopy = () => {
        // Prefer plain `code` for clipboard; if only highlighted HTML is given,
        // strip tags so users paste source, not markup.
        const text =
            code ?? (highlighted ? highlighted.replace(/<[^>]+>/g, "") : "")
        copy(text)
    }

    const showHeader = !hideHeader && (filename || language)

    return (
        <div
            data-slot="code-block"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            className={cn(
                "group relative overflow-hidden rounded-lg border bg-card text-card-foreground",
                className,
            )}
        >
            {showHeader && (
                <div
                    data-slot="code-block-header"
                    className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-1.5 text-xs"
                >
                    <div className="flex min-w-0 items-center gap-2">
                        {filename && (
                            <span
                                data-slot="code-block-filename"
                                className="truncate font-mono text-muted-foreground"
                            >
                                {filename}
                            </span>
                        )}
                        {language && (
                            <span
                                data-slot="code-block-language"
                                className="rounded-sm bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
                            >
                                {language}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="relative">
                {!hideCopyButton && (
                    <button
                        type="button"
                        data-slot="code-block-copy"
                        onClick={onCopy}
                        aria-label={copied ? "Copied" : "Copy code"}
                        className={cn(
                            "absolute right-2 top-2 z-10 inline-flex size-7 items-center justify-center rounded-md border bg-background/80 text-muted-foreground shadow-xs backdrop-blur-sm",
                            "transition-colors hover:text-foreground hover:bg-background",
                            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                            "[&_svg]:size-3.5",
                        )}
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                )}

                {highlighted ? (
                    <div
                        data-slot="code-block-content"
                        className={cn(
                            "overflow-x-auto p-4 text-sm font-mono leading-relaxed",
                            "[&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0",
                        )}
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                ) : lines ? (
                    <pre
                        data-slot="code-block-content"
                        className="overflow-x-auto p-4 text-sm font-mono leading-relaxed"
                    >
                        <code>
                            {lines.map((line, i) => (
                                <span key={i} className="grid grid-cols-[auto_1fr] gap-3">
                                    <span
                                        data-slot="code-block-line-number"
                                        aria-hidden="true"
                                        className="select-none text-right text-muted-foreground/60 tabular-nums"
                                    >
                                        {i + 1}
                                    </span>
                                    <span>{line || " "}</span>
                                </span>
                            ))}
                        </code>
                    </pre>
                ) : (
                    <pre
                        data-slot="code-block-content"
                        className="overflow-x-auto p-4 text-sm font-mono leading-relaxed"
                    >
                        <code>{plainText}</code>
                    </pre>
                )}
            </div>
        </div>
    )
}
