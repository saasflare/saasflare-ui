// @toreview
import { defineConfig } from 'tsup';
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Per-file `'use client'` directives in source document INTENT (which files
 * couple to client-only APIs). esbuild strips them during bundling because
 * chunks merge code from multiple sources, so we re-inject directives at the
 * dist level — but only into chunks that actually contain client coupling.
 *
 * Heuristic: a chunk needs `"use client"` iff its bundled output references
 * Radix primitives, React state/effect hooks, browser APIs, or any of the
 * client-only peer libraries (motion, next-themes, sonner, vaul, cmdk, etc.).
 * Pure-presentational chunks (Empty, Spinner, Skeleton wrappers, brand/*,
 * pure cards) ship without the directive and stay RSC-eligible.
 *
 * Walks dist/ recursively so subpath entries (dist/entries/*) and shared
 * chunks all get inspected.
 */

const CLIENT_LIBS = [
    '@radix-ui/react-',
    'motion/react',
    'next-themes',
    'cmdk',
    'vaul',
    'react-day-picker',
    'embla-carousel-react',
    'recharts',
    'react-resizable-panels',
    'input-otp',
    'sonner',
    'react-hook-form',
];

const CLIENT_LIB_PATTERN = new RegExp(
    `(?:from\\s*["']|require\\s*\\(\\s*["'])(?:${CLIENT_LIBS.map((l) =>
        l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    ).join('|')})`,
);

const CLIENT_PATTERNS: RegExp[] = [
    CLIENT_LIB_PATTERN,
    /\buseState\s*\(/,
    /\buseEffect\s*\(/,
    /\buseLayoutEffect\s*\(/,
    /\buseRef\s*\(/,
    /\buseReducer\s*\(/,
    /\buseContext\s*\(/,
    /\bcreateContext\s*\(/,
    /\buseId\s*\(/,
    /\buseImperativeHandle\s*\(/,
    /\buseSyncExternalStore\s*\(/,
];

function chunkNeedsClient(content: string): boolean {
    return CLIENT_PATTERNS.some((re) => re.test(content));
}

async function walkJsFiles(dir: string): Promise<string[]> {
    const out: string[] = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...(await walkJsFiles(path)));
        } else if (entry.name.endsWith('.mjs') || entry.name.endsWith('.js')) {
            out.push(path);
        }
    }
    return out;
}

async function injectUseClient(): Promise<void> {
    const files = await walkJsFiles('dist');
    let added = 0;
    let skipped = 0;
    await Promise.all(
        files.map(async (path) => {
            const src = await readFile(path, 'utf8');
            if (src.startsWith('"use client"') || src.startsWith("'use client'")) {
                return;
            }
            if (chunkNeedsClient(src)) {
                await writeFile(path, `"use client";\n${src}`);
                added++;
            } else {
                skipped++;
            }
        }),
    );
    console.log(`[use-client] ${added} chunks marked client, ${skipped} stayed RSC-safe`);
}

export default defineConfig({
    /**
     * BUNDLELESS ("per-module") output: every source file compiles to its own
     * dist module; the path-extensions plugin externalizes relative imports
     * and rewrites them to real file paths (.mjs/.js, directory → /index.*).
     * Why not a bundled barrel:
     *   1. RSC granularity — a bundled entry carries ONE "use client" for all
     *      exports; per-file output lets injectUseClient mark only modules
     *      with client coupling, keeping cn/PALETTES/presentational modules
     *      server-eligible.
     *   2. Tree-shaking — consumer bundlers prune per module (the bundled
     *      barrel retained ~131 KB minified for a cn-only import).
     *   3. Peer confinement — react-hook-form / react-day-picker imports stay
     *      inside form/date-picker modules instead of the shared entry chunk.
     */
    entry: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/*.test.*'],
    format: ['cjs', 'esm'],
    // Declarations come from `tsc -p tsconfig.build.json` (see build script):
    // rollup-based dts across ~250 entries is prohibitively slow.
    dts: false,
    splitting: false,
    sourcemap: false,
    clean: true,
    external: ['react', 'react-dom'],
    // sonner must stay EXTERNAL: inlining it (noExternal) duplicates its
    // module-level ToastState, so consumers' toast() calls land in a different
    // singleton than the rendered <Toaster> and never show up.
    esbuildPlugins: [
        esbuildPluginFilePathExtensions({ esmExtension: 'mjs', cjsExtension: 'js' }),
    ],
    onSuccess: injectUseClient,
});
