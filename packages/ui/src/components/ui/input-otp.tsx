// @toreview
"use client"

/**
 * @fileoverview InputOTP primitive — one-time password input with individual character slots.
 * Built on the input-otp library. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/input-otp
 * @layer core
 *
 * @component
 * @example
 * import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@saasflare/ui';
 * <InputOTP maxLength={6}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *     <InputOTPSlot index={2} />
 *   </InputOTPGroup>
 *   <InputOTPSeparator />
 *   <InputOTPGroup>
 *     <InputOTPSlot index={3} />
 *     <InputOTPSlot index={4} />
 *     <InputOTPSlot index={5} />
 *   </InputOTPGroup>
 * </InputOTP>
 */

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "./phosphor"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link InputOTP}.
 *
 * Extends the `input-otp` OTPInput props with {@link SaasflareComponentProps}.
 * `containerClassName` styles the outer flex wrapper; `className` styles the
 * underlying input element.
 */
type InputOTPProps = React.ComponentProps<typeof OTPInput> & SaasflareComponentProps & {
  containerClassName?: string
}

/**
 * Root one-time-password input. Owns focus management and the hidden input
 * via the `input-otp` library; resolves the Saasflare contract axes and emits
 * `data-surface`/`data-radius`/`data-animated` for downstream theming.
 */
function InputOTP({
  className,
  containerClassName,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: InputOTPProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <OTPInput
      {...props}
      data-slot="input-otp"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
    />
  )
}

/** Props for {@link InputOTPGroup}. */
interface InputOTPGroupProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Visual grouping for a run of {@link InputOTPSlot}s. Resolves the contract
 * axes and emits `data-surface`/`data-radius`/`data-animated` so the group
 * stays consistent with the rest of the OTP family.
 */
function InputOTPGroup({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: InputOTPGroupProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <div
      data-slot="input-otp-group"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

/** Props for {@link InputOTPSlot}. */
interface InputOTPSlotProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Zero-based position of this slot within the OTP value. */
  index: number
}

/**
 * A single visible character box. Renders the bordered/rounded cell plus the
 * blinking fake caret. Resolves the contract axes and emits
 * `data-surface`/`data-radius`/`data-animated` so per-slot theming applies.
 */
function InputOTPSlot({
  index,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: InputOTPSlotProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots?.[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

/** Props for {@link InputOTPSeparator}. */
interface InputOTPSeparatorProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Visual divider between OTP groups, rendering a Phosphor `MinusIcon` whose
 * weight follows the resolved `iconWeight` axis.
 */
function InputOTPSeparator({
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: InputOTPSeparatorProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <div
      data-slot="input-otp-separator"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      role="separator"
      {...props}
    >
      <MinusIcon weight={sf.iconWeight} />
    </div>
  )
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  type InputOTPProps,
  type InputOTPGroupProps,
  type InputOTPSlotProps,
  type InputOTPSeparatorProps,
}
