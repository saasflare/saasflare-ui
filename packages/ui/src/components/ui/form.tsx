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
"use client"

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

const Form = FormProvider

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

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

interface FormLabelProps
  extends Omit<
      React.ComponentProps<typeof LabelPrimitive.Root>,
      keyof SaasflareComponentProps
    >,
    SaasflareComponentProps {}

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

interface FormDescriptionProps
  extends Omit<React.ComponentProps<"p">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

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

interface FormMessageProps
  extends Omit<React.ComponentProps<"p">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

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
