// @toreview
/**
 * @fileoverview NativeSelect primitive — styled wrapper around the native HTML select
 * element with chevron icon overlay. Supports default and small sizes with consistent
 * focus and error styling. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/native-select
 * @layer core
 *
 * @component
 * @example
 * import { NativeSelect, NativeSelectOption } from '@saasflare/ui';
 * <NativeSelect>
 *   <NativeSelectOption value="a">Option A</NativeSelectOption>
 *   <NativeSelectOption value="b">Option B</NativeSelectOption>
 * </NativeSelect>
 */
import * as React from "react"
import { CaretDownIcon } from "./phosphor"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link NativeSelect}.
 *
 * Extends the native `<select>` props with {@link SaasflareComponentProps}.
 * The HTML `size` attribute is omitted — `size` is repurposed as the visual
 * height variant.
 */
interface NativeSelectProps
  extends Omit<React.ComponentProps<"select">, "size" | keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Control height. `"sm"` renders a more compact trigger; `"md"` is the standard height. (`"default"` is a deprecated alias for `"md"`.) */
  size?: "sm" | "md" | "default"
}

/**
 * Styled native `<select>` with a chevron icon overlay. Uses the platform
 * picker UI — prefer it over the custom Select when native behavior (mobile
 * pickers, plain form submission) matters more than custom-rendered options.
 *
 * @component
 * @layer core
 *
 * @example
 * <NativeSelect>
 *   <NativeSelectOption value="a">Option A</NativeSelectOption>
 *   <NativeSelectOption value="b">Option B</NativeSelectOption>
 * </NativeSelect>
 */
function NativeSelect({
  className,
  size = "md",
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: NativeSelectProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const resolvedSize = size === "default" ? "md" : size

  return (
    <div
      className="group/native-select relative w-fit has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
    >
      <select
        {...props}
        data-slot="native-select"
        data-size={resolvedSize}
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={cn(
          "h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed data-[size=sm]:h-8 data-[size=sm]:py-1 dark:bg-input/30 dark:hover:bg-input/50",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className
        )}
      />
      <CaretDownIcon
        weight={sf.iconWeight}
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground opacity-50 select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

/**
 * A single option within a {@link NativeSelect}. Thin wrapper around the native
 * `<option>` element that adds a `data-slot` for styling hooks.
 *
 * @example
 * <NativeSelectOption value="a">Option A</NativeSelectOption>
 */
function NativeSelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />
}

/**
 * Groups related {@link NativeSelectOption}s under a label within a
 * {@link NativeSelect}. Thin wrapper around the native `<optgroup>` element.
 *
 * @example
 * <NativeSelectOptGroup label="Group">
 *   <NativeSelectOption value="a">Option A</NativeSelectOption>
 * </NativeSelectOptGroup>
 */
function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption, type NativeSelectProps }
