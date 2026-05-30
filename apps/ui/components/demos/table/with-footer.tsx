"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@saasflare/ui"

const USAGE = [
    { item: "API requests", quantity: "1,240,000", cost: "$124.00" },
    { item: "Bandwidth (GB)", quantity: "820", cost: "$41.00" },
    { item: "Active seats", quantity: "18", cost: "$360.00" },
]

/** A usage table with a totals row in the footer. */
export function Demo() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Line item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {USAGE.map((row) => (
                    <TableRow key={row.item}>
                        <TableCell className="font-medium">{row.item}</TableCell>
                        <TableCell className="text-right">{row.quantity}</TableCell>
                        <TableCell className="text-right">{row.cost}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2}>Total due</TableCell>
                    <TableCell className="text-right">$525.00</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
