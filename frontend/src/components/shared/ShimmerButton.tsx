import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps {
  to?: string
  href?: string
  children: React.ReactNode
  className?: string
  variant?: 'cyan' | 'magenta' | 'gold' | 'gradient'
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}

export default function ShimmerButton({
  to,
  href,
  children,
  className,
  variant = 'gradient',
  onClick,
}: ShimmerButtonProps) {
  const baseClasses = cn(
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 font-semibold text-lg transition-all duration-500 hover:scale-105',
    variant === 'gradient' && 'bg-gradient-to-r from-accent-cyan to-accent-magenta text-white hover:shadow-xl hover:shadow-accent-cyan/20',
    variant === 'cyan' && 'glass-strong text-accent-cyan hover:bg-accent-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]',
    variant === 'magenta' && 'glass-strong text-accent-magenta hover:bg-accent-magenta/10 hover:shadow-[0_0_20px_rgba(255,0,110,0.2)]',
    variant === 'gold' && 'glass-strong text-accent-gold hover:bg-accent-gold/10 hover:shadow-[0_0_20px_rgba(255,190,11,0.2)]',
    className
  )

  const shimmer = (
    <span className="absolute inset-0 overflow-hidden rounded-2xl">
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </span>
  )

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick}>
        <span className="relative z-10">{children}</span>
        {shimmer}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
      </Link>
    )
  }

  return (
    <a href={href} className={baseClasses} onClick={onClick}>
      <span className="relative z-10">{children}</span>
      {shimmer}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </a>
  )
}
