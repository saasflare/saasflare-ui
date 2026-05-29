#!/usr/bin/env node
/**
 * Build the shadcn registry for @saasflare/ui.
 *
 * Auto-discovers every public component under src/components/ui, derives its
 * npm + registry dependencies from its *real* imports (JSDoc @example blocks
 * are stripped before analysis), rewrites internal imports so the copied file
 * compiles in a consumer project, and emits one JSON per item plus a top-level
 * index into apps/ui/public/r/ — served at https://ui.saasflare.io/r/<name>.json.
 *
 * registry.json is no longer the source of truth for *which* items exist; it is
 * a curated metadata overlay (title / description / dependency overrides) keyed
 * by component name. Anything it doesn't mention still ships, with a title and
 * description derived from the file's JSDoc.
 *
 * Run from packages/ui:   pnpm build:registry
 * Consumers install via:  npx shadcn add https://ui.saasflare.io/r/feature-card.json
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, "..")
const APP_PUBLIC = resolve(PKG_ROOT, "../../apps/ui/public")
const OUT_DIR = join(APP_PUBLIC, "r")
const REGISTRY_FILE = join(PKG_ROOT, "registry.json")
const COMPONENTS_REL = "src/components/ui"
const COMPONENTS_DIR = join(PKG_ROOT, COMPONENTS_REL)

const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"
const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json"

// Infra / non-component modules that live alongside components but are not
// installable UI units. They reach consumers via the @saasflare/ui package.
const BLOCKLIST = new Set(["index", "icons", "direction", "motion-config"])

// Bare specifiers that are always provided by the consumer's app and never
// belong in a registry item's dependency list.
const IMPLICIT = new Set(["react", "react-dom"])

function readJson(path) {
    return JSON.parse(readFileSync(path, "utf-8"))
}

function writeJson(path, data) {
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n")
}

function titleCase(name) {
    return name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
}

/** Strip block + line comments so JSDoc @example imports don't count as deps. */
function stripComments(src) {
    return src
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1")
}

