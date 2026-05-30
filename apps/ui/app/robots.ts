/**
 * @fileoverview robots.txt — allow indexing of everything except the API
 * routes, and point crawlers at the sitemap.
 */
import type { MetadataRoute } from "next"
import { SITE_URL } from "../lib/site"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/api/",
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
