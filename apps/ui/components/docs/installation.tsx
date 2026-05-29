/**
 * @fileoverview Installation block for a component page, used inside docs MDX
 * as `<Installation name="button" />`. Shows the shadcn CLI command that pulls
 * the component from the Saasflare registry, plus the package install.
 * @module apps/ui/components/docs/installation
 */

import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

const HOMEPAGE = "https://ui.saasflare.io"

interface InstallationProps {
    /** Registry name, e.g. `"button"`. */
    name: string
}

/** CLI (registry) and manual (npm package) installation tabs. */
export function Installation({ name }: InstallationProps) {
    return (
        <Tabs items={["CLI", "Manual"]} className="my-4">
            <Tab value="CLI">
                <DynamicCodeBlock
                    lang="bash"
                    code={`npx shadcn@latest add ${HOMEPAGE}/r/${name}.json`}
                />
            </Tab>
            <Tab value="Manual">
                <DynamicCodeBlock lang="bash" code={"pnpm add @saasflare/ui"} />
            </Tab>
        </Tabs>
    )
}
