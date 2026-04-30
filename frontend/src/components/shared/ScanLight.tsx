import { cn } from '@/lib/utils'

interface ScanLightProps {
  children: React.ReactNode
  className?: string
  speed?: 'slow' | 'normal' | 'fast'
}

export default function ScanLight({ children, className, speed = 'normal' }: ScanLightProps) {
  const duration = speed === 'slow' ? '4s' : speed === 'fast' ? '2s' : '3s'

  return (
    <span className={cn('relative inline-block', className)}>
      {children}
      <span
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
        aria-hidden="true"
      >
        <span
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)`,
            backgroundSize: '200% 100%',
            animation: `scanlight ${duration} ease-in-out infinite`,
          }}
        />
      </span>
      <style>{`
        @keyframes scanlight {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </span>
  )
}
