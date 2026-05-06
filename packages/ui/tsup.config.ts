// @toreview
import { defineConfig } from 'tsup';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Prepend "use client"; to every bundled JS output so Next.js treats the
 * bundle as a Client Component boundary. esbuild strips module-level directives
 * during bundling, so we cannot rely on tsup's `banner` option.
 */
async function prependUseClient(): Promise<void> {
    const dist = 'dist';
    const files = await readdir(dist);
    await Promise.all(
        files
            .filter((f) => f.endsWith('.mjs') || f.endsWith('.js'))
            .map(async (f) => {
                const path = join(dist, f);
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
