import { motion } from 'framer-motion'

interface HeroRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function HeroTitle({ children, className, delay = 0.4 }: HeroRevealProps) {
  return (
    <motion.div
      initial={{ x: 80, opacity: 0, filter: 'blur(10px)' }}
      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HeroSubtitle({ children, className, delay = 0.9 }: HeroRevealProps) {
  return (
    <motion.div
      initial={{ x: 60, opacity: 0, filter: 'blur(8px)' }}
      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HeroCTA({ children, className, delay = 1.2 }: HeroRevealProps) {
  return (
    <motion.div
      initial={{ x: 40, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HeroBadge({ children, className, delay = 0.2 }: HeroRevealProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
