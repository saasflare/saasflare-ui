"use client"

import {
    Badge,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@saasflare/ui"

const INVOICES = [
    { id: "INV-2041", customer: "Acme Corp", plan: "Enterprise", amount: "$1,299.00", status: "Paid" },
    { id: "INV-2040", customer: "Globex", plan: "Pro", amount: "$290.00", status: "Paid" },
    { id: "INV-2039", customer: "Initech", plan: "Pro", amount: "$290.00", status: "Pending" },
    { id: "INV-2038", customer: "Umbrella", plan: "Starter", amount: "$49.00", status: "Overdue" },
]

const STATUS_INTENT = {
    Paid: "success",
    Pending: "warning",
    Overdue: "danger",
} as const

/** An invoice table with header, body, and a status column. */
export function Demo() {
    return (
        <Table>
            <TableCaption>Recent invoices for the current billing period.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {INVOICES.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>{invoice.plan}</TableCell>
                        <TableCell className="text-right">{invoice.amount}</TableCell>
                        <TableCell>
                            <Badge variant="soft" intent={STATUS_INTENT[invoice.status as keyof typeof STATUS_INTENT]}>
                                {invoice.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
