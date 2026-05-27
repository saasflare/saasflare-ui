/**
 * @fileoverview Creates the saasflare-ui MCP server instance. Registers
 * 8 tools + 4 resources that expose the component catalog to AI agents.
 *
 * @module apps/ui/lib/mcp/server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { loadCatalog, type Catalog } from "./catalog"
import { scoreItems } from "./search"

/** JSON helper — collapses to a single `text` content block. */
function jsonResult(value: unknown) {
    return {
        content: [
            {
                type: "text" as const,
                text: JSON.stringify(value, null, 2),
            },
        ],
    }
}

function textResult(value: string) {
    return {
        content: [{ type: "text" as const, text: value }],
    }
}

function installUrl(name: string, catalog: Catalog): string {
    return `${catalog.homepage}/r/${name}.json`
}

/**
 * Build a fresh `McpServer` ready to be connected to a transport.
 *
 * The server is stateless per-request; the underlying catalog is cached
 * via {@link loadCatalog}. Re-creating the server per request is cheap
 * because all the heavy lifting is the catalog load.
 */
export async function createSaasflareMcpServer(): Promise<McpServer> {
    const catalog = await loadCatalog()
    const server = new McpServer(
        {
            name: "saasflare-ui",
            version: "1.0.0",
            title: "saasflare-ui catalog",
        },
        {
            instructions:
                "Access the saasflare-ui component library — 116 React components, 32 hooks, 20 palettes. " +
                "Use `list_components` to discover, `search_components` for keyword queries, " +
                "`get_component` for full source + props, `recommend_for_use_case` for plain-English prompts " +
                "(e.g. 'build a SaaS pricing page'), and `get_install_command` for the `npx shadcn add` line. " +
                "Components are pulled into the consumer's project via the shadcn-compatible registry at " +
                `${catalog.homepage}/registry.json — but the runtime context (providers, motion, types) ` +
                "ships via `@saasflare/ui` on npm.",
        },
    )

    /* ─── Tools ───────────────────────────────────────────────────────── */

    server.registerTool(
        "list_components",
        {
            title: "List components",
            description:
                "List every component shipped in the saasflare-ui registry. Optional `search` for a quick filter.",
            inputSchema: {
                search: z.string().optional().describe("Optional substring filter against name/title/description."),
            },
        },
        async ({ search }) => {
            const items = catalog.index.items
            if (!search) return jsonResult(items)
            const ranked = scoreItems(items, search).slice(0, 50)
            return jsonResult(ranked)
        },
    )

    server.registerTool(
        "get_component",
        {
            title: "Get component",
            description:
                "Return the full registry item for a single component: TypeScript source, prop interface, install URL, dependencies. Use this when you're about to write or paste code that uses the component.",
            inputSchema: {
                name: z.string().describe("Component slug (e.g. 'feature-card', 'progress-circle')."),
            },
        },
        async ({ name }) => {
            const item = catalog.items.get(name)
            if (!item) {
                return textResult(
                    `Component "${name}" not found. Use list_components to discover available names.`,
                )
            }
            return jsonResult({
                name: item.name,
                title: item.title,
                description: item.description,
                type: item.type,
                dependencies: item.dependencies ?? [],
                registryDependencies: item.registryDependencies ?? [],
                installUrl: installUrl(item.name, catalog),
                installCommand: `npx shadcn add ${installUrl(item.name, catalog)}`,
                files: item.files,
            })
        },
    )

    server.registerTool(
        "search_components",
        {
            title: "Search components",
            description:
                "Keyword/fuzzy search across component names, titles, and descriptions. Returns ranked matches with a relevance score.",
            inputSchema: {
                query: z.string().min(1).describe("Free-text query, e.g. 'date input', 'pricing', 'chart'."),
                limit: z
                    .number()
                    .int()
                    .positive()
                    .max(50)
                    .optional()
                    .describe("Max results. Default 10."),
            },
        },
        async ({ query, limit }) => {
            const ranked = scoreItems(catalog.index.items, query).slice(0, limit ?? 10)
            return jsonResult(ranked)
        },
    )

    server.registerTool(
        "recommend_for_use_case",
        {
            title: "Recommend components for a use case",
            description:
                "Given a plain-English prompt (e.g. 'I'm building a SaaS pricing page'), return the saasflare-ui components most likely to be useful. Uses the same scorer as search_components but also surfaces the install commands so the agent can immediately tell the user what to install.",
            inputSchema: {
                prompt: z.string().min(3).describe("Natural-language description of what the user is building."),
                limit: z.number().int().positive().max(20).optional().describe("Max suggestions. Default 8."),
            },
        },
        async ({ prompt, limit }) => {
            const ranked = scoreItems(catalog.index.items, prompt).slice(0, limit ?? 8)
            return jsonResult(
                ranked.map((r) => ({
                    name: r.name,
                    title: r.title,
                    description: r.description,
                    relevance: r.relevance,
                    matchedTerms: r.matchedTerms,
                    installCommand: `npx shadcn add ${installUrl(r.name, catalog)}`,
                })),
            )
        },
    )

    server.registerTool(
        "get_install_command",
        {
            title: "Get install command",
            description:
                "Return the exact `npx shadcn add` command for a component, plus the `pnpm add @saasflare/ui` runtime install if the consumer hasn't done it yet.",
            inputSchema: {
                name: z.string().describe("Component slug."),
            },
        },
        async ({ name }) => {
            if (!catalog.items.has(name)) {
                return textResult(
                    `Component "${name}" not found. Use list_components to discover available names.`,
                )
            }
            return jsonResult({
                runtime: "pnpm add @saasflare/ui",
                component: `npx shadcn add ${installUrl(name, catalog)}`,
                note: "The runtime install is one-time. Add as many components as you want via the per-component command — the source lands in components/ui/.",
            })
        },
    )

    server.registerTool(
        "list_palettes",
        {
            title: "List palettes",
            description:
                "List every brand palette shipped with saasflare-ui. Switch palettes at runtime by setting `<html data-palette='id'>`.",
            inputSchema: {},
        },
        async () => jsonResult(catalog.palettes),
    )

    server.registerTool(
        "get_palette",
        {
            title: "Get palette",
            description:
                "Return the OKLCH tokens for a single palette: --primary-h/c/l plus optional --neutral axes. Useful when an agent generates a custom theme based on saasflare's primitives.",
            inputSchema: {
                id: z.string().describe("Palette id (e.g. 'colorful', 'ocean', 'saasflare')."),
            },
        },
        async ({ id }) => {
            const palette = catalog.palettes.find((p) => p.id === id)
            if (!palette) {
                return textResult(
                    `Palette "${id}" not found. Available: ${catalog.palettes
                        .map((p) => p.id)
                        .join(", ")}`,
                )
            }
            return jsonResult(palette)
        },
    )

    server.registerTool(
        "list_hooks",
        {
            title: "List hooks",
            description:
                "List every hook exported from `@saasflare/ui`. Useful when an AI prompt asks for 'a debounce hook' or 'a clipboard hook' — point the consumer to saasflare's hook instead of reinventing.",
            inputSchema: {},
        },
        async () => jsonResult(catalog.hooks),
    )

    /* ─── Resources ───────────────────────────────────────────────────── */

    server.registerResource(
        "registry",
        "saasflare://registry",
        {
            title: "Component registry index",
            description: "The top-level registry.json listing every available component.",
            mimeType: "application/json",
        },
        async () => ({
            contents: [
                {
                    uri: "saasflare://registry",
                    mimeType: "application/json",
                    text: JSON.stringify(catalog.index, null, 2),
                },
            ],
        }),
    )

    server.registerResource(
        "llms",
        "saasflare://llms",
        {
            title: "llms-full.txt",
            description:
                "Full LLM-friendly reference: every component with prop interface + an @example block.",
            mimeType: "text/markdown",
        },
        async () => ({
            contents: [
                {
                    uri: "saasflare://llms",
                    mimeType: "text/markdown",
                    text: catalog.llmsFull,
                },
            ],
        }),
    )

    // Per-component resource — a stable URI for clients that prefer bookmarks.
    for (const [name, item] of catalog.items) {
        server.registerResource(
            `component-${name}`,
            `saasflare://component/${name}`,
            {
                title: item.title,
                description: item.description,
                mimeType: "application/json",
            },
            async () => ({
                contents: [
                    {
                        uri: `saasflare://component/${name}`,
                        mimeType: "application/json",
                        text: JSON.stringify(
                            {
                                ...item,
                                installUrl: installUrl(name, catalog),
                            },
                            null,
                            2,
                        ),
                    },
                ],
            }),
        )
    }

    // Per-palette resource.
    for (const palette of catalog.palettes) {
        server.registerResource(
            `palette-${palette.id}`,
            `saasflare://palette/${palette.id}`,
            {
                title: `${palette.name} palette`,
                description: `OKLCH brand axis: H=${palette.primaryH}, C=${palette.primaryC}, L=${palette.primaryL}`,
                mimeType: "application/json",
            },
            async () => ({
                contents: [
                    {
                        uri: `saasflare://palette/${palette.id}`,
                        mimeType: "application/json",
                        text: JSON.stringify(palette, null, 2),
                    },
                ],
            }),
        )
    }

    return server
}
