#!/usr/bin/env node
/**
 * Generate one MDX page per @saasflare/ui component under
 * content/docs/components/, plus a grouped meta.json that drives the sidebar.
 *
 * Each page gets: frontmatter (title/description from the registry), an
 * <Installation> block, a <ComponentPreview> for every demo found in
 * components/demos/<name>/, and a <PropsTable> API reference.
 *
 * Sources of truth:
 *   - apps/ui/public/registry.json      → title + description
 *   - apps/ui/components/demos/<name>/*  → preview examples
 *   - CATEGORIES (below)                 → sidebar grouping (validated against
 *                                          the registry so nothing is missed)
 *
 * Run from apps/ui:   node scripts/build-doc-pages.mjs
 */

import {
    readFileSync,
    writeFileSync,
    readdirSync,
    existsSync,
    mkdirSync,
    rmSync,
    statSync,
} from "node:fs"
import path from "node:path"

import { ORPHANS } from "./orphans.mjs"

const APP_ROOT = path.resolve(process.cwd())
const REGISTRY_INDEX = path.join(APP_ROOT, "public/registry.json")
const DEMOS_DIR = path.join(APP_ROOT, "components/demos")
const OUT_DIR = path.join(APP_ROOT, "content/docs/components")

/** Sidebar grouping. Every registry component must appear exactly once; the
 *  script asserts this so a new component can't silently fall out of the nav. */
const CATEGORIES = {
    "Brand & Auth": ["social-auth-button", "theme-mode-toggle", "theme-mode-multi-toggle"],
    "Buttons & Actions": [
        "button", "button-group", "social-button", "shimmer-button", "moving-border",
        "stateful-button", "scroll-to-top-button",
    ],
    "Forms & Inputs": [
        "input", "textarea", "input-group", "native-select", "select", "checkbox", "radio-group",
        "switch", "slider", "label", "field", "form", "number-input", "tag-input", "rating",
        "input-otp", "date-picker", "date-range-picker", "calendar", "combobox", "multi-select",
        "search-field", "dropzone", "toggle", "toggle-group",
    ],
    "Data Display": [
        "table", "data-table", "badge", "avatar", "user-avatar", "card", "stat-card", "metric-card",
        "feature-card", "pricing-card", "testimonial-card", "team-card", "section-card",
        "spotlight-card", "item", "kbd", "code-block", "tree-view", "data-toolbar", "empty",
        "empty-state", "bento-grid", "page-header", "settings-section",
    ],
    "Data Visualization": [
        "chart", "bar-list", "category-bar", "tracker", "spark-chart", "progress",
        "progress-circle", "countdown",
    ],
    Feedback: [
        "alert", "alert-dialog", "callout", "dialog", "drawer", "sheet", "sonner", "tooltip",
        "animated-tooltip", "hover-card", "popover", "notification-center", "skeleton", "spinner",
        "top-loading-bar",
    ],
    Navigation: [
        "breadcrumb", "pagination", "data-pagination", "tabs", "navigation-menu", "menubar",
        "dropdown-menu", "context-menu", "command", "steps", "stepper", "dock", "sidebar",
    ],
    Layout: ["accordion", "collapsible", "separator", "scroll-area", "resizable", "aspect-ratio", "carousel"],
    Media: [
        "audio-player", "gallery-lightbox", "hero-video-dialog", "device-mock", "image-swap-hover",
        "compare", "hotspot",
    ],
    "Effects & Motion": [
        "aurora-background", "border-beam", "blur-fade", "confetti", "flip-words", "glowing-effect",
        "gradient-text", "marquee", "mouse-gradient-blob", "page-transition", "parallax-section",
        "particles-background", "retro-grid", "reveal-on-scroll", "sticky-scroll-reveal",
        "text-generate-effect", "timeline", "tracing-beam", "typewriter-text",
    ],
}

