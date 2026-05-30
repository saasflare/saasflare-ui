/**
 * @fileoverview Shared MDX component overrides — composes Fumadocs defaults
 * with any Saasflare UI primitives we want to expose inside MDX.
 * @module apps/ui/lib/mdx-components
 */
import defaultMdxComponents from 'fumadocs-ui/mdx';
import {Tab, Tabs} from 'fumadocs-ui/components/tabs';
import {TypeTable} from 'fumadocs-ui/components/type-table';
import type {MDXComponents} from 'mdx/types';
import {ComponentPreview} from '@/components/docs/component-preview';
import {PropsTable} from '@/components/docs/props-table';
import {Installation} from '@/components/docs/installation';

/**
 * Resolve the components MDX should use when rendering. Pages can spread
 * their own additions on top. Saasflare doc primitives (ComponentPreview,
 * PropsTable, Installation) and common Fumadocs blocks are exposed globally so
 * generated component pages can use them without per-file imports.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        Tab,
        Tabs,
        TypeTable,
        ComponentPreview,
        PropsTable,
        Installation,
        ...components,
    };
}
