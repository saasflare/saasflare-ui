"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@saasflare/ui"

/** A product navigation bar with rich dropdown panels. */
export function Demo() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-72 gap-1">
                            <li>
                                <NavigationMenuLink href="#">
                                    <span className="font-medium">Analytics</span>
                                    <span className="text-muted-foreground">
                                        Real-time usage and conversion metrics.
                                    </span>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href="#">
                                    <span className="font-medium">Automations</span>
                                    <span className="text-muted-foreground">
                                        Trigger workflows from any event.
                                    </span>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-72 gap-1">
                            <li>
                                <NavigationMenuLink href="#">
                                    <span className="font-medium">Documentation</span>
                                    <span className="text-muted-foreground">
                                        Guides, API reference, and examples.
                                    </span>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink href="#">
                                    <span className="font-medium">Changelog</span>
                                    <span className="text-muted-foreground">
                                        What shipped this week.
                                    </span>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink
                        href="#"
                        className="inline-flex h-9 items-center px-4 font-medium"
                    >
                        Pricing
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
