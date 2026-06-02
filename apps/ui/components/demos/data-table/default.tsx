import { DataTable, Badge, type DataTableColumn } from "@saasflare/ui"

interface Member {
    id: string
    name: string
    email: string
    role: "Owner" | "Admin" | "Member"
    status: "active" | "invited"
}

const members: Member[] = [
    { id: "u1", name: "Ada Lovelace", email: "ada@saasflare.io", role: "Owner", status: "active" },
    { id: "u2", name: "Grace Hopper", email: "grace@saasflare.io", role: "Admin", status: "active" },
    { id: "u3", name: "Alan Turing", email: "alan@saasflare.io", role: "Member", status: "invited" },
    { id: "u4", name: "Katherine Johnson", email: "kat@saasflare.io", role: "Member", status: "active" },
]

const columns: DataTableColumn<Member>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
        accessorKey: "status",
        header: "Status",
        align: "end",
        cell: (row) => (
            <Badge intent={row.status === "active" ? "success" : "neutral"} variant="soft">
                {row.status === "active" ? "Active" : "Invited"}
            </Badge>
        ),
    },
]

/** Zero-config table: typed columns + data, no wiring required. */
export function Demo() {
    return <DataTable data={members} columns={columns} getRowId="id" />
}
