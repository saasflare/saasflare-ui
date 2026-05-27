/**
 * @fileoverview Tiny token-based scorer over the registry items so the MCP
 * server can answer fuzzy queries (`search_components`,
 * `recommend_for_use_case`) without pulling Fuse.js or any other dep.
 *
 * @module apps/ui/lib/mcp/search
 */

import type { RegistryIndexItem } from "./catalog"

export interface ScoredItem extends RegistryIndexItem {
    relevance: number
    matchedTerms: string[]
}

const STOPWORDS = new Set([
    "a", "an", "and", "or", "the", "to", "for", "of", "with", "as", "is",
    "are", "i", "we", "you", "me", "my", "our", "build", "make", "create",
    "page", "app", "site", "website", "ui", "component", "components",
])

function tokenize(s: string): string[] {
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter((t) => t.length >= 2 && !STOPWORDS.has(t))
}

/**
 * Score every registry item against the query, return ranked results.
 * Weight: name match 5×, title match 3×, description match 1×.
 * Returns items with `relevance > 0`, sorted descending. Caller can `slice`.
 */
export function scoreItems(
    items: RegistryIndexItem[],
    query: string,
): ScoredItem[] {
    const terms = Array.from(new Set(tokenize(query)))
    if (terms.length === 0) {
        return items.map((it) => ({ ...it, relevance: 0, matchedTerms: [] }))
    }

    const scored: ScoredItem[] = []
    for (const item of items) {
        const nameTokens = new Set(tokenize(item.name))
        const titleTokens = new Set(tokenize(item.title))
        const descTokens = new Set(tokenize(item.description))

        let score = 0
        const matched: string[] = []
        for (const term of terms) {
            if (nameTokens.has(term)) {
                score += 5
                matched.push(term)
                continue
            }
            // Partial-substring on name for "date" → "date-range-picker"
            if (item.name.toLowerCase().includes(term)) {
                score += 4
                matched.push(term)
                continue
            }
            if (titleTokens.has(term)) {
                score += 3
                matched.push(term)
                continue
            }
            if (descTokens.has(term)) {
                score += 1
                matched.push(term)
            }
        }

        if (score > 0) scored.push({ ...item, relevance: score, matchedTerms: matched })
    }

    return scored.sort((a, b) => b.relevance - a.relevance)
}
