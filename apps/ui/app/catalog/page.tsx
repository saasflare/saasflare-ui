// @reviewed 2026-05-15
/**
 * @fileoverview Server Component entry for the catalog page. Reads the
 * persisted header prefs from the `sf-catalog-prefs` cookie and hands them to
 * the client-side catalog so the toolbar renders with the right selection on
 * the very first paint — no localStorage round-trip, no opacity gate, no
 * hydration flicker.
 */

import { cookies } from "next/headers"
import { CATALOG_PREFS_KEY, parseCatalogPrefs } from "@/lib/catalog-prefs"
import CatalogClient from "./page-client"

export default async function Page() {
    const raw = (await cookies()).get(CATALOG_PREFS_KEY)?.value
    return <CatalogClient initialPrefs={parseCatalogPrefs(raw)} />
}
