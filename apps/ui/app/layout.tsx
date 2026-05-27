// @reviewed 2026-05-26
/**
 * @fileoverview Root layout for the Saasflare UI catalog.
 * @module apps/ui/app/layout
 *
 * Architecture: SaasflareShell does NOT bake the cookie prefs as static props
 * — those would lock the SaasflareProvider's `currentPalette = palette ??
 * persisted.palette` chain so the live `persisted` value (driven by the
 * catalog's runtime toggles) could never win. Instead:
 *
 *   1. `<SaasflareScript>` in the head applies the cookie-read prefs to
 *      <html data-*> SYNCHRONOUSLY before paint — FOUC-free SSR.
 *   2. The Shell receives only `theme` (next-themes seed) and `storageKey`
 *      pointing at the catalog's blob — so `SaasflareProvider`'s
 *      `useLocalStorage` reads/syncs from the SAME key the catalog writes.
 *   3. When the catalog's `setPrefs` writes the new blob, the `sf-ls:` custom
 *      event from `use-local-storage.ts` fires on the same tab, the Shell's
 *      hook re-reads, `persisted` updates, the Shell's data-* effect re-fires,
 *      and the SaasflareThemeContext + AnimationContext propagate to every
 *      consumer below. All seven axes go live.
 */
import type { Metadata } from "next"
import { cookies } from "next/headers"
import "./globals.css"
import { SaasflareShell, SaasflareScript, ScrollToTopButton, TopLoadingBar } from "@saasflare/ui"
import { fontVariables } from "@saasflare/ui/fonts/distinctive"
import { CATALOG_PREFS_KEY, parseCatalogPrefs, resolveDark } from "../lib/catalog-prefs"

export const metadata: Metadata = {
    title: "Saasflare UI – Component Catalog",
    description: "Explore the Saasflare design system and component library.",
    applicationName: "Saasflare UI",
    keywords: ["saasflare", "ui", "design system", "component library"],
    authors: [{ name: "Saasflare™" }],
}

/**
 * Pre-hydration script for `scroll-behavior` only. The four Saasflare axes
 * (palette / style / radius / animated) are handled by `<SaasflareScript>`
 * rendered below; this script just covers smooth-scroll which isn't part of
 * the SaasflareScript surface.
 */
const SMOOTH_SCROLL_PREHYDRATE_SCRIPT = `(function(){try{var raw=document.cookie.match(/(?:^|; )sf-catalog-prefs=([^;]+)/);if(!raw)return;var p=JSON.parse(decodeURIComponent(raw[1]));if(typeof p.smoothScrolling==="boolean")document.documentElement.style.scrollBehavior=p.smoothScrolling?"smooth":"auto";}catch(e){}})();`

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const raw = (await cookies()).get(CATALOG_PREFS_KEY)?.value
    const prefs = parseCatalogPrefs(raw)
    const htmlClassName = resolveDark(prefs.themeMode)
        ? `${fontVariables} dark`
        : fontVariables

    return (
        <SaasflareShell
            theme={prefs.themeMode}
            storageKey={CATALOG_PREFS_KEY}
            className={htmlClassName}
            head={
                <>
                    <script
                        dangerouslySetInnerHTML={{ __html: SMOOTH_SCROLL_PREHYDRATE_SCRIPT }}
                    />
                    <SaasflareScript
                        palette={prefs.palette}
                        surface={prefs.surface}
                        radius={prefs.radius}
                        animated={prefs.animated}
                        storageKey={CATALOG_PREFS_KEY}
                    />
                </>
            }
        >
            <TopLoadingBar />
            {children}
            <ScrollToTopButton />
        </SaasflareShell>
    )
}
