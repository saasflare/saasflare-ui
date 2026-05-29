/**
 * @fileoverview Props/API table for a component, used inside docs MDX as
 * `<PropsTable name="button" />`. Data comes from the generated
 * public/props.json (react-docgen-typescript output) and is rendered through
 * Fumadocs' TypeTable. Pass `component` to show a single sub-component.
 * @module apps/ui/components/docs/props-table
 */

import { TypeTable } from "fumadocs-ui/components/type-table"
import propsJson from "@/public/props.json"

interface PropEntry {
    name: string
    type: string
    required: boolean
    default: string | null
    description: string
}

interface ComponentProps {
    name: string
    description: string
    props: PropEntry[]
}

const data = propsJson as Record<string, ComponentProps[]>

interface PropsTableProps {
    /** Registry name, e.g. `"button"`. */
    name: string
    /** Optional sub-component display name to isolate, e.g. `"DialogContent"`. */
    component?: string
}

/** Render one TypeTable per (sub-)component extracted for `name`. */
export function PropsTable({ name, component }: PropsTableProps) {
    const groups = data[name]
    if (!groups || groups.length === 0) {
        return (
            <p className="text-sm text-fd-muted-foreground">
                No public props extracted for <code>{name}</code>.
            </p>
        )
    }
    const chosen = component ? groups.filter((g) => g.name === component) : groups
    return (
        <>
            {chosen.map((group) => (
                <div key={group.name}>
                    {chosen.length > 1 && (
                        <h3 className="mt-6 font-mono text-sm font-semibold">{group.name}</h3>
                    )}
                    <TypeTable
                        type={Object.fromEntries(
                            group.props.map((p) => [
                                p.name,
                                {
                                    type: p.type,
                                    description: p.description || undefined,
                                    default: p.default ?? undefined,
                                    required: p.required,
                                },
                            ]),
                        )}
                    />
                </div>
            ))}
        </>
    )
}
