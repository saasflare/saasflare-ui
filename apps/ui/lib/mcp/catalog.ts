/**
 * @fileoverview Single source of truth for the MCP server's catalog data.
 * Loads the artifacts the `build:registry` and `build:llms` scripts in
 * `packages/ui` already emit — no parallel data store, no schema duplication.
 *
 * @module apps/ui/lib/mcp/catalog
 */

import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"

/* ─── Types ───────────────────────────────────────────────────────────── */

export interface RegistryIndexItem {
    name: string
    type: string
    title: string
    description: string
    url: string
}

export interface RegistryIndex {
    name: string
    homepage: string
    items: RegistryIndexItem[]
}

export interface RegistryItemFile {
    path: string
    type: string
    content: string
    target?: string
}

export interface RegistryItem {
    name: string
    type: string
    title: string
    description: string
    dependencies?: string[]
    registryDependencies?: string[]
    files: RegistryItemFile[]
}

export interface PaletteEntry {
    id: string
    name: string
    primaryH: number
    primaryC: number
    primaryL: number
    neutralH?: number
    neutralC?: number
    description?: string
}

export interface HookEntry {
    name: string
    description: string
}

export interface Catalog {
    /** Path to apps/ui/public — the served static root. */
    publicDir: string
    /** Resolved homepage (e.g. `https://ui.saasflare.io`). */
    homepage: string
    /** Top-level index. */
    index: RegistryIndex
    /** Per-component full registry items, keyed by name. */
    items: Map<string, RegistryItem>
    /** Full llms-full.txt body. */
    llmsFull: string
    /** Concise llms.txt body. */
    llms: string
    /** Parsed palettes (from packages/ui/styles/palettes.css). */
    palettes: PaletteEntry[]
    /** Hook names + descriptions (from packages/ui/src/hooks/*.ts). */
    hooks: HookEntry[]
}

/* ─── Loading ─────────────────────────────────────────────────────────── */

const APP_ROOT = path.resolve(process.cwd())
const PUBLIC_DIR = path.join(APP_ROOT, "public")
const PALETTES_CSS = path.resolve(APP_ROOT, "../../packages/ui/styles/palettes.css")
const HOOKS_DIR = path.resolve(APP_ROOT, "../../packages/ui/src/hooks")

async function safeReadJson<T>(p: string): Promise<T | null> {
    if (!existsSync(p)) return null
    const raw = await readFile(p, "utf-8")
    return JSON.parse(raw) as T
}

async function safeReadText(p: string): Promise<string> {
    if (!existsSync(p)) return ""
    return readFile(p, "utf-8")
}

/** Parse OKLCH triple definitions out of `palettes.css` so the MCP server
 * can answer `list_palettes` / `get_palette` without owning a separate
 * data file. Robust to the existing comment-block format used in that file. */
async function parsePalettes(cssPath: string): Promise<PaletteEntry[]> {
    if (!existsSync(cssPath)) return []
    const css = await readFile(cssPath, "utf-8")
    const out: PaletteEntry[] = []
    // Match either single-line or multi-line :root[data-palette="id"] { ... } blocks.
    const blockRe =
        /:root\[data-palette="([a-z0-9-]+)"\](?!\.dark)\s*\{([^}]*)\}/gi
    let match: RegExpExecArray | null
    while ((match = blockRe.exec(css))) {
        const [, id, body] = match
        const get = (token: string): number | undefined => {
            const m = body.match(new RegExp(`--${token}\\s*:\\s*([0-9.]+)`))
            return m ? Number(m[1]) : undefined
        }
        const primaryH = get("primary-h")
        const primaryC = get("primary-c")
        const primaryL = get("primary-l")
        if (primaryH === undefined || primaryC === undefined || primaryL === undefined) continue
        // Skip duplicate ids (chart-overrides re-mention `colorful`, `ink`, etc.)
        if (out.find((p) => p.id === id)) continue
        out.push({
            id,
            name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " "),
            primaryH,
            primaryC,
            primaryL,
            neutralH: get("neutral-h"),
            neutralC: get("neutral-c"),
        })
    }
    return out
}

/** Enumerate hooks from the source directory + extract their one-line
 * description from the JSDoc `@fileoverview` block. */
async function loadHooks(hooksDir: string): Promise<HookEntry[]> {
    if (!existsSync(hooksDir)) return []
    const { readdir } = await import("node:fs/promises")
    const files = await readdir(hooksDir)
    const out: HookEntry[] = []
    for (const file of files) {
        if (!file.endsWith(".ts") || file.endsWith(".d.ts")) continue
        const name = file.replace(/\.ts$/, "")
        const src = await readFile(path.join(hooksDir, file), "utf-8")
        const overview = src.match(/@fileoverview\s+([^\n]+(?:\n\s*\*\s+[^\n@]+)*)/)
        const description = overview
            ? overview[1]
                  .split("\n")
                  .map((l) => l.replace(/^\s*\*\s?/, "").trim())
                  .join(" ")
                  .replace(/\.$/, "")
                  .trim()
            : ""
        out.push({ name, description })
    }
    return out.sort((a, b) => a.name.localeCompare(b.name))
}

let cached: Catalog | null = null
let cachedAt = 0
const CACHE_TTL_MS = 30_000 // re-read every 30s in case the build pipeline rewrote artifacts

/**
 * Load (and cache) the entire catalog from the public/ artifacts.
 * Throws if the registry index is missing — that's an unrecoverable misconfig.
 */
export async function loadCatalog(): Promise<Catalog> {
    if (cached && Date.now() - cachedAt < CACHE_TTL_MS) return cached

    const index = await safeReadJson<RegistryIndex>(
        path.join(PUBLIC_DIR, "registry.json"),
    )
    if (!index) {
        throw new Error(
            "MCP catalog: apps/ui/public/registry.json not found. Run `pnpm --filter @saasflare/ui build:registry`.",
        )
    }

    const items = new Map<string, RegistryItem>()
    for (const entry of index.items) {
        const item = await safeReadJson<RegistryItem>(
            path.join(PUBLIC_DIR, "r", `${entry.name}.json`),
        )
        if (item) items.set(entry.name, item)
    }

    const [llmsFull, llms, palettes, hooks] = await Promise.all([
        safeReadText(path.join(PUBLIC_DIR, "llms-full.txt")),
        safeReadText(path.join(PUBLIC_DIR, "llms.txt")),
        parsePalettes(PALETTES_CSS),
        loadHooks(HOOKS_DIR),
    ])

    cached = {
        publicDir: PUBLIC_DIR,
        homepage: index.homepage,
        index,
        items,
        llmsFull,
        llms,
        palettes,
        hooks,
    }
    cachedAt = Date.now()
    return cached
}

/** Force a re-read on the next `loadCatalog()` call. */
export function invalidateCatalog(): void {
    cached = null
    cachedAt = 0
}
