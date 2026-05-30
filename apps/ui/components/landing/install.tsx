/**
 * @fileoverview "Productive in a minute" — install + import + use, shown as a
 * single annotated code block. No build step, no config, zero env vars.
 */
import { CodeBlock } from "@saasflare/ui"

const USAGE = `// 1. Install the styles once
import "@saasflare/ui/styles"

// 2. Wrap your app in the provider
import { SaasflareShell } from "@saasflare/ui"

// 3. Use any component — themed, typed, animated
import { Button, Card, GradientText } from "@saasflare/ui"

export function App() {
  return (
    <SaasflareShell>
      <Card>
        <h1>Build with <GradientText>Saasflare</GradientText></h1>
        <Button intent="primary">Ship it</Button>
      </Card>
    </SaasflareShell>
  )
}`

/** Single code block walking through install → provider → usage. */
export function Install() {
    return (
        <section className="mx-auto max-w-3xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Productive in a minute
                </h2>
                <p className="mt-4 text-balance text-muted-foreground">
                    One import for the styles, one provider, and you&apos;re themed. No Tailwind
                    config, no env vars.
                </p>
            </div>
            <div className="mt-10">
                <CodeBlock code={USAGE} language="tsx" filename="app.tsx" />
            </div>
        </section>
    )
}
