// @toreview
"use client"

/**
 * @fileoverview RadioGroup — accessible radio button group with polished styling and focus states.
 * @module packages/core/components/ui/radio-group
 * @layer core
 *
 * @component
 * @example
 * import { RadioGroup, RadioGroupItem } from '@saasflare/ui';
 * <RadioGroup defaultValue="option-1">
 *   <RadioGroupItem value="option-1" />
 *   <RadioGroupItem value="option-2" />
 * </RadioGroup>
 */
"use client"

import * as React from "react"
import { CircleIcon } from "./phosphor"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

interface RadioGroupProps
  extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function RadioGroup({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: RadioGroupProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <RadioGroupPrimitive.Root
      {...props}
      data-slot="radio-group"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("grid gap-3", className)}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const sf = useSaasflareProps()
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 cursor-pointer rounded-full border border-input text-primary shadow-xs transition-all duration-150 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:shadow-[0_0_0_1px] data-[state=checked]:shadow-primary/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon weight={sf.iconWeight} className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary animate-in zoom-in-50 duration-150" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem, type RadioGroupProps }
