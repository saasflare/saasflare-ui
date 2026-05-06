// @toreview
import { defineConfig } from 'tsup';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Prepend "use client"; to every bundled JS output so Next.js treats the
 * bundle as a Client Component boundary. esbuild strips module-level directives
 * during bundling, so we cannot rely on tsup's `banner` option.
 *
 * Walks dist/ recursively so subpath entries (dist/entries/*) receive the
 * directive too — non-recursive readdir would silently skip them and leave
 * the chart/carousel imports without an RSC boundary.
 */
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

async function prependUseClient(): Promise<void> {
    const files = await walkJsFiles('dist');
    await Promise.all(
        files.map(async (path) => {
            const src = await readFile(path, 'utf8');
            if (src.startsWith('"use client"')) return;
            await writeFile(path, `"use client";\n${src}`);
        }),
    );
}

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/entries/chart.ts',
        'src/entries/carousel.ts',
    ],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: false,
    clean: true,
    external: ['react', 'react-dom'],
    treeshake: true,
    onSuccess: prependUseClient,
});
