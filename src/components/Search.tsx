import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { search, suggest } from '../lib/search'
import { useNavigate } from 'react-router-dom'

function useRect(el: HTMLElement | null) {
    const [rect, setRect] = useState<DOMRect | null>(null)
    useEffect(() => {
        if (!el) return
        const update = () => setRect(el.getBoundingClientRect())
        update()
        const ro = new ResizeObserver(update)
        ro.observe(el)
        window.addEventListener('scroll', update, true)
        window.addEventListener('resize', update)
        return () => {
            ro.disconnect()
            window.removeEventListener('scroll', update, true)
            window.removeEventListener('resize', update)
        }
    }, [el])
    return rect
}

export default function SearchBox() {
    const [q, setQ] = useState('')
    const [active, setActive] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const nav = useNavigate()

    const results = useMemo(() => search(q).slice(0, 8), [q])
    const suggestions = useMemo(
        () => (!results.length ? suggest(q).slice(0, 5) : []),
        [q, results]
    )
    const isOpen = results.length > 0 || (!!q && suggestions.length > 0)

    const rect = useRect(inputRef.current)

    useEffect(() => { setActive(0) }, [q])

    useEffect(() => {
        if (!isOpen) return
        const onDown = (e: MouseEvent) => {
            const pop = document.getElementById('kb-search-popover')
            if (pop && (e.target instanceof Node) &&
                (pop.contains(e.target) || inputRef.current?.contains(e.target))) return
                ;(document.activeElement as HTMLElement | null)?.blur()
        }
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') (document.activeElement as HTMLElement | null)?.blur() }
        document.addEventListener('mousedown', onDown, true)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onDown, true)
            document.removeEventListener('keydown', onKey)
        }
    }, [isOpen])

    function go(route: string) {
        nav(route)
        setTimeout(() => (document.activeElement as HTMLElement | null)?.blur(), 0)
    }

    const list = results.length ? (
        results.map((r, i) => (
            <button
                key={String(r.id)}
                className={`block w-full text-left px-3 py-2 nav-link ${i === active ? 'bg-[--kb-soft-strong]' : 'hover:bg-[--kb-soft]'}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go((r as any).route || String(r.id))}
            >
                <div className="font-medium">{(r as any).title || String(r.id)}</div>
                {Array.isArray((r as any).tags) && (r as any).tags.length > 0 && (
                    <div className="text-xs text-[--kb-mute]">#{((r as any).tags as string[]).join(' #')}</div>
                )}
            </button>
        ))
    ) : (
        <div className="p-2">
            <div className="text-sm text-[--kb-mute] mb-1">Podpowiedzi</div>
            <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                    <button
                        key={s.suggestion}
                        onClick={() => setQ(s.suggestion)}
                        className="px-2 py-1 rounded bg-[--kb-soft] hover:bg-[--kb-soft-strong] text-sm nav-link"
                    >
                        {s.suggestion}
                    </button>
                ))}
            </div>
        </div>
    )

    const style: React.CSSProperties | undefined = rect
        ? (() => {
            const maxW = Math.min(rect.width, 640)
            const left = Math.min(rect.left, window.innerWidth - maxW - 16)
            const top = rect.bottom + 8
            return {
                position: 'fixed',
                top: Math.round(top),
                left: Math.round(Math.max(8, left)),
                width: Math.round(maxW),
                zIndex: 1000,
            }
        })()
        : undefined

    return (
        <>
            <div className="w-full max-w-xl">
                <input
                    ref={inputRef}
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'ArrowDown') setActive(a => Math.min(a + 1, Math.max(results.length - 1, 0)))
                        if (e.key === 'ArrowUp') setActive(a => Math.max(a - 1, 0))
                        if (e.key === 'Enter') {
                            const r = results[active]
                            if (r) go((r as any).route || String(r.id))
                        }
                    }}
                    placeholder="Szukaj w bazie wiedzy…"
                    className="input w-full placeholder:opacity-60"
                />
            </div>

            {isOpen && rect && style && createPortal(
                <div id="kb-search-popover" className="kb-popover anim-pop" style={style}>
                    {list}
                </div>,
                document.body
            )}
        </>
    )
}
