import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'elevated' | 'flat' | 'liquid'
  hoverable?: boolean
  selectable?: boolean
  selected?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', hoverable = true, selectable, selected, children, ...props }, ref) => {
    const variantStyles = {
      glass: [
        'bg-[rgba(15,15,20,0.4)] backdrop-blur-xl backdrop-saturate-[120%]',
        'border border-white/[0.08] rounded-2xl p-6',
        hoverable && 'hover:border-white/[0.12] hover:shadow-[0_0_16px_rgba(0,240,255,0.1)]',
      ],
      elevated: [
        'bg-[rgba(24,24,32,0.6)] backdrop-blur-xl backdrop-saturate-[140%]',
        'border border-white/[0.12] rounded-[20px] p-6',
        hoverable && 'hover:border-white/[0.18] hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]',
      ],
      flat: [
        'bg-bg-500',
        'border border-white/[0.05] rounded-xl p-5',
        hoverable && 'hover:border-white/[0.10]',
      ],
      liquid: [
        'bg-[rgba(15,15,20,0.3)] backdrop-blur-md backdrop-saturate-[180%]',
        'rounded-2xl p-6',
        'relative',
      ],
    }

    const selectedStyles = selected
      ? 'border-cyan-400/30 shadow-[0_0_16px_rgba(0,240,255,0.15)]'
      : ''

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-250 ease-liquid',
          variantStyles[variant],
          selectedStyles,
          className
        )}
        {...props}
      >
        {variant === 'liquid' && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(0,240,255,0.3), rgba(255,0,110,0.2), rgba(255,190,11,0.3))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}
        <div className={variant === 'liquid' ? 'relative z-10' : ''}>{children}</div>
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
