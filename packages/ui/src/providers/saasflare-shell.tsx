// @reviewed 2026-04-19
"use client"

/**
 * @fileoverview Document shell — html + body + provider in one component.
 * @module packages/ui/providers/saasflare-shell
 * @package ui
 *
 * Server component that renders the full document shell with the design-system
 * state locked in at SSR time. Single source of truth for brand-locked apps:
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <SaasflareShell palette="emerald" surface="glass" theme="dark" animated>
 *         {children}
 *       </SaasflareShell>
 *     )
 *   }
 *
 * Renders:
 *   <html lang="en" suppressHydrationWarning
 *         data-palette="emerald" data-style="glass" data-animated="true">
 *     <body>
 *       <SaasflareProvider {...} disableScript>{children}</SaasflareProvider>
 *     </body>
 *   </html>
 *
 * Because the data-attributes are baked into the SSR HTML, the pre-hydration
 * script is redundant and disabled. Zero FOUT, zero inline JS.
 *
 * Three-tier ownership model:
 *   - SaasflareShell    → the document (html + body + context + attrs)
 *   - SaasflareProvider → the context (when you already own html + body)
 *   - SaasflareScript   → the pre-hydration script (strict-CSP use case)
 *
 * ── When NOT to use SaasflareShell ─────────────────────────────────────────
 * For showcases / user palette-switchers (runtime palette changes via a
 * ThemeToggle writing to localStorage), use `SaasflareProvider` directly and
 * omit `palette` — the inline script reads localStorage before paint.
 */

import type { ReactNode } from "react"
import { SaasflareProvider, type SaasflareProviderProps } from "./saasflare-provider"

/** Props for {@link SaasflareShell}. */
export interface SaasflareShellProps extends Omit<SaasflareProviderProps, "children" | "disableScript" | "scriptNonce"> {
    children: ReactNode
    /** Value for `<html lang="…">`. @default "en" */
    lang?: string
    /**
     * Optional className applied to `<html>`. Use this for `next/font`
     * variable classNames, which scope the loaded font's CSS variable:
     *
     *   const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
     *   <SaasflareShell className={inter.variable}>
     */
    className?: string
    /** Optional className applied to `<body>`. */
    bodyClassName?: string
    /** Optional children rendered inside a `<head>` element. */
    head?: ReactNode
}

/**
 * Full document shell that locks the Saasflare design-system state in at
 * SSR time. Replaces manual `<html>` + `<body>` + `<SaasflareProvider>`
 * wiring in the Next.js root layout.
 *
 * @component
 * @package ui
 */
export function SaasflareShell({
                                   children,
                                   lang = "en",
                                   className,
                                   bodyClassName,
                                   head,
                                   palette,
                                   surface,
                                   radius,
                                   animated,
                                   theme,
                                   smoothScrolling,
                                   storageKey,
                                   themeStorageKey,
                               }: SaasflareShellProps) {
    // Resolve SSR data-attributes from the same props the provider consumes.
    // Omitted props produce undefined → React drops the attribute, and the
    // provider's runtime effect later applies the persisted preference.
    const dataPalette =
        typeof palette === "object" ? palette.name : palette

    const dataAnimated =
        typeof animated === "boolean" ? String(animated) : undefined

    return (
        <html
            lang={lang}
            className={className}
            suppressHydrationWarning
            data-palette={dataPalette}
            data-style={surface}
            data-radius={radius}
            data-animated={dataAnimated}
        >
            {head ? <head>{head}</head> : null}
            <body className={bodyClassName}>
                <SaasflareProvider
                    palette={palette}
                    surface={surface}
                    radius={radius}
                    animated={animated}
                    theme={theme}
                    smoothScrolling={smoothScrolling}
                    storageKey={storageKey}
                    themeStorageKey={themeStorageKey}
                    disableScript
                >
                    {children}
                </SaasflareProvider>
            </body>
        </html>
    )
}
