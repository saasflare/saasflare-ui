/**
 * @fileoverview Marketing landing page for ui.saasflare.io.
 *
 * Compact two-zone layout (HeroUI/shadcn density): the hero IS the theme
 * playground, the proof section folds breadth + differentiators + install
 * into one screen. Composed entirely from `@saasflare/ui` primitives so the
 * page is itself the proof of the design system. Version and component count
 * are read at build time from the package + registry — they cannot go stale.
 */
import type { Metadata } from "next"
import pkg from "@saasflare/ui/package.json"
import registry from "../public/registry.json"
import { Cta } from "../components/landing/cta"
import { Footer } from "../components/landing/footer"
import { HeroPlayground } from "../components/landing/hero-playground"
import { LandingNav } from "../components/landing/landing-nav"
import { Proof } from "../components/landing/proof"

export const metadata: Metadata = {
    title: { absolute: "Saasflare UI — The AI-native React component library" },
}

const COMPONENT_COUNT = registry.items.length

/** Full marketing landing page. */
export default function Home() {
    return (
        <>
            <LandingNav />
            <main>
                <HeroPlayground version={pkg.version} componentCount={COMPONENT_COUNT} />
                <Proof componentCount={COMPONENT_COUNT} />
                <Cta />
            </main>
            <Footer />
        </>
    )
}
