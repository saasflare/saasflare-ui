// @toreview
"use client"

/**
 * @fileoverview Saasflare SearchField — input with search icon, clear, and loading.
 * @module packages/core/components/ui/search-field
 * @layer core
 *
 * A search-specific input with built-in search icon, clear button,
 * and optional loading spinner. Used in toolbars, command palettes,
 * and filter sections.
 *
 * @example
 * import { SearchField } from "@saasflare/ui";
 *
 * <SearchField
 *   placeholder="Search projects..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery("")}
 * />
 */

import * as React from "react"
import { MagnifyingGlassIcon, XIcon, CircleNotchIcon } from "./phosphor"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the SearchField component */
interface SearchFieldProps extends Omit<React.ComponentProps<"input">, "type" | keyof SaasflareComponentProps>, SaasflareComponentProps {
  /** Show loading spinner instead of search icon */
  loading?: boolean
  /** Callback when clear button is clicked */
  onClear?: () => void
}

/**
 * Search input with icon, clear button, and loading state.
 *
 * @component
 * @layer core
 *
 * @param {boolean} loading - Shows spinner in place of search icon
 * @param {function} onClear - Callback when clear button is clicked
 *
 * @example
 * const [query, setQuery] = useState("");
 * <SearchField
 *   placeholder="Search..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery("")}
 *   loading={isSearching}
 * />
 */
function SearchField({
  className,
  loading = false,
  onClear,
  value,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SearchFieldProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const hasValue = typeof value === "string" ? value.length > 0 : false

  return (
    <div
      data-slot="search-field"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("relative", className)}
    >
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {loading ? (
          <CircleNotchIcon className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <MagnifyingGlassIcon weight={sf.iconWeight} className="size-4" aria-hidden="true" />
        )}
      </div>
      <input
        type="search"
        data-slot="search-field-input"
        className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        value={value}
        {...props}
      />
      {hasValue && onClear && (
        <button
          type="button"
          data-slot="search-field-clear"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Clear search"
        >
          <XIcon weight={sf.iconWeight} className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export { SearchField, type SearchFieldProps }
