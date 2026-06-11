// @toreview
import { defineConfig } from 'tsup';
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
    entry: [
        'src/index.ts',
        'src/entries/calendar.ts',
        'src/entries/carousel.ts',
        'src/entries/chart.ts',
        'src/entries/command.ts',
        'src/entries/drawer.ts',
        'src/entries/input-otp.ts',
        'src/entries/resizable.ts',
    ],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: false,
    clean: true,
    external: ['react', 'react-dom'],
    // sonner must stay EXTERNAL: inlining it (noExternal) duplicates its
    // module-level ToastState, so consumers' toast() calls land in a different
    // singleton than the rendered <Toaster> and never show up.
    treeshake: true,
    onSuccess: injectUseClient,
});
