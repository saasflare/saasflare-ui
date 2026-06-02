"use client"

import { useState } from "react"
import { DataTable, Badge, Button, XIcon, type DataTableColumn } from "@saasflare/ui"

interface Invoice {
    id: string
    number: string
    customer: string
    amount: string
    status: "paid" | "open" | "overdue"
}

const invoices: Invoice[] = [
    { id: "inv-1041", number: "#1041", customer: "Northwind Co.", amount: "$1,200.00", status: "paid" },
    { id: "inv-1042", number: "#1042", customer: "Acme Inc.", amount: "$840.00", status: "open" },
    { id: "inv-1043", number: "#1043", customer: "Globex", amount: "$3,150.00", status: "overdue" },
    { id: "inv-1044", number: "#1044", customer: "Initech", amount: "$420.00", status: "paid" },
    { id: "inv-1045", number: "#1045", customer: "Soylent", amount: "$2,000.00", status: "open" },
]

const statusIntent = { paid: "success", open: "info", overdue: "danger" } as const

const columns: DataTableColumn<Invoice>[] = [
    { accessorKey: "number", header: "Invoice" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "amount", header: "Amount", align: "end" },
    {
        accessorKey: "status",
        header: "Status",
        align: "end",
        cell: (row) => (
            <Badge intent={statusIntent[row.status]} variant="soft">
                {row.status}
            </Badge>
        ),
    },
]

/** Controlled multi-selection driving a bulk-action toolbar. */
export function Demo() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(["inv-1042"])

    return (
        <div className="space-y-3">
            {selectedKeys.length > 0 ? (
                <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
                    <span className="text-sm text-muted-foreground">
                        {selectedKeys.length} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="soft">
                            Send reminder
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedKeys([])}>
                            <XIcon />
                            Clear
                        </Button>
                    </div>
                </div>
            ) : null}

            <DataTable
                data={invoices}
                columns={columns}
                getRowId="id"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectedKeysChange={setSelectedKeys}
            />
        </div>
    )
}
