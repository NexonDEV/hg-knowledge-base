import MiniSearch from 'minisearch'
import type { Suggestion } from 'minisearch'
import { allDocs } from './content'

type SearchDoc = {
    id: string
    route: string
    title: string
    tags: string[]
    headings: string[]
    content: string
}

const docs: SearchDoc[] = allDocs.map(d => ({
    id: d.meta.route,
    route: d.meta.route,
    title: d.meta.title,
    tags: d.meta.tags,
    headings: d.meta.headings.map(h => h.text),
    content: d.raw
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`[^`]*`/g, ' ')
        .replace(/\!\[[^\]]*\]\([^)]+\)/g, ' ')
        .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[#>*_~`>-]/g, ' ')
}))

const mini = new MiniSearch<SearchDoc>({
    fields: ['title', 'headings', 'content', 'tags'],
    storeFields: ['route', 'title', 'tags'],
    searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 4, headings: 2, tags: 2, content: 1 }
    }
})

mini.addAll(docs)

export type SearchHit = ReturnType<typeof mini.search>[number] & Partial<SearchDoc>

export function search(query: string): SearchHit[] {
    if (!query.trim()) return []
    return mini.search(query) as SearchHit[]
}

export function suggest(prefix: string): Suggestion[] {
    if (!prefix.trim()) return []
    return mini.autoSuggest(prefix, { prefix: true })
}
