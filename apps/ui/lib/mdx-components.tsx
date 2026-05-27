/**
 * @fileoverview Shared MDX component overrides — composes Fumadocs defaults
 * with any Saasflare UI primitives we want to expose inside MDX.
 * @module apps/ui/lib/mdx-components
 */
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type {MDXComponents} from 'mdx/types';

/**
 * Resolve the components MDX should use when rendering. Pages can spread
 * their own additions on top.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        ...components,
    };
}
