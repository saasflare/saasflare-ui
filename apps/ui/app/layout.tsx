// @reviewed 2026-04-19
/**
 * @fileoverview Root layout for the Saasflare UI catalog.
 * @module apps/ui/app/layout
 */
import type {Metadata} from 'next';
import './globals.css';
import {SaasflareShell, ScrollToTopButton, ThemeModeToggle, TopLoadingBar} from "@saasflare/ui";
import {fontVariables} from "@saasflare/ui/fonts/distinctive";

/**
 * Metadata for the Saasflare UI catalog.
 */
export const metadata: Metadata = {
    title: 'Saasflare UI – Component Catalog',
    description: 'Explore the Saasflare design system and component library.',
    applicationName: 'Saasflare UI',
    keywords: ['saasflare', 'ui', 'design system', 'component library'],
    authors: [{name: 'Saasflare™'}],
};

/**
 * Root layout for the Saasflare UI catalog.
 * @param param0
 * @param param0.children
 * @constructor
 */
export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <SaasflareShell theme="dark" palette="achromatic" surface="flat" className={fontVariables} animated smoothScrolling>
            <TopLoadingBar/>
            <ThemeModeToggle/>
            {children}
            <ScrollToTopButton/>
        </SaasflareShell>
    );
}
