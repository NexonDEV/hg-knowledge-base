import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import DocPage from './components/DocPage'
import SearchBox from './components/Search'
import ThemeToggle from './components/ThemeToggle'
import FooterBar from './components/Footer'
import {TitleSync} from "./seo/SEO.tsx";

export default function App() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { pathname } = useLocation()

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    return (
        <div className="app-shell">
            <Sidebar
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <main className="main">
                <TitleSync />
                <header className="header-glass">
                    <div className="header-inner mx-auto max-w-6xl px-4 flex items-center gap-3">
                        <button
                            type="button"
                            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
                            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[--kb-border] bg-[--kb-panel] hover:bg-[--kb-soft] transition"
                            onClick={() => setMobileOpen(o => !o)}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <div className="flex-1"><SearchBox /></div>

                        <ThemeToggle />
                    </div>
                </header>

                <div className="main-scroll">
                    <div className="mx-auto max-w-6xl w-full px-4 py-6">
                        <Routes>
                            <Route path="/" element={<DocPage />} />
                            <Route path="/*" element={<DocPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </div>
            </main>

            {mobileOpen && (
                <button
                    aria-label="Close navigation backdrop"
                    className="mobile-backdrop lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <FooterBar />
        </div>
    )
}
