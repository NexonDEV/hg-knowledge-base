import { Helmet } from 'react-helmet-async'
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {byRoute} from "../lib/content.ts";

type DocMeta = {
    route: string
    title: string
    summary?: string
    tags?: string[]
}

const SITE = "https://wiki.hostgier.pl"
const BRAND = 'HostGier.PL - Baza Wiedzy'

function canonicalOf(route: string) {
    return new URL(route === '/' ? '/' : route.replace(/\/+$/, ''), SITE).toString()
}

const normalize = (p: string) => (p !== '/' ? p.split(/[?#]/)[0].replace(/\/+$/, '') : '/')

function toBreadcrumbList(route: string, title: string) {
    const parts = route.split('/').filter(Boolean)
    const items = parts.map((seg, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: decodeURIComponent(seg.replace(/-/g, ' ')),
        item: new URL('/' + parts.slice(0, i + 1).join('/'), SITE).toString(),
    }))
    if (items.length === 0) {
        items.push({ '@type': 'ListItem', position: 1, name: 'Home', item: SITE })
    }
    items[items.length - 1].name = title
    items[items.length - 1].item = canonicalOf(route)
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items,
    }
}

export default function SEO({ doc }: { doc: DocMeta }) {
    const title = `${doc.title} • ${BRAND}`
    const description = doc.summary?.slice(0, 160) || doc.title
    const url = canonicalOf(doc.route)
    const image = new URL('/og/default.png', SITE).toString()

    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: doc.title,
        description,
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'HostGier.PL' },
        publisher: { '@type': 'Organization', name: 'HostGier.PL' },
    }

    const breadcrumbLd = toBreadcrumbList(doc.route, doc.title)

    return (
        <Helmet prioritizeSeoTags>
            <title>{title}</title>
            <meta name="description" content={description} />

            <link rel="canonical" href={url} />

            <meta property="og:type" content="article" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={BRAND} />
            {doc.tags?.slice(0, 6).map(t => (
                <meta property="article:tag" content={t} key={t} />
            ))}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
            <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>

            <meta name="theme-color" content="#0f1216" />
        </Helmet>
    )
}

export function TitleSync() {
    const { pathname } = useLocation()
    useEffect(() => {
        const rec = byRoute[normalize(pathname)]
        document.title = rec?.meta?.title
            ? `${rec.meta.title} • HostGier.PL - Baza Wiedzy`
            : 'HostGier.PL - Baza Wiedzy'
    }, [pathname])
    return null
}