/** Every module specifier in `from "x"` and side-effect `import "x"`. */
function extractSpecifiers(src) {
    const out = new Set()
    const fromRe = /\bfrom\s*["']([^"']+)["']/g
    const sideRe = /(?:^|[;{\n])\s*import\s*["']([^"']+)["']/g
    let m
    while ((m = fromRe.exec(src))) out.add(m[1])
    while ((m = sideRe.exec(src))) out.add(m[1])
    return [...out]
}

/**
 * First sentence of the leading prose in a JSDoc block, used as a fallback
 * blurb. Only the prose *before* the first @tag is considered, so @example
 * code never leaks into a description.
 */
function deriveDescription(rawSrc, title) {
    const block = rawSrc.match(/\/\*\*([\s\S]*?)\*\//)
    if (block) {
        const prose = []
        for (const raw of block[1].split("\n")) {
            const line = raw.replace(/^\s*\*\s?/, "").trim()
            if (line.startsWith("@")) break // stop at first tag (@example, @param, …)
            if (line) prose.push(line)
        }
        const text = prose.join(" ").trim()
        if (text) {
            const sentence = text.split(/\.(?:\s|$)/)[0].trim()
            if (sentence) return sentence + "."
        }
    }
    return `${title} component.`
}

/** npm package name for a bare specifier ("motion/react" → "motion"). */
function packageName(spec) {
    if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/")
    return spec.split("/")[0]
}

const INTERNAL_RE = /(?:^|\/)(lib|providers|hooks|types)(\/|$)/

/**
 * Discover the set of module basenames reachable through the package's public
 * surface, so a sibling import like `./button` can be rewritten to the package
 * entry instead of a dangling relative path in the consumer's tree.
 */
function loadExportSurface() {
    const mainBarrel = new Set()
    const collect = (relFile, re, transform) => {
        const file = join(PKG_ROOT, relFile)
        if (!existsSync(file)) return
        const src = readFileSync(file, "utf-8")
        let m
        while ((m = re.exec(src))) mainBarrel.add(transform(m[1]))
    }
    // `export … from "./button"` in the ui barrel.
    collect(`${COMPONENTS_REL}/index.ts`, /\bfrom\s*["']\.\/([a-z0-9-]+)["']/g, (x) => x)
    // `export … from "./components/composed/foo"` in the root barrel.
    collect("src/index.ts", /\bfrom\s*["']\.\/components\/[a-z0-9/-]+?\/([a-z0-9-]+)["']/g, (x) => x)

    // Subpath exports (`@saasflare/ui/calendar`) from package.json.
    const pkg = readJson(join(PKG_ROOT, "package.json"))
    const subpaths = new Set(
        Object.keys(pkg.exports ?? {})
            .filter((k) => /^\.\/[a-z0-9-]+$/.test(k))
            .map((k) => k.slice(2)),
    )
    return { mainBarrel, subpaths }
}

/**
 * Classify one specifier into a dependency, a registry dependency, and/or an
 * import rewrite. `surface` is the package's public export surface.
 */
function classify(spec, surface) {
    if (IMPLICIT.has(spec)) return {}

    if (!spec.startsWith(".")) {
        if (spec === "@saasflare/ui" || spec.startsWith("@saasflare/ui/")) {
            return { dep: "@saasflare/ui" }
        }
        return { dep: packageName(spec) }
    }

    const base = spec.split("/").pop()

    // Internal helpers — all live under the published package entry.
    if (
        INTERNAL_RE.test(spec) ||
        base === "motion-config" ||
        base === "icons" ||
        spec.includes("phosphor")
    ) {
        return { dep: "@saasflare/ui", rewrite: [spec, "@saasflare/ui"] }
    }

    // Sibling component re-exported from the main barrel.
    if (surface.mainBarrel.has(base)) {
        return { dep: "@saasflare/ui", rewrite: [spec, "@saasflare/ui"] }
    }
    // Sibling component exposed via a package subpath.
    if (surface.subpaths.has(base)) {
        return { dep: "@saasflare/ui", rewrite: [spec, `@saasflare/ui/${base}`] }
    }
    // Unresolved sibling — ship it as a separate registry item.
    return { registryDep: base }
}

function applyRewrites(source, rewrites) {
    let out = source
    for (const [from, to] of rewrites) {
        out = out
            .replaceAll(`"${from}"`, `"${to}"`)
            .replaceAll(`'${from}'`, `'${to}'`)
    }
    return out
}

function buildItem(name, surface, curated, warnings) {
    const rawSrc = readFileSync(join(COMPONENTS_DIR, `${name}.tsx`), "utf-8")
    // Dependencies come from real code only (JSDoc @example imports stripped),
    // but rewrites apply to every specifier — including those that appear only
    // inside @example blocks — so copied files never ship a misleading import.
    const realSpecs = new Set(extractSpecifiers(stripComments(rawSrc)))
    const allSpecs = extractSpecifiers(rawSrc)

    const deps = new Set()
    const registryDeps = new Set()
    const rewrites = []
    for (const spec of allSpecs) {
        const r = classify(spec, surface)
        if (r.rewrite) rewrites.push(r.rewrite)
        if (!realSpecs.has(spec)) continue
        if (r.dep) deps.add(r.dep)
        if (r.registryDep) registryDeps.add(r.registryDep)
    }

    // Warn on a dependency that isn't declared by the package — usually a typo
    // or a missing entry in package.json that would break `shadcn add`.
    const pkg = readJson(join(PKG_ROOT, "package.json"))
    const known = new Set([
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
        "@saasflare/ui",
    ])
    for (const d of deps) {
        if (!known.has(d)) warnings.push(`${name}: dependency "${d}" not in package.json`)
    }

    const title = curated?.title ?? titleCase(name)
    const description = curated?.description ?? deriveDescription(rawSrc, title)
    // Dependencies are always derived from real imports — curated lists drifted
    // (e.g. omitted "motion"), so they only supply title + description now.
    const dependencies = [...deps].sort()
    const registryDependencies = [...registryDeps].sort()

    const content = applyRewrites(rawSrc, rewrites)

    return {
        $schema: ITEM_SCHEMA,
        name,
        type: "registry:ui",
        title,
        description,
        ...(dependencies.length ? { dependencies } : {}),
        ...(registryDependencies.length ? { registryDependencies } : {}),
        files: [
            {
                path: `components/ui/${name}.tsx`,
                type: "registry:ui",
                content,
                target: `components/ui/${name}.tsx`,
            },
        ],
        $meta: { source: `https://ui.saasflare.io/r/${name}.json` },
    }
}

function main() {
    const registry = readJson(REGISTRY_FILE)
    const curatedByName = new Map(
        (registry.items ?? []).map((item) => [item.name, item]),
    )

    const surface = loadExportSurface()

    const names = readdirSync(COMPONENTS_DIR)
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => f.replace(/\.tsx$/, ""))
        .filter((n) => !BLOCKLIST.has(n))
        .sort()

    rmSync(OUT_DIR, { recursive: true, force: true })
    mkdirSync(OUT_DIR, { recursive: true })

    const warnings = []
    const items = []
    let curatedCount = 0
    for (const name of names) {
        const curated = curatedByName.get(name)
        if (curated) curatedCount++
        const built = buildItem(name, surface, curated, warnings)
        writeJson(join(OUT_DIR, `${name}.json`), built)
        items.push(built)
    }

    // Verify every registryDependency resolves to an emitted item.
    const emitted = new Set(items.map((i) => i.name))
    for (const item of items) {
        for (const dep of item.registryDependencies ?? []) {
            if (!emitted.has(dep)) {
                warnings.push(`${item.name}: registryDependency "${dep}" has no registry item`)
            }
        }
    }

    const index = {
        $schema: REGISTRY_SCHEMA,
        name: registry.name,
        homepage: registry.homepage,
        items: items.map(({ name, type, title, description }) => ({
            name,
            type,
            title,
            description,
            url: `${registry.homepage}/r/${name}.json`,
        })),
    }
    writeJson(join(APP_PUBLIC, "registry.json"), index)

    console.log(`✓ built ${items.length} registry items → ${OUT_DIR}`)
    console.log(`  ${curatedCount} curated, ${items.length - curatedCount} auto-derived`)
    console.log(`✓ index → ${join(APP_PUBLIC, "registry.json")}`)
    if (warnings.length) {
        console.log(`\n⚠ ${warnings.length} warning(s):`)
        for (const w of warnings) console.log(`  - ${w}`)
    }
}

main()
