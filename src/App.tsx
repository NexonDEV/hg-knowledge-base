import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import DocPage from './components/DocPage'
import SearchBox from './components/Search'
import ThemeToggle from './components/ThemeToggle'
import FooterBar from './components/Footer'
import {TitleSync} from "./seo/SEO.tsx";

export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false)
            }
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
    const closeSidebar = () => setSidebarOpen(false)

    return (
        <div className="h-full flex overflow-hidden">
            {isMobile && sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}
            
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={closeSidebar}
                isMobile={isMobile}
            />
            
            <main className="main">
                <TitleSync />
                <header className="header-glass">
                    <div className="header-inner mx-auto max-w-6xl px-4 flex items-center gap-4">
                        {isMobile && (
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg hover:bg-[--kb-soft] transition-colors lg:hidden"
                                aria-label="Toggle menu"
                            >
                                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        )}
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

            <FooterBar />
        </div>
    )
}
