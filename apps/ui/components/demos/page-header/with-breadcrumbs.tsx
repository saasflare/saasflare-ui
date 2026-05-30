"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Button,
    PageHeader,
} from "@saasflare/ui"

/** A page header with breadcrumbs and multiple actions. */
export function Demo() {
    return (
        <PageHeader
            className="w-full"
            breadcrumbs={
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Billing</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
            title="Billing"
            description="Manage your subscription and payment methods."
            actions={
                <>
                    <Button variant="outline">Cancel plan</Button>
                    <Button>Upgrade</Button>
                </>
            }
        />
    )
}
