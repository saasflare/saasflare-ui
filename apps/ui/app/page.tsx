/**
 * @fileoverview Marketing landing page for ui.saasflare.io.
 *
 * Replaces the previous `redirect("/catalog")` (the catalog now lives at
 * `/catalog`). Composed entirely from `@saasflare/ui` primitives so the page
 * is itself the proof of the design system. Inherits theme + animation context
 * from `SaasflareShell` in the root layout.
 */
import type { Metadata } from "next"
import { AiNative } from "../components/landing/ai-native"
import { Cta } from "../components/landing/cta"
import { Footer } from "../components/landing/footer"
import { Hero } from "../components/landing/hero"
import { Install } from "../components/landing/install"
import { LandingNav } from "../components/landing/landing-nav"
import { Showcase } from "../components/landing/showcase"
import { ThemePlayground } from "../components/landing/theme-playground"

export const metadata: Metadata = {
    title: { absolute: "Saasflare UI — The AI-native React component library" },
}

/** Full marketing landing page. */
export default function Home() {
    return (
        <>
            <LandingNav />
            <main>
                <Hero />
                <AiNative />
                <ThemePlayground />
                <Showcase />
                <Install />
                <Cta />
            </main>
            <Footer />
        </>
    )
}
