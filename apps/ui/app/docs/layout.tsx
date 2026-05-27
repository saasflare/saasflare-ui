/**
 * @fileoverview Docs section layout — wraps MDX pages in Fumadocs DocsLayout.
 * @module apps/ui/app/docs/layout
 */
import {DocsLayout} from 'fumadocs-ui/layouts/docs';
import {RootProvider} from 'fumadocs-ui/provider/next';
import type {ReactNode} from 'react';
import {baseOptions} from '@/lib/layout.shared';
import {source} from '@/lib/source';

/**
 * Layout for the /docs subtree.
 *
 * Theme provider is disabled because SaasflareShell (in the root layout)
 * already controls the `.dark` class — letting Fumadocs mount its own
 * provider would fight ours.
 */
export default function Layout({children}: {children: ReactNode}) {
    return (
        <RootProvider theme={{enabled: false}}>
            <DocsLayout tree={source.pageTree} {...baseOptions()}>
                {children}
            </DocsLayout>
        </RootProvider>
    );
}
