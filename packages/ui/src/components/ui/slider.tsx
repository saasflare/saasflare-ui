// @toreview
"use client"

/**
 * @fileoverview Slider — range input with spring-animated thumb and track fill.
 * @module packages/ui/components/ui/slider
 * @layer core
 *
 * @component
 * @example
 * import { Slider } from '@saasflare/ui';
 * <Slider defaultValue={[50]} max={100} step={1} />
 */

import * as React from "react"
import { m } from "motion/react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

interface SliderProps
  extends Omit<React.ComponentProps<typeof SliderPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  surface,
  radius,
  animated,
  ...props
}: SliderProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  const _values = React.useMemo(
    () => value ?? defaultValue ?? [min],
    [value, defaultValue, min]
  )

  return (
    <SliderPrimitive.Root
      {...props}
      data-slot="slider"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[orientation=horizontal]:h-5 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-5 data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
        className
      )}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute rounded-full bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          asChild
        >
          <m.span
            className="block size-4 shrink-0 cursor-grab rounded-full border border-primary/50 bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            whileHover={motion.disabled ? undefined : { scale: 1.2 }}
            whileTap={motion.disabled ? undefined : { scale: 0.9 }}
            transition={motion.transition}
          />
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider, type SliderProps }
