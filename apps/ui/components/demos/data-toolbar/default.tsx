"use client"

import {
    Button,
    DataToolbar,
    DataToolbarActions,
    DataToolbarFilters,
    DataToolbarSearch,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@saasflare/ui"

/** A data-view toolbar with search, a filter, and bulk actions. */
export function Demo() {
    return (
        <DataToolbar className="w-full">
            <DataToolbarSearch>
                <Input placeholder="Search users…" />
            </DataToolbarSearch>
            <DataToolbarFilters>
                <Select defaultValue="all">
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="invited">Invited</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </DataToolbarFilters>
            <DataToolbarActions>
                <Button variant="outline" size="sm">
                    Export
                </Button>
                <Button size="sm">Add user</Button>
            </DataToolbarActions>
        </DataToolbar>
    )
}
