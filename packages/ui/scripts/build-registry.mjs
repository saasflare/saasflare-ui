#!/usr/bin/env node
/**
 * Build the shadcn registry. Reads packages/ui/registry.json, inlines
 * each item's source files, and emits one JSON per item plus a
 * top-level index JSON into apps/ui/public/r/ so they're served at
 * https://ui.saasflare.io/r/<name>.json.
 *
 * Run from packages/ui:   pnpm build:registry
 *
 * Consumers install via:  npx shadcn add https://ui.saasflare.io/r/feature-card.json
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, "..")
const APP_PUBLIC = resolve(PKG_ROOT, "../../apps/ui/public")
const OUT_DIR = join(APP_PUBLIC, "r")
const REGISTRY_FILE = join(PKG_ROOT, "registry.json")

const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"

function readJson(path) {
    return JSON.parse(readFileSync(path, "utf-8"))
}

function writeJson(path, data) {
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n")
}

// Rewrite imports so the copied file compiles in the consumer's project.
// Saasflare components import internal helpers via deep relative paths
// ("../../lib", "../../providers", "./phosphor", "./motion-config"); these
// all live under the published "@saasflare/ui" package surface, so we
// redirect every internal relative import to the package entry. Imports
// to npm packages (motion, react, @radix-ui/*, etc.) pass through.
const INTERNAL_REWRITES = [
    [/from\s+["']\.\.\/\.\.\/lib(?:\/[^"']*)?["']/g, 'from "@saasflare/ui"'],
    [/from\s+["']\.\.\/\.\.\/providers(?:\/[^"']*)?["']/g, 'from "@saasflare/ui"'],
    [/from\s+["']\.\.\/\.\.\/hooks(?:\/[^"']*)?["']/g, 'from "@saasflare/ui"'],
    [/from\s+["']\.\.\/\.\.\/types(?:\/[^"']*)?["']/g, 'from "@saasflare/ui"'],
    [/from\s+["']\.\/phosphor(?:\/[^"']*)?["']/g, 'from "@saasflare/ui"'],
    [/from\s+["']\.\/motion-config["']/g, 'from "@saasflare/ui"'],
    [/from\s+["']\.\/icons["']/g, 'from "@saasflare/ui"'],
]

function rewriteImports(source) {
    let out = source
    for (const [pattern, replacement] of INTERNAL_REWRITES) {
        out = out.replace(pattern, replacement)
    }
    return out
}

function loadFileContent(itemFile) {
    const absolute = join(PKG_ROOT, itemFile.path)
    if (!existsSync(absolute)) {
        throw new Error(`Registry item references missing file: ${itemFile.path}`)
    }
    return rewriteImports(readFileSync(absolute, "utf-8"))
}

function buildItem(item, registryHomepage) {
    const files = item.files.map((f) => ({
        path: f.target ?? f.path,
        type: f.type,
        content: loadFileContent(f),
        ...(f.target ? { target: f.target } : {}),
    }))

    return {
        $schema: ITEM_SCHEMA,
        name: item.name,
        type: item.type,
        title: item.title,
        description: item.description,
        ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
        ...(item.devDependencies?.length ? { devDependencies: item.devDependencies } : {}),
        ...(item.registryDependencies?.length
            ? { registryDependencies: item.registryDependencies }
            : {}),
        files,
        $meta: { source: `${registryHomepage}/r/${item.name}.json` },
    }
}

function main() {
    const registry = readJson(REGISTRY_FILE)
    if (!Array.isArray(registry.items) || registry.items.length === 0) {
        console.error("registry.json has no items.")
        process.exit(1)
    }

    rmSync(OUT_DIR, { recursive: true, force: true })
    mkdirSync(OUT_DIR, { recursive: true })

    let count = 0
    for (const item of registry.items) {
        const built = buildItem(item, registry.homepage)
        writeJson(join(OUT_DIR, `${item.name}.json`), built)
        count++
    }

    // Top-level index: list every item with its absolute URL so a single
    // fetch tells consumers everything that exists.
    const index = {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        name: registry.name,
        homepage: registry.homepage,
        items: registry.items.map(({ name, type, title, description }) => ({
            name,
            type,
            title,
            description,
            url: `${registry.homepage}/r/${name}.json`,
        })),
    }
    writeJson(join(APP_PUBLIC, "registry.json"), index)

    console.log(`✓ built ${count} registry item${count === 1 ? "" : "s"} → ${OUT_DIR}`)
    console.log(`✓ index → ${join(APP_PUBLIC, "registry.json")}`)
}

main()
