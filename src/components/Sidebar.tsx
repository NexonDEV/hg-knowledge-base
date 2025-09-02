import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { allMeta, byRoute, groupsConfig } from '../lib/content'
import Logo from './Logo'
import * as Icons from 'lucide-react'

type SortMode = 'group-title' | 'title-asc' | 'title-desc' | 'order-asc' | 'order-desc'

function currentGroupKey(pathname: string) {
    const rec = byRoute[pathname]
    return rec?.meta.group || 'Ogólne'
}

export default function Sidebar({ isOpen = false, onClose, isMobile = false }: { isOpen?: boolean; onClose?: () => void; isMobile?: boolean }) {
    const handleClick: React.MouseEventHandler = (e) => {
        const link = (e.target as HTMLElement).closest('.nav-link')
        if (!link) return
        if (!isMobile) return
        onClose?.()
    }

    const { pathname } = useLocation()

    const [sort, setSort] = React.useState<SortMode>(() => (localStorage.getItem('kbSort') as SortMode) || 'order-asc')
    React.useEffect(() => { localStorage.setItem('kbSort', sort) }, [sort])

    const groupIcons = React.useMemo(() => {
        const m = new Map<string, string | undefined>()
        for (const g of groupsConfig) m.set(g.name, g.icon)
        if (!m.has('Ogólne')) m.set('Ogólne', undefined)
        return m
    }, [])
    const groupOrder = React.useMemo(() => {
        const m = new Map<string, number>()
        for (const g of groupsConfig) m.set(g.name, typeof g.order === 'number' ? g.order : 9999)
        if (!m.has('Ogólne')) m.set('Ogólne', -1)
        return m
    }, [])

    const groups = React.useMemo(() => {
        const bucket = new Map<string, typeof allMeta>()
        for (const m of allMeta) {
            const key = m.group || 'Ogólne'
            if (!bucket.has(key)) bucket.set(key, [])
            bucket.get(key)!.push(m)
        }
        const entries = [...bucket.entries()].filter(([, arr]) => arr.length > 0)

        for (const [, arr] of entries) {
            switch (sort) {
                case 'title-asc':  arr.sort((a, b) => a.title.localeCompare(b.title)); break
                case 'title-desc': arr.sort((a, b) => b.title.localeCompare(a.title)); break
                case 'order-asc':  arr.sort((a, b) => (a.order ?? 1e9) - (b.order ?? 1e9) || a.title.localeCompare(b.title)); break
                case 'order-desc': arr.sort((a, b) => (b.order ?? -1e9) - (a.order ?? -1e9) || a.title.localeCompare(b.title)); break
                case 'group-title':
                default:           arr.sort((a, b) => a.title.localeCompare(b.title))
            }
        }

        entries.sort((a, b) => {
            const oa = groupOrder.get(a[0]) ?? 9999
            const ob = groupOrder.get(b[0]) ?? 9999
            return oa !== ob ? oa - ob : a[0].localeCompare(b[0])
        })

        return entries.map(([name, items]) => ({
            name,
            items,
            iconName: groupIcons.get(name)
        }))
    }, [sort, groupIcons, groupOrder])

    const [open, setOpen] = React.useState<Set<string>>(new Set([currentGroupKey(pathname)]))
    React.useEffect(() => { setOpen(new Set([currentGroupKey(pathname)])) }, [pathname])

    function toggleGroup(name: string) {
        setOpen(prev => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    return (
        <aside
            className={`sidebar ${isMobile ? 'sidebar-mobile' : ''}`}
            data-open={isOpen ? 'true' : 'false'}
            data-mobile={isMobile ? 'true' : 'false'}
            aria-hidden={isMobile && !isOpen ? 'true' : 'false'}
            onClick={handleClick}
        >
            <div className="logo">
                <Logo />
            </div>

            <div className="controls">
                <span className="text-xs text-[--kb-mute]">Sortowanie</span>
                <select value={sort} onChange={e => setSort(e.target.value as SortMode)}>
                    <option value="group-title">Wg grup → tytuł</option>
                    <option value="title-asc">Tytuł A→Z</option>
                    <option value="title-desc">Tytuł Z→A</option>
                    <option value="order-asc">Kolejność ↑ (order)</option>
                    <option value="order-desc">Kolejność ↓ (order)</option>
                </select>
            </div>

            <nav className="nav">
                {groups.map(g => {
                    const isOpen = open.has(g.name)
                    const IconComp = g.iconName ? (Icons as any)[g.iconName] : null
                    return (
                        <div key={g.name} className={isOpen ? 'group-open' : undefined}>
                            <button
                                className="group-btn"
                                onClick={() => toggleGroup(g.name)}
                                aria-expanded={isOpen}
                                title={g.name}
                            >
                                <span className="group-chevron"><Icons.ChevronRight size={16} /></span>
                                {IconComp ? React.createElement(IconComp, { size: 16, className: 'opacity-80' }) : null}
                                <span>{g.name}</span>
                            </button>

                            <div className="kb-accordion" data-open={isOpen}>
                                <div className="pl-7 pr-1 py-1 space-y-1">
                                    {g.items.map(it => {
                                        const active = pathname === it.route
                                        return (
                                            <Link
                                                key={it.route}
                                                to={it.route}
                                                className={`nav-link ${active ? 'nav-active' : ''}`}
                                            >
                                                {it.title}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <a href="https://hostgier.pl" className="btn-ghost" target="_blank" rel="noreferrer">
                    <Icons.Home size={16} /> Strona Główna
                </a>
                <a href="https://discord.gg/gRxXafksxs" className="btn-ghost" target="_blank" rel="noreferrer">
                    <Icons.MessageCircle size={16} /> Discord
                </a>
            </div>
        </aside>
    )
}
