#!/usr/bin/env node
/**
 * Build llms.txt and llms-full.txt from the shadcn registry and from
 * the component source files' JSDoc. Output lands in apps/ui/public so
 * it's served at https://ui.saasflare.io/llms.txt and llms-full.txt.
 *
 * llms.txt          — concise index (per llmstxt.org spec)
 * llms-full.txt     — every registry item expanded with prop signatures
 *                     and an @example block ripped from the source
 *
 * Run from packages/ui:   pnpm build:llms
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, "..")
const APP_PUBLIC = resolve(PKG_ROOT, "../../apps/ui/public")
const REGISTRY_FILE = join(PKG_ROOT, "registry.json")

const registry = JSON.parse(readFileSync(REGISTRY_FILE, "utf-8"))
const HOMEPAGE = registry.homepage

// Pull every @example block from a source file and return the first
// (most representative) one. JSDoc @example blocks are LLM-readable
// usage samples — exactly what codegen tools want to grok.
function firstExample(source) {
    // Stop on: another @tag line, OR the block's closing */ — but NOT on
    // JSX self-closes like ` * />` which embed a literal slash.
    const match = source.match(/@example[\s\S]*?\n([\s\S]*?)(?=\n\s*\*\/|\n\s*\*\s*@)/)
    if (!match) return null
    return match[1]
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, ""))
        .join("\n")
        .trim()
}

// Pull every exported prop interface so the LLM sees the type contract
// without having to parse the whole .tsx.
function extractPropsInterface(source, componentName) {
    const ifaceName = `${componentName}Props`
    const re = new RegExp(
        `(?:export\\s+)?interface\\s+${ifaceName}[\\s\\S]*?\\n\\}`,
        "m",
    )
    const match = source.match(re)
    return match ? match[0].trim() : null
}

function toPascalCase(kebab) {
    return kebab
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("")
}

function buildLlmsTxt() {
    const lines = []
    lines.push("# saasflare-ui")
    lines.push("")
    lines.push(
        "> Production-ready React UI library for Next.js + Tailwind v4. 100+ components, 20 palettes, copy-paste registry, 3-axis variant system (variant × intent × size), animated by default via Framer Motion.",
    )
    lines.push("")
    lines.push(
        "Two installation paths: install the npm package once for the runtime (`pnpm add @saasflare/ui`), then optionally pull individual component source code into your project via the shadcn-compatible registry — so AI codegen tools (v0, Lovable, Bolt, Cursor, Claude) can read and rewrite the source.",
    )
    lines.push("")

    lines.push("## Docs")
    lines.push("")
    lines.push(`- [README](${HOMEPAGE}): library overview, installation, theming primer`)
    lines.push(
        `- [llms-full.txt](${HOMEPAGE}/llms-full.txt): every registry component expanded with props, types, and an example`,
    )
    lines.push(
        `- [Registry index](${HOMEPAGE}/registry.json): JSON manifest of every component available via \`npx shadcn add\``,
    )
    lines.push(
        `- [MCP endpoint](${HOMEPAGE}/api/mcp): remote MCP server — wire into Claude Code / Cursor / Claude Desktop to query the catalog live`,
    )
    lines.push("")

    lines.push("## Components (registry)")
    lines.push("")
    for (const item of registry.items) {
        const url = `${HOMEPAGE}/r/${item.name}.json`
        lines.push(`- [${item.title}](${url}): ${item.description}`)
    }
    lines.push("")

    lines.push("## Theming")
    lines.push("")
    lines.push(
        `- [Palettes](${HOMEPAGE}/docs/theming/palettes): 20 presets switched via \`<html data-palette="…">\`. Includes a special \`colorful\` palette with a pastel-gradient hover identity.`,
    )
    lines.push(
        `- [Surfaces](${HOMEPAGE}/docs/theming/surfaces): \`flat\` and \`glass\` material variants, switched via \`<html data-style="…">\`.`,
    )
    lines.push(
        `- [Custom palette runtime API](${HOMEPAGE}/docs/theming/custom): pass a hex/OKLCH primary to \`<SaasflareProvider palette={{ name, primary }} />\` and the whole token chain rederives.`,
    )
    lines.push("")

    lines.push("## Install per component")
    lines.push("")
    lines.push("```bash")
    lines.push("# Install the runtime (providers, context, motion bundle) once:")
    lines.push("pnpm add @saasflare/ui")
    lines.push("")
    lines.push("# Then pull source into your project per component:")
    lines.push(`npx shadcn add ${HOMEPAGE}/r/feature-card.json`)
    lines.push(`npx shadcn add ${HOMEPAGE}/r/pricing-card.json`)
    lines.push("```")
    lines.push("")

    return lines.join("\n") + "\n"
}

function buildLlmsFullTxt() {
    const lines = []
    lines.push("# saasflare-ui — full reference")
    lines.push("")
    lines.push(
        `Generated from \`packages/ui/registry.json\`. Each section quotes the component's full prop interface and one @example block lifted from its source. The canonical machine-readable form is \`${HOMEPAGE}/registry.json\`.`,
    )
    lines.push("")
    lines.push("---")
    lines.push("")

    for (const item of registry.items) {
        // registry.json is a metadata-only overlay now; derive the source path
        // from the component name (matches build-registry's component dir).
        const sourcePath = join(PKG_ROOT, "src/components/ui", `${item.name}.tsx`)
        if (!existsSync(sourcePath)) continue
        const source = readFileSync(sourcePath, "utf-8")
        const componentName = toPascalCase(item.name)
        const propsIface = extractPropsInterface(source, componentName)
        const example = firstExample(source)
        const url = `${HOMEPAGE}/r/${item.name}.json`

        lines.push(`## ${item.title}`)
        lines.push("")
        lines.push(`**Description:** ${item.description}`)
        lines.push("")
        lines.push(`**Install:**`)
        lines.push("")
        lines.push("```bash")
        lines.push(`npx shadcn add ${url}`)
        lines.push("```")
        lines.push("")

        if (propsIface) {
            lines.push(`**Props:**`)
            lines.push("")
            lines.push("```ts")
            lines.push(propsIface)
            lines.push("```")
            lines.push("")
        }

        if (example) {
            lines.push(`**Example:**`)
            lines.push("")
            lines.push("```tsx")
            lines.push(example)
            lines.push("```")
            lines.push("")
        }

        lines.push("---")
        lines.push("")
    }

    return lines.join("\n") + "\n"
}

function main() {
    mkdirSync(APP_PUBLIC, { recursive: true })
    const llms = buildLlmsTxt()
    const llmsFull = buildLlmsFullTxt()
    writeFileSync(join(APP_PUBLIC, "llms.txt"), llms)
    writeFileSync(join(APP_PUBLIC, "llms-full.txt"), llmsFull)
    console.log(`✓ llms.txt          → ${join(APP_PUBLIC, "llms.txt")}  (${llms.length} bytes)`)
    console.log(
        `✓ llms-full.txt     → ${join(APP_PUBLIC, "llms-full.txt")}  (${llmsFull.length} bytes)`,
    )
}

main()
