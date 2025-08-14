export default function AiGeneratedBadge({
                                             label = '✨ Artykuł wygenerowany przez HostGier AI Agent (alpha-b23)',
                                             width = 500,
                                             height = 32,
                                         }: { label?: string; width?: number; height?: number }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                role="img"
                aria-label={label}
            >
                <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%"  stopColor="#7C3AED" />
                        <stop offset="50%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity=".35" />
                    </filter>
                </defs>
                <rect rx="8" width={width} height={height} fill="url(#g)" filter="url(#shadow)" />
                <text
                    x="16"
                    y={Math.round(height * 0.65)}
                    fill="#fff"
                    fontFamily="ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial"
                    fontSize="13"
                    fontWeight="700"
                >
                    {label}
                </text>
            </svg>
        </div>
    )
}
