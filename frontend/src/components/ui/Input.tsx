import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'search' | 'password'
  inputSize?: 'sm' | 'md' | 'lg'
  error?: boolean
  errorMessage?: string
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', inputSize = 'md', error, errorMessage, prefixIcon, suffixIcon, ...props }, ref) => {
    const baseStyles =
      'w-full bg-bg-500 text-text-primary placeholder-text-placeholder text-sm font-normal transition-all duration-200 ease-liquid focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

    const sizeStyles = {
      sm: 'h-9 px-3 text-sm rounded-md',
      md: 'h-11 px-4 text-sm rounded-lg',
      lg: 'h-[52px] px-5 text-base rounded-lg',
    }

    const resolvedSize = inputSize

    const stateStyles = error
      ? 'border-error/60 focus:border-error focus:shadow-[0_0_16px_rgba(255,23,68,0.4)]'
      : 'border-white/10 hover:border-white/15 focus:border-cyan-400/60 focus:shadow-[0_0_16px_rgba(0,240,255,0.4)] focus:bg-bg-600'

    const variantStyles = {
      default: 'border',
      search: 'border rounded-full pl-10',
      password: 'border pr-12',
    }

    return (
      <div className="w-full">
        <div className="relative">
          {prefixIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-ghost pointer-events-none">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              baseStyles,
              sizeStyles[resolvedSize],
              stateStyles,
              variantStyles[variant],
              prefixIcon && 'pl-10',
              suffixIcon && 'pr-12',
              'focus-ring',
              className
            )}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-error" />
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
