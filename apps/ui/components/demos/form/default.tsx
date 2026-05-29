"use client"

import { useForm } from "react-hook-form"
import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@saasflare/ui"

interface ProfileValues {
    email: string
}

/** A React Hook Form integration with accessible label, description, and validation message. */
export function Demo() {
    const form = useForm<ProfileValues>({ defaultValues: { email: "" } })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => {})}
                className="flex flex-col gap-4 w-full max-w-sm"
            >
                <FormField
                    control={form.control}
                    name="email"
                    rules={{
                        required: "Email is required.",
                        pattern: {
                            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                            message: "Enter a valid email address.",
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Billing email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="you@company.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Invoices and receipts are sent here.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Save</Button>
            </form>
        </Form>
    )
}
