import { Heart } from 'lucide-react'

export default function FooterBar() {
    const year = new Date().getFullYear()
    return (
        <footer className="footer-bar">
            <div className="mx-auto max-w-6xl w-full h-full px-4 flex items-center justify-center">
                <div className="footer-text flex items-center gap-2">
                    <span>© {year} HostGier.PL</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
            Made with <Heart size={14} className="footer-heart" /> by
            <a href="https://nexondev.pl" target="_blank" rel="noreferrer">NexonDEV</a>
          </span>
                </div>
            </div>
        </footer>
    )
}
