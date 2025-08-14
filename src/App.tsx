import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DocPage from './components/DocPage'
import SearchBox from './components/Search'
import ThemeToggle from './components/ThemeToggle'
import FooterBar from './components/Footer'

export default function App() {
    return (
        <div className="h-full flex overflow-hidden">
            <Sidebar />
            <main className="main">
                <header className="header-glass">
                    <div className="header-inner mx-auto max-w-6xl px-4 flex items-center gap-4">
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
