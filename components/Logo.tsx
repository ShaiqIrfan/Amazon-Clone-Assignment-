import Link from 'next/link'

type LogoProps = {
  footer?: boolean
  className?: string
  showWordmark?: boolean
}

export default function Logo({ footer = false, className = '', showWordmark = true }: LogoProps) {
  const wrapperClass = footer ? 'footer-brand' : 'brand'
  const wordmarkClass = footer ? 'brand-wordmark footer-wordmark' : 'brand-wordmark'

  return (
    <Link
      href="/"
      className={`${wrapperClass} ${className}`.trim()}
      aria-label="NexCart home"
    >
      <span className="brand-mark-wrap" aria-hidden="true">
        <svg
          className="brand-mark-svg"
          viewBox="0 0 64 64"
          role="img"
          aria-label="NexCart brand mark"
        >
          <defs>
            <linearGradient id="nexcart-mark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="55%" stopColor="#7C7BFF" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          <rect x="7" y="10" width="50" height="44" rx="16" fill="rgba(9, 13, 20, 0.9)" stroke="rgba(148, 163, 184, 0.18)" />

          <path
            d="M21 23h22l-1.8 18.4A5.2 5.2 0 0 1 36 46H28a5.2 5.2 0 0 1-5.2-4.6L21 23Z"
            fill="url(#nexcart-mark-gradient)"
            opacity="0.92"
          />

          <path
            d="M25 23v-5.3A7 7 0 0 1 39 18v5.3"
            fill="none"
            stroke="#E8EEFF"
            strokeWidth="3.3"
            strokeLinecap="round"
          />

          <path
            d="M22 39V25l9 13 9-13v14"
            fill="none"
            stroke="#F8FAFC"
            strokeWidth="3.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="47" cy="22" r="3.5" fill="#06B6D4" opacity="0.9" />
        </svg>
      </span>
      {showWordmark && <span className={wordmarkClass}>NexCart</span>}
    </Link>
  )
}
