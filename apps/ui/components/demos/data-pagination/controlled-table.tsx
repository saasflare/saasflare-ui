"use client"

import { useState } from "react"

import {
    Badge,
    DataPagination,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@saasflare/ui"

interface Member {
    name: string
    email: string
    role: string
    status: "Active" | "Invited"
}

const MEMBERS: Member[] = [
    { name: "Ada Lovelace", email: "ada@saasflare.io", role: "Owner", status: "Active" },
    { name: "Grace Hopper", email: "grace@saasflare.io", role: "Admin", status: "Active" },
    { name: "Alan Turing", email: "alan@saasflare.io", role: "Admin", status: "Active" },
    { name: "Katherine Johnson", email: "katherine@saasflare.io", role: "Editor", status: "Active" },
    { name: "Margaret Hamilton", email: "margaret@saasflare.io", role: "Editor", status: "Invited" },
    { name: "Edsger Dijkstra", email: "edsger@saasflare.io", role: "Viewer", status: "Active" },
    { name: "Barbara Liskov", email: "barbara@saasflare.io", role: "Viewer", status: "Invited" },
    { name: "Donald Knuth", email: "donald@saasflare.io", role: "Editor", status: "Active" },
    { name: "Tim Berners-Lee", email: "tim@saasflare.io", role: "Admin", status: "Active" },
    { name: "Linus Torvalds", email: "linus@saasflare.io", role: "Viewer", status: "Invited" },
]

/**
 * DataPagination as the footer of a `Table`: slice a local array by
 * `page`/`pageSize`. Changing the page size clamps the active page — the
 * `onPageSizeChange` handler resets to page 1 so the slice never goes out of range.
 */
export function Demo() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(4)

    const start = (page - 1) * pageSize
    const rows = MEMBERS.slice(start, start + pageSize)

    return (
        <div className="flex flex-col gap-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((member) => (
                        <TableRow key={member.email}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{member.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {member.email}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="soft"
                                    intent={member.status === "Active" ? "success" : "neutral"}
                                >
                                    {member.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <DataPagination
                total={MEMBERS.length}
                pageSize={pageSize}
                page={page}
                showSummary
                showPageSize
                pageSizeOptions={[4, 6, 8]}
                labels={{ summary: ({ from, to, total }) => `${from}–${to} of ${total} members` }}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setPage(1)
                }}
            />
        </div>
    )
}
