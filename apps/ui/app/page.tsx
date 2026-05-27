// @reviewed 2026-05-15
/**
 * @fileoverview Root entry — redirects to the catalog. The actual component
 * matrix lives at `/catalog`.
 */
import { redirect } from "next/navigation"

export default function Root() {
    redirect("/catalog")
}
