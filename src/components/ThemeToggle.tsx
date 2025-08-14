import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true)

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
        const initialDark = saved ? saved === 'dark' : prefersDark
        setIsDark(initialDark)
        document.documentElement.classList.toggle('dark', initialDark)
    }, [])

    function toggle() {
        const next = !isDark
        setIsDark(next)
        document.documentElement.classList.toggle('dark', next)
        localStorage.setItem('theme', next ? 'dark' : 'light')
    }

    return (
        <button
            onClick={toggle}
            className="theme-toggle"
            aria-label={isDark ? 'Przełącz na jasny' : 'Przełącz na ciemny'}
            title={isDark ? 'Przełącz na jasny' : 'Przełącz na ciemny'}
            data-dark={isDark}
            type="button"
        >
            <Sun className="sun" />
            <Moon className="moon" />
            <span className="knob" />
        </button>
    )
}
