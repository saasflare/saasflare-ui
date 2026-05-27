/**
 * @fileoverview MDX page renderer — resolves /docs/:slug to a content/docs MDX file.
 * @module apps/ui/app/docs/[[...slug]]/page
 */
import {DocsBody, DocsDescription, DocsPage, DocsTitle} from 'fumadocs-ui/page';
import {notFound} from 'next/navigation';
import {source} from '@/lib/source';
import {getMDXComponents} from '@/lib/mdx-components';

interface PageProps {
    params: Promise<{slug?: string[]}>;
}

/**
 * Render a single docs page resolved from the slug.
 */
export default async function Page({params}: PageProps) {
    const {slug} = await params;
    const page = source.getPage(slug);
    if (!page) notFound();

    const MDXContent = page.data.body;

    return (
        <DocsPage toc={page.data.toc} full={page.data.full}>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                <MDXContent components={getMDXComponents()} />
            </DocsBody>
        </DocsPage>
    );
}

/**
 * Static params for pre-rendering at build time.
 */
export function generateStaticParams() {
    return source.generateParams();
}

/**
 * Per-page metadata.
 */
export async function generateMetadata({params}: PageProps) {
    const {slug} = await params;
    const page = source.getPage(slug);
    if (!page) return {};
    return {
        title: page.data.title,
        description: page.data.description,
    };
}
