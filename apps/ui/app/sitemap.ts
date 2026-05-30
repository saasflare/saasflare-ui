/**
 * @fileoverview Sitemap — enumerates the landing page, catalog, doc guides, and
 * every generated component page (read from content/docs/components at build).
 */
import type { MetadataRoute } from "next"
import { existsSync, readdirSync } from "node:fs"
import path from "node:path"
import { SITE_URL } from "../lib/site"

/** Top-level guide slugs under /docs (mirrors content/docs/meta.json). */
const GUIDES = ["getting-started", "installation", "theming", "ai"] as const

/** Read component doc slugs from the generated MDX directory. */
function componentSlugs(): string[] {
    const dir = path.join(process.cwd(), "content/docs/components")
    if (!existsSync(dir)) return []
    return readdirSync(dir)
        .filter((f) => f.endsWith(".mdx") && f !== "index.mdx")
        .map((f) => f.replace(/\.mdx$/, ""))
}

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = ["", "/catalog", "/docs", "/docs/components"]
    const guideRoutes = GUIDES.map((g) => `/docs/${g}`)
    const componentRoutes = componentSlugs().map((s) => `/docs/components/${s}`)

    return [...staticRoutes, ...guideRoutes, ...componentRoutes].map((route) => ({
        url: `${SITE_URL}${route}`,
        changeFrequency: "weekly",
        priority: route === "" ? 1 : route.startsWith("/docs/components/") ? 0.6 : 0.8,
    }))
}
