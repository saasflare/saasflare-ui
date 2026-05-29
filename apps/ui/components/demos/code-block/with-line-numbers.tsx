"use client"

import { CodeBlock } from "@saasflare/ui"

const SOURCE = `pnpm add @saasflare/ui
import "@saasflare/ui/styles"

// Wrap your app once
<SaasflareShell>
  <App />
</SaasflareShell>`

/** A code block with a line-number gutter. */
export function Demo() {
    return (
        <CodeBlock
            className="w-full max-w-md"
            code={SOURCE}
            language="bash"
            filename="setup.sh"
            showLineNumbers
        />
    )
}
