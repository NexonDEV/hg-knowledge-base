import fg from 'fast-glob'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const SITE = "https://wiki.hostgier.pl"

function toRoute(file) {
    const rel = file.replace(/^src\/content\//, '').replace(/\\/g, '/')
    if (rel.endsWith('index.mdx')) return '/' + rel.replace(/\index\.mdx$/, '')
    return '/' + rel.replace(/\.mdx$/, '')
}

const files = await fg(['src/content/**/*.mdx'], { dot: false })
const urls = files.map(f => new URL(toRoute(f), SITE).toString())

console.log(urls)

const now = new Date().toISOString()
const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls
        .map(u => `<url><loc>${u}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`)
        .join('') +
    `</urlset>`

writeFileSync(resolve('public/sitemap.xml'), xml, 'utf8')
