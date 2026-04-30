import { cn } from '@/lib/utils'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'gradient' | 'dashed' | 'glow'
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export function Divider({
  className,
  variant = 'solid',
  orientation = 'horizontal',
  label,
  ...props
}: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)} {...props}>
        <div
          className={cn(
            'flex-1',
            variant === 'solid' && 'h-px bg-white/[0.08]',
            variant === 'gradient' && 'h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent',
            variant === 'dashed' && 'h-px border-t border-dashed border-white/[0.08]',
            variant === 'glow' && 'h-px bg-cyan-400/30 glow-cyan-sm'
          )}
        />
        <span className="text-xs text-text-tertiary whitespace-nowrap">{label}</span>
        <div
          className={cn(
            'flex-1',
            variant === 'solid' && 'h-px bg-white/[0.08]',
            variant === 'gradient' && 'h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent',
            variant === 'dashed' && 'h-px border-t border-dashed border-white/[0.08]',
            variant === 'glow' && 'h-px bg-cyan-400/30 glow-cyan-sm'
          )}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        orientation === 'horizontal' ? 'w-full h-px' : 'w-px h-full',
        variant === 'solid' && (orientation === 'horizontal' ? 'bg-white/[0.08]' : 'bg-white/[0.08]'),
        variant === 'gradient' &&
          (orientation === 'horizontal'
            ? 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent'
            : 'bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent'),
        variant === 'dashed' &&
          (orientation === 'horizontal'
            ? 'border-t border-dashed border-white/[0.08]'
            : 'border-l border-dashed border-white/[0.08]'),
        variant === 'glow' && 'bg-cyan-400/30 glow-cyan-sm',
        className
      )}
      {...props}
    />
  )
}
