import type { DocMeta, DocModule, Heading } from '../types/content'
import fm from 'front-matter'
import groupsCfg from '../config/groups.json' assert { type: 'json' }

const modules = import.meta.glob<DocModule>('../content/**/*.mdx', { eager: true })
const raws = import.meta.glob<string>('../content/**/*.mdx', { eager: true, as: 'raw' })

const FALLBACK_GROUP = 'Ogólne'
type GroupCfg = { name: string; icon?: string; order?: number }
const GROUPS = new Map<string, GroupCfg>(groupsCfg.map((g) => [g.name, g]))

function toRoutePath(filePath: string) {
    return filePath
        .replace(/^\.\.\/content/, '')
        .replace(/\/index\.mdx$/, '/')
        .replace(/\.mdx$/, '') || '/'
}
function toSlug(route: string) {
    const parts = route.split('/').filter(Boolean)
    const last = parts[parts.length - 1] ?? ''
    return last || 'index'
}
function extractHeadings(md: string) : Heading[] {
    const lines = md.split('\n')
    const out: Heading[] = []
    for (const l of lines) {
        const m2 = l.match(/^##\s+(.+)/)
        const m3 = l.match(/^###\s+(.+)/)
        if (m2) {
            const text = m2[1].trim()
            const id = text.toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-')
            out.push({ level: 2, text, id })
        } else if (m3) {
            const text = m3[1].trim()
            const id = text.toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-')
            out.push({ level: 3, text, id })
        }
    }
    return out
}

type FrontAttrs = {
    title?: string
    tags?: string[]
    summary?: string
    group?: string
    order?: number
}

export type DocRecord = {
    route: string
    mod: DocModule
    meta: DocMeta
    raw: string
}

const docs: DocRecord[] = Object.entries(modules).map(([path, mod]) => {
    const raw = raws[path] ?? ''
    const parsed = fm<FrontAttrs>(raw)
    const front = parsed.attributes || {}
    const route = toRoutePath(path)
    const headings = extractHeadings(parsed.body)

    const requested = front.group?.trim()
    const group = requested && GROUPS.has(requested) ? requested : FALLBACK_GROUP

    const meta: DocMeta = {
        route,
        slug: toSlug(route),
        title: front.title || route.split('/').filter(Boolean).slice(-1)[0] || 'Index',
        tags: Array.isArray(front.tags) ? front.tags : [],
        summary: front.summary,
        headings,
        group,
        order: typeof front.order === 'number' ? front.order : undefined,
    }
    return { route, mod, meta, raw: parsed.body }
})

export const byRoute = Object.fromEntries(docs.map(d => [d.route, d]))
export const allMeta: DocMeta[] = docs.map(d => d.meta)
export const allDocs = docs
export const groupsConfig = groupsCfg as GroupCfg[]
