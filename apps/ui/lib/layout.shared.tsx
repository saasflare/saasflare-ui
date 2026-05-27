/**
 * @fileoverview Shared Fumadocs layout options — nav, links, branding.
 * @module apps/ui/lib/layout.shared
 */
import type {BaseLayoutProps} from 'fumadocs-ui/layouts/shared';

/**
 * Base layout options shared between Docs and Home layouts.
 */
export function baseOptions(): BaseLayoutProps {
    return {
        nav: {
            title: 'Saasflare UI',
        },
        githubUrl: 'https://github.com/saasflare/saasflare-ui',
    };
}
