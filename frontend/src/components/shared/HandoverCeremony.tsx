import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { playSound } from '@/lib/sound'

// ───────── Handover Ceremony ─────────
// When the user goes offline, their twin takes over.
// This is the ritual of consciousness transfer — not a toggle switch,
// but a moment of magic.

interface HandoverCeremonyProps {
  visible: boolean
  userName?: string
  twinName?: string
  userAvatar?: string | null
  twinAvatar?: string | null
  onComplete?: () => void
}

type Phase = 'separation' | 'transfer' | 'complete'

export default function HandoverCeremony({
  visible,
  userName = '你',
  twinName = '你的孪生',
  userAvatar,
  twinAvatar,
  onComplete,
}: HandoverCeremonyProps) {
  const [phase, setPhase] = useState<Phase>('separation')

  useEffect(() => {
    if (!visible) {
      setPhase('separation')
      return
    }

    // Phase timeline
    playSound('handover')
    const t1 = setTimeout(() => setPhase('transfer'), 1200)
    const t2 = setTimeout(() => setPhase('complete'), 2400)
    const t3 = setTimeout(() => {
      onComplete?.()
    }, 3800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [visible, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />

          {/* Ambient glow */}
          <motion.div
            animate={{
              opacity: phase === 'transfer' ? [0.3, 0.6, 0.3] : 0.2,
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-accent-cyan/10 via-accent-magenta/10 to-accent-gold/10 blur-[100px]"
          />

          <div className="relative flex items-center gap-16 md:gap-24">
            {/* User Avatar */}
            <motion.div
              animate={{
                opacity: phase === 'separation' ? 1 : phase === 'transfer' ? 0.3 : 0,
                scale: phase === 'separation' ? 1 : 0.8,
                filter: phase === 'separation' ? 'blur(0px)' : 'blur(4px)',
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-white/10"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-bg-600 border-2 border-white/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-text-secondary">{userName[0]}</span>
                  </div>
                )}
                {/* User glow ring */}
                <motion.div
                  animate={{
                    boxShadow: phase === 'separation'
                      ? ['0 0 20px rgba(0,240,255,0.3)', '0 0 40px rgba(0,240,255,0.2)', '0 0 20px rgba(0,240,255,0.3)']
                      : '0 0 0px rgba(0,240,255,0)',
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                />
              </div>
              <span className="mt-4 text-sm text-text-secondary">{userName}</span>
            </motion.div>

            {/* Transfer Beam */}
            <div className="relative w-24 md:w-32 h-1">
              {/* Beam track */}
              <div className="absolute inset-0 bg-bg-600 rounded-full" />

              {/* Animated beam */}
              <motion.div
                initial={{ width: '0%', opacity: 0 }}
                animate={{
                  width: phase === 'transfer' ? '100%' : phase === 'complete' ? '100%' : '0%',
                  opacity: phase === 'transfer' ? 1 : phase === 'complete' ? 0.5 : 0,
                }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-cyan via-accent-magenta to-accent-gold"
              />

              {/* Traveling particle */}
              {phase === 'transfer' && (
                <motion.div
                  initial={{ left: '0%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                />
              )}

              {/* Phase text above beam */}
              <motion.div
                animate={{ opacity: phase === 'separation' ? 1 : 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-xs text-text-tertiary tracking-widest">意识分离中</span>
              </motion.div>
              <motion.div
                animate={{ opacity: phase === 'transfer' ? 1 : 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-xs text-accent-cyan tracking-widest">意识传输中</span>
              </motion.div>
              <motion.div
                animate={{ opacity: phase === 'complete' ? 1 : 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-xs text-accent-gold tracking-widest">交接完成</span>
              </motion.div>
            </div>

            {/* Twin Avatar */}
            <motion.div
              animate={{
                opacity: phase === 'complete' ? 1 : phase === 'transfer' ? 0.5 : 0.2,
                scale: phase === 'complete' ? 1 : 0.85,
                filter: phase === 'complete' ? 'blur(0px)' : 'blur(6px)',
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                {twinAvatar ? (
                  <img
                    src={twinAvatar}
                    alt={twinName}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-accent-cyan/30"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-magenta/20 border-2 border-accent-cyan/30 flex items-center justify-center">
                    <Sparkles size={28} className="text-accent-cyan" />
                  </div>
                )}
                {/* Twin glow ring */}
                <motion.div
                  animate={{
                    boxShadow: phase === 'complete'
                      ? ['0 0 20px rgba(0,240,255,0.3)', '0 0 40px rgba(255,0,110,0.2)', '0 0 20px rgba(255,190,11,0.2)']
                      : '0 0 0px rgba(0,240,255,0)',
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                />
              </div>
              <span className="mt-4 text-sm text-text-secondary">{twinName}</span>
            </motion.div>
          </div>

          {/* Bottom poetic text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: phase === 'complete' ? 1 : 0,
              y: phase === 'complete' ? 0 : 20,
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-20 left-0 right-0 text-center"
          >
            <p className="text-text-secondary text-sm italic">
              "你关机的那一刻，另一个你，正在真诚地与世界说你好。"
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
