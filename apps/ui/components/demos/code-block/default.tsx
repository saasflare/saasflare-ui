"use client"

import { CodeBlock } from "@saasflare/ui"

const SOURCE = `import { Button } from "@saasflare/ui"

export function Cta() {
  return <Button intent="primary">Start free trial</Button>
}`

/** A framed code block with filename header, language badge, and copy button. */
export function Demo() {
    return (
        <CodeBlock
            className="w-full max-w-md"
            code={SOURCE}
            language="tsx"
            filename="cta.tsx"
        />
    )
}
