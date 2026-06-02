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

// Public exports that live outside src/components/ui/*.tsx and are missed by
// the auto-discovery scan below. This is a BUILD-time import only — it crosses
// the package boundary into apps/ui/scripts but never runs in a consumer.
import { ORPHANS } from "../../../apps/ui/scripts/orphans.mjs"

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

    // Internal helpers + the `../ui` component barrel — all live under the
    // published package entry. (Orphans in composed/ and brand/ import the ui
    // barrel as `../ui`; scanned components never have a sibling named `ui`.)
    if (
        INTERNAL_RE.test(spec) ||
        base === "ui" ||
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

function buildItem(name, surface, curated, warnings, srcPathAbs) {
    const rawSrc = readFileSync(srcPathAbs ?? join(COMPONENTS_DIR, `${name}.tsx`), "utf-8")
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
    // Orphans supply their own title + description (deps are still derived from
    // real imports, exactly as for the scanned items).
    for (const o of ORPHANS) {
        if (!curatedByName.has(o.slug)) {
            curatedByName.set(o.slug, { name: o.slug, title: o.title, description: o.description })
        }
    }

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

    // Orphan exports that live outside the scanned dir. buildItem reads from an
    // absolute path; the slug is still the registry name and the copied file's
    // target stays flat (its imports are rewritten to @saasflare/ui).
    for (const o of ORPHANS) {
        const curated = curatedByName.get(o.slug)
        if (curated) curatedCount++
        const built = buildItem(o.slug, surface, curated, warnings, resolve(PKG_ROOT, o.srcPath))

        // A barrel entry (sidebar/index.ts) only re-exports sibling modules that
        // aren't themselves shipped as registry items. Inline those siblings into
        // a single content blob and drop the phantom registryDependencies they
        // would otherwise produce.
        if (o.bundleFrom?.length) {
            const dir = dirname(resolve(PKG_ROOT, o.srcPath))
            const inlined = o.bundleFrom
                .map((base) => buildItem(base, surface, undefined, warnings, join(dir, `${base}.tsx`)))
            const bundled = new Set(o.bundleFrom)
            // Once the siblings share one file, their cross-references (e.g.
            // layout/menu importing `./context`) become same-file bindings, so
            // drop the now-dangling intra-bundle import statements.
            const intraBundleImport = new RegExp(
                `^\\s*import[\\s\\S]*?from\\s*["']\\.\\/(?:${o.bundleFrom.join("|")})["'];?\\s*$`,
                "gm",
            )
            const mergedContent = inlined
                .map((it) => it.files[0].content.replace(intraBundleImport, "").trimEnd())
                .join("\n")
            built.files[0].content = mergedContent

            // Aggregate deps + registryDeps from the bundled siblings, then drop
            // any registryDependency that is satisfied by an inlined sibling.
            const deps = new Set(built.dependencies ?? [])
            const registryDeps = new Set(
                (built.registryDependencies ?? []).filter((d) => !bundled.has(d)),
            )
            for (const it of inlined) {
                for (const d of it.dependencies ?? []) deps.add(d)
                for (const d of it.registryDependencies ?? []) {
                    if (!bundled.has(d)) registryDeps.add(d)
                }
            }
            if (deps.size) built.dependencies = [...deps].sort()
            else delete built.dependencies
            if (registryDeps.size) built.registryDependencies = [...registryDeps].sort()
            else delete built.registryDependencies
        }

        writeJson(join(OUT_DIR, `${o.slug}.json`), built)
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
