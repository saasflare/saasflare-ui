// @toreview
/**
 * @fileoverview Spinner primitive — animated loading indicator built on the Lucide
 * Loader2 icon. Applies a continuous spin animation with accessible status role.
 * Part of the Saasflare base component layer.
 * @module packages/core/components/ui/spinner
 * @layer core
 *
 * @component
 * @example
 * import { Spinner } from '@saasflare/core';
 * <Spinner className="size-6" />
 */
import { Loader2Icon } from "lucide-react"

import { cn } from "../../lib"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
