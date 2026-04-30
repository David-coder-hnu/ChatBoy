import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Zap, Shield, Heart, ChevronDown } from 'lucide-react'

import CursorTrail from '@/components/shared/CursorTrail'
import ParticleShader from '@/components/shared/ParticleShader'
import NeuralCard from '@/components/shared/NeuralCard'
import ScanLight from '@/components/shared/ScanLight'
import { HeroTitle, HeroSubtitle, HeroCTA, HeroBadge } from '@/components/shared/HeroReveal'
import ShimmerButton from '@/components/shared/ShimmerButton'
import NeuralWeaving from '@/components/shared/NeuralWeaving'
import EchoesTorus from '@/components/shared/EchoesTorus'

const features = [
  {
    icon: <Zap size={24} />,
    title: '深度个性延续',
    desc: '通过深度问卷和聊天样本，平台精确理解你的 personality、聊天风格和情感模式，让 AI 的你无缝延续真实的你。',
    accent: '#00f0ff',
  },
  {
    icon: <Heart size={24} />,
    title: '替你培养感情',
    desc: '你的在线状态会在你离线时继续聊天、匹配、培养关系。时机成熟时，它会邀请你批准下一步行动。',
    accent: '#ff006e',
  },
  {
    icon: <Shield size={24} />,
    title: '悬疑社交体验',
    desc: '对方永远不知道屏幕那头是真人还是在线状态。只有双方都同意时，真实身份才会揭晓。',
    accent: '#ffbe0b',
  },
]

const protocols = [
  {
    icon: <Zap size={22} />,
    title: '人格探测',
    desc: '12道深度心理学问题，结合MBTI和大五人格模型，构建精准人格画像。',
    accent: '#00f0ff',
  },
  {
    icon: <Heart size={22} />,
    title: '风格学习',
    desc: '上传聊天记录，AI 分析你的语气词、表情包习惯、回复节奏和幽默感。',
    accent: '#ff006e',
  },
  {
    icon: <Shield size={22} />,
    title: '自动运行',
    desc: '激活自动模式后，AI 克隆体在平台上独立社交、匹配、维系关系。',
    accent: '#ffbe0b',
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <CursorTrail />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[100dvh] w-full overflow-hidden">
        <ParticleShader />

        {/* Floating ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-[100px]"
              style={{
                width: 200 + i * 50,
                height: 200 + i * 50,
                background: ['rgba(0,240,255,0.04)', 'rgba(255,0,110,0.03)', 'rgba(255,190,11,0.03)'][i % 3],
                left: `${15 + (i * 11) % 70}%`,
                top: `${10 + (i * 17) % 80}%`,
              }}
              animate={{
                x: [0, 30, -20, 0],
                y: [0, -20, 30, 0],
                scale: [1, 1.15, 0.95, 1],
              }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <HeroBadge delay={0.2}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-cyan/30 mb-8 hover:border-accent-cyan/50 transition-colors cursor-default group">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={16} className="text-accent-cyan" />
              </motion.div>
              <span className="text-sm text-accent-cyan">新一代社交平台</span>
            </div>
          </HeroBadge>

          <HeroTitle delay={0.4}>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <ScanLight>你的灵魂</ScanLight>
              <br />
              <span className="text-gradient">不止一个容器</span>
            </h1>
          </HeroTitle>

          <HeroSubtitle delay={0.9}>
            <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              在这里，你的在线状态会延续你的 personality，替你维系关系、发现共鸣。
              当你离线时，另一个你在平台上继续生活。
            </p>
          </HeroSubtitle>

          <HeroCTA delay={1.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ShimmerButton to="/register" variant="gradient">
                <span>开始使用</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </ShimmerButton>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass text-text-primary font-semibold text-lg transition-all hover:bg-white/10 hover:border-white/20 border border-transparent hover:shadow-lg"
              >
                已有账号？登录
              </Link>
            </div>
          </HeroCTA>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-text-ghost text-xs tracking-widest uppercase">探索更多</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown size={20} className="text-text-ghost" />
            </motion.div>
          </motion.div>
        </div>

        {/* Ambient bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-[5]" />
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
            data-framer-initial
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 mb-6"
              data-framer-initial
            >
              <Sparkles size={14} className="text-accent-cyan" />
              <span className="text-xs text-accent-cyan">核心能力</span>
            </motion.div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              探索<span className="text-gradient">无限可能</span>
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              三大核心体验，重新定义社交方式
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <NeuralCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                desc={feature.desc}
                accent={feature.accent}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEURAL WEAVING (scroll-pinned card deck) ===== */}
      <NeuralWeaving />

      {/* ===== PROTOCOL MATRIX ===== */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
            data-framer-initial
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 mb-6">
              <Shield size={14} className="text-accent-gold" />
              <span className="text-xs text-accent-gold">协议矩阵</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              核心<span className="text-gradient">协议</span>
            </h2>
            <p className="text-text-secondary max-w-md mx-auto">
              SoulClone 的三大底层协议，确保 AI 克隆体真实可靠
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8" style={{ perspective: '1200px' }}>
            {protocols.map((protocol, i) => (
              <NeuralCard
                key={i}
                icon={protocol.icon}
                title={protocol.title}
                desc={protocol.desc}
                accent={protocol.accent}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ECHOES TORUS CTA ===== */}
      <EchoesTorus />

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-4 text-center text-text-ghost text-sm border-t border-white/5">
        <p>SoulClone — 让社交不止于当下</p>
      </footer>

      {/* No-JS / SSR fallback */}
      <noscript>
        <style>{`
          [data-framer-initial] { opacity: 1 !important; transform: none !important; }
        `}</style>
      </noscript>
    </div>
  )
}