function titleCase(s) {
    return s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

function escapeYaml(s) {
    return `"${String(s).replace(/"/g, '\\"')}"`
}

function demoExamplesFor(name) {
    const dir = path.join(DEMOS_DIR, name)
    if (!existsSync(dir) || !statSync(dir).isDirectory()) return []
    return readdirSync(dir)
        .filter((f) => f.endsWith(".tsx"))
        .map((f) => f.replace(/\.tsx$/, ""))
        .sort((a, b) => (a === "default" ? -1 : b === "default" ? 1 : a.localeCompare(b)))
}

function pageBody(item, examples) {
    const lines = [
        "---",
        `title: ${escapeYaml(item.title)}`,
        `description: ${escapeYaml(item.description)}`,
        "---",
        "",
        "## Installation",
        "",
        `<Installation name="${item.name}" />`,
        "",
    ]
    if (examples.length) {
        for (const ex of examples) {
            const heading = ex === "default" ? "Usage" : titleCase(ex)
            lines.push(`## ${heading}`, "", `<ComponentPreview name="${item.name}/${ex}" />`, "")
        }
    } else {
        lines.push(
            "## Usage",
            "",
            "> Interactive examples for this component are on the way. The full API is documented below.",
            "",
        )
    }
    lines.push("## API Reference", "", `<PropsTable name="${item.name}" />`, "")
    return lines.join("\n")
}

function main() {
    const index = JSON.parse(readFileSync(REGISTRY_INDEX, "utf-8"))
    const byName = new Map(index.items.map((i) => [i.name, i]))
    const allNames = new Set(byName.keys())

    // ── Validate categorization coverage ──────────────────────────────────
    const categorized = Object.values(CATEGORIES).flat()
    const seen = new Set()
    const dupes = []
    for (const n of categorized) {
        if (seen.has(n)) dupes.push(n)
        seen.add(n)
    }
    const missing = [...allNames].filter((n) => !seen.has(n))
    const unknown = categorized.filter((n) => !allNames.has(n))
    if (dupes.length || missing.length || unknown.length) {
        console.error("✗ category coverage problem:")
        if (dupes.length) console.error("  duplicated:", dupes.join(", "))
        if (missing.length) console.error("  uncategorized components:", missing.join(", "))
        if (unknown.length) console.error("  categories reference unknown components:", unknown.join(", "))
        process.exit(1)
    }

    // Each orphan must land in the CATEGORIES bucket its manifest declares, so
    // the manifest stays the single source of truth for orphan placement.
    const misplaced = ORPHANS.filter((o) => !(CATEGORIES[o.category] ?? []).includes(o.slug))
    if (misplaced.length) {
        console.error("✗ orphan category mismatch:")
        for (const o of misplaced) {
            console.error(`  ${o.slug}: manifest category "${o.category}" does not list it`)
        }
        process.exit(1)
    }

    // ── Emit pages ─────────────────────────────────────────────────────────
    rmSync(OUT_DIR, { recursive: true, force: true })
    mkdirSync(OUT_DIR, { recursive: true })

    let withDemos = 0
    for (const [name, item] of byName) {
        const examples = demoExamplesFor(name)
        if (examples.length) withDemos++
        writeFileSync(path.join(OUT_DIR, `${name}.mdx`), pageBody(item, examples))
    }

    // ── Components overview (index of the section) ─────────────────────────
    const overview = [
        "---",
        "title: Components",
        `description: ${escapeYaml(`${byName.size} composable, themeable components — every one installable via the shadcn registry.`)}`,
        "---",
        "",
        `**${byName.size} components**, grouped below. Each is installable with \`npx shadcn add\` and fully themeable through the Saasflare design tokens.`,
        "",
    ]
    for (const [label, names] of Object.entries(CATEGORIES)) {
        overview.push(`## ${label}`, "")
        for (const n of [...names].sort()) {
            const it = byName.get(n)
            overview.push(`- [${it.title}](/docs/components/${n}) — ${it.description}`)
        }
        overview.push("")
    }
    writeFileSync(path.join(OUT_DIR, "index.mdx"), overview.join("\n"))

    // ── meta.json: grouped sidebar via "---Label---" separators ────────────
    const pages = ["index"]
    for (const [label, names] of Object.entries(CATEGORIES)) {
        pages.push(`---${label}---`)
        pages.push(...[...names].sort())
    }
    writeFileSync(
        path.join(OUT_DIR, "meta.json"),
        JSON.stringify({ title: "Components", pages }, null, 2) + "\n",
    )

    console.log(`✓ ${byName.size} component pages (${withDemos} with live demos) → ${OUT_DIR}`)
    console.log(`✓ grouped meta.json with ${Object.keys(CATEGORIES).length} categories`)
}

main()
