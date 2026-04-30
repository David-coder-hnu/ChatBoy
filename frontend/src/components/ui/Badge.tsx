import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'cyan' | 'magenta' | 'gold'
  size?: 'sm' | 'md' | 'lg'
}

const variantMap = {
  default: {
    bg: 'bg-bg-600',
    text: 'text-text-secondary',
    border: 'border-transparent',
  },
  success: {
    bg: 'bg-success/15',
    text: 'text-success',
    border: 'border-success/30',
  },
  warning: {
    bg: 'bg-warning/15',
    text: 'text-warning',
    border: 'border-warning/30',
  },
  error: {
    bg: 'bg-error/15',
    text: 'text-error',
    border: 'border-error/30',
  },
  cyan: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    border: 'border-cyan-400/30',
  },
  magenta: {
    bg: 'bg-magenta-500/15',
    text: 'text-magenta-400',
    border: 'border-magenta-400/30',
  },
  gold: {
    bg: 'bg-gold-500/15',
    text: 'text-gold-400',
    border: 'border-gold-400/30',
  },
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-5 px-2 text-[11px]',
      md: 'h-6 px-3 text-xs',
      lg: 'h-7 px-3.5 text-[13px]',
    }

    const styles = variantMap[variant]

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border font-medium',
          sizeStyles[size],
          styles.bg,
          styles.text,
          styles.border,
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
