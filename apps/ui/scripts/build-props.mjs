#!/usr/bin/env node
/**
 * Extract a props/API table for every @saasflare/ui component using
 * react-docgen-typescript, and emit apps/ui/public/props.json keyed by
 * component name. Consumed by the <PropsTable> MDX component on the docs site.
 *
 * Filtering: a prop is kept when it is declared in our own source
 * (packages/ui) or has no parent file (cva VariantProps — `variant`, `size`,
 * …). Props inherited from node_modules (the ~280 DOM/React attributes,
 * Radix internals) are dropped so the table shows only meaningful API.
 *
 * Run from apps/ui:   node scripts/build-props.mjs
 */

import { withCompilerOptions } from "react-docgen-typescript"
import { readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs"
import path from "node:path"

const APP_ROOT = path.resolve(process.cwd())
const PKG_ROOT = path.resolve(APP_ROOT, "../../packages/ui")
const COMPONENTS_DIR = path.join(PKG_ROOT, "src/components/ui")
const OUT = path.join(APP_ROOT, "public/props.json")

const BLOCKLIST = new Set(["index", "icons", "direction", "motion-config"])
const PKG_SRC = path.join(PKG_ROOT, "src") + path.sep

const parser = withCompilerOptions(
    { esModuleInterop: true, jsx: 4 /* react-jsx */, skipLibCheck: true },
    {
        savePropValueAsString: true,
        shouldExtractLiteralValuesFromEnum: true,
        shouldRemoveUndefinedFromOptional: true,
        propFilter: (prop) => {
            const file = prop.parent?.fileName
            if (!file) return true // cva VariantProps (variant/size/…)
            if (file.includes("node_modules")) return false // DOM/React/Radix
            return file.includes(`${path.sep}packages${path.sep}ui${path.sep}`)
        },
    },
)

function cleanType(t) {
    if (!t) return "—"
    let name = t.name
    if (name === "enum" && Array.isArray(t.value)) {
        name = t.value.map((v) => v.value).join(" | ")
    }
    // Collapse the verbose ReactNode union to something readable.
    return name.replace(/\s+/g, " ").trim()
}

function serializeProps(props) {
    return Object.values(props)
        .map((p) => ({
            name: p.name,
            type: cleanType(p.type),
            required: p.required ?? false,
            default: p.defaultValue?.value ?? null,
            description: (p.description || "").replace(/\s+/g, " ").trim(),
        }))
        .sort((a, b) => {
            // Required first, then alphabetical.
            if (a.required !== b.required) return a.required ? -1 : 1
            return a.name.localeCompare(b.name)
        })
}

function main() {
    const files = readdirSync(COMPONENTS_DIR)
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => f.replace(/\.tsx$/, ""))
        .filter((n) => !BLOCKLIST.has(n))
        .sort()

    const out = {}
    let totalComponents = 0
    let totalProps = 0
    const warnings = []

    for (const name of files) {
        const file = path.join(COMPONENTS_DIR, `${name}.tsx`)
        let parsed
        try {
            parsed = parser.parse(file)
        } catch (err) {
            warnings.push(`${name}: parse failed — ${err.message}`)
            continue
        }
        const components = parsed
            // Drop the interface-as-component artifacts (0 props) and the
            // *Props type echoes react-docgen sometimes surfaces.
            .filter((c) => Object.keys(c.props || {}).length > 0)
            .map((c) => ({
                name: c.displayName,
                description: (c.description || "").split("\n")[0].trim(),
                props: serializeProps(c.props),
            }))
            .filter((c) => c.props.length > 0)

        if (components.length === 0) continue
        out[name] = components
        totalComponents += components.length
        totalProps += components.reduce((n, c) => n + c.props.length, 0)
    }

    if (!existsSync(path.dirname(OUT))) mkdirSync(path.dirname(OUT), { recursive: true })
    writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n")
    console.log(`✓ props for ${Object.keys(out).length} files / ${totalComponents} components / ${totalProps} props`)
    console.log(`✓ → ${OUT}`)
    if (warnings.length) {
        console.log(`\n⚠ ${warnings.length} warning(s):`)
        for (const w of warnings) console.log(`  - ${w}`)
    }
}

main()
