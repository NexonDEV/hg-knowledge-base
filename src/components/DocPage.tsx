import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { byRoute } from '../lib/content'
import { MDXProvider } from '@mdx-js/react'

const mdxComponents = {
    h2: (props: any) => <h2 {...props} className="mt-10 mb-3 scroll-mt-24 text-2xl font-semibold" />,
    h3: (props: any) => <h3 {...props} className="mt-8 mb-2 scroll-mt-24 text-xl font-semibold" />,
    a:  (props: any) => <a {...props} className="text-[--kb-brand] underline underline-offset-2 hover:opacity-90" />,
    code: (props: any) => <code {...props} className="bg-[--kb-soft] rounded px-1 py-0.5" />,
    pre: (props: any) => <pre {...props} className="bg-[--kb-soft] rounded p-3 overflow-x-auto" />,
    ul: (p: any) => <ul {...p} className="list-disc pl-6" />,
    ol: (p: any) => <ol {...p} className="list-decimal pl-6" />,
    table: (p: any) => <div className="overflow-x-auto"><table {...p} className="table-auto w-full"/></div>,
}

export default function DocPage() {
    const { pathname } = useLocation()
    const route = pathname || '/'
    const rec = byRoute[route]
    const Content = useMemo(() => (rec?.mod?.default ?? (() => <div>Nie znaleziono dokumentu.</div>)), [rec])

    return (
        <div className="px-6 py-6">
            <div className="mb-6 doc-header pb-5">
                <h1 className="text-3xl font-bold tracking-tight doc-title">{rec?.meta.title}</h1>
                {rec?.meta.summary ? <p className="mt-2 text-sm text-[--kb-mute] anim-fade">{rec.meta.summary}</p> : null}
                <div className="doc-underline mt-3"></div>
            </div>

            <article className="prose kb-article">
                <MDXProvider components={mdxComponents}>
                    <Content />
                </MDXProvider>
            </article>
        </div>
    )
}
