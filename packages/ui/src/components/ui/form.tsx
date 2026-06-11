// @toreview
"use client"

/**
 * @fileoverview Form primitive — form field wrappers integrating React Hook Form with accessible labels,
 * descriptions, and error messages. Uses Radix UI Slot for composable form controls.
 * Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/form
 * @layer core
 *
 * @requires react-hook-form — peer dependency.
 * @requires @hookform/resolvers — peer dependency (for zod/yup/etc resolver glue).
 * @requires zod — peer dependency (or substitute schema lib via @hookform/resolvers).
 *
 * @component
 * @example
 * import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@saasflare/ui';
 * <Form {...form}>
 *   <FormField control={form.control} name="email" render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl><input {...field} /></FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )} />
 * </Form>
 */

import * as React from "react"
import type * as LabelPrimitive from "@radix-ui/react-label"
import * as Slot from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { Label } from "./label"

/**
 * Form root — re-export of react-hook-form's `FormProvider`. Spread the object
 * returned by `useForm()` into it to make form state available to nested
 * {@link FormField} compositions.
 *
 * @component
 * @layer core
 */
const Form = FormProvider

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

/**
 * Controlled field binding — wraps react-hook-form's `Controller` and exposes
 * the field name via context so {@link useFormField} can resolve ids and
 * validation state for the label, control, description, and message.
 *
 * @component
 * @layer core
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

/**
 * Resolves the current field's accessibility wiring and validation state.
 * Returns the field `id`/`name`, the derived `formItemId`, `formDescriptionId`,
 * and `formMessageId`, plus the react-hook-form field state (`error`,
 * `invalid`, `isDirty`, `isTouched`). Must be called inside both
 * `<FormField>` and `<FormItem>`, under a `<Form>` provider — throws otherwise.
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const formContext = useFormContext()
  if (!formContext) {
    throw new Error("useFormField should be used within <Form>")
  }

  const { getFieldState } = formContext
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

interface FormItemContextValue {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

/**
 * Field wrapper — generates the unique id shared by label, control,
 * description, and message, and stacks them in a vertical grid.
 *
 * @component
 * @layer core
 */
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

/**
 * Props for {@link FormLabel}. Extends {@link SaasflareComponentProps} so
 * `surface`, `radius`, `animated`, and `iconWeight` can override the
 * <SaasflareProvider> context per instance.
 */
interface FormLabelProps
  extends Omit<
      React.ComponentProps<typeof LabelPrimitive.Root>,
      keyof SaasflareComponentProps
    >,
    SaasflareComponentProps {}

/**
 * Field label — wired to the control via `htmlFor` and tinted destructive when
 * the field has a validation error.
 *
 * @component
 * @layer core
 */
function FormLabel({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: FormLabelProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

/**
 * Slot that wires the wrapped input to its label, description, and message via
 * `id`, `aria-describedby`, and `aria-invalid`. Place the actual form control
 * as its single child.
 *
 * @component
 * @layer core
 */
function FormControl({ ...props }: React.ComponentProps<typeof Slot.Root>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

/**
 * Props for {@link FormDescription}. Extends {@link SaasflareComponentProps}
 * for per-instance `surface` / `radius` / `animated` / `iconWeight` overrides.
 */
interface FormDescriptionProps
  extends Omit<React.ComponentProps<"p">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Muted helper text below the control, referenced by the control's
 * `aria-describedby`.
 *
 * @component
 * @layer core
 */
function FormDescription({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: FormDescriptionProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * Props for {@link FormMessage}. Extends {@link SaasflareComponentProps}
 * for per-instance `surface` / `radius` / `animated` / `iconWeight` overrides.
 */
interface FormMessageProps
  extends Omit<React.ComponentProps<"p">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Validation message — shows the field's error message when present, otherwise
 * its children; renders nothing when both are empty.
 *
 * @component
 * @layer core
 */
function FormMessage({
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: FormMessageProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  type FormLabelProps,
  type FormDescriptionProps,
  type FormMessageProps,
}
