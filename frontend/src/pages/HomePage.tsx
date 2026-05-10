import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  MessageCircle, Heart, Users, Activity,
  ChevronRight, Sparkles, Bell, Ghost, Plus
} from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/authStore'
import { useCloneStats } from '@/hooks/useCloneStats'
import { useNotifications } from '@/hooks/useNotifications'
import { useDailyBrief } from '@/hooks/useDailyBrief'
import { FadeIn, StaggerContainer, StaggerItem, CountUp, GlowPulse } from '@/components/shared/Motion'
import { SkeletonList, ErrorState } from '@/components/shared/DataStates'
import AmbientBackground from '@/components/shared/AmbientBackground'
import HandoverCeremony from '@/components/shared/HandoverCeremony'
import { playSound } from '@/lib/sound'

export default function HomePage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: stats, isLoading: statsLoading, error: statsError } = useCloneStats()
  const { unreadCount: notifUnreadCount } = useNotifications()

  const [onlineActive, setOnlineActive] = useState(stats?.status === 'active')
  const [showHandover, setShowHandover] = useState(false)
  const unreadCount = notifUnreadCount || 0

  // Stats with real data fallback
  // Home page dominant = Cyan. Only the hero stat gets color.
  const statItems = stats ? [
    { icon: MessageCircle, label: '今日消息', value: stats.total_messages_sent || 0, color: 'text-accent-cyan', bg: 'bg-accent-cyan', highlight: true },
    { icon: Heart, label: '新匹配', value: stats.total_matches || 0, color: 'text-text-tertiary', bg: 'bg-text-tertiary', highlight: false },
    { icon: Users, label: '深入聊天', value: stats.total_conversations || 0, color: 'text-text-tertiary', bg: 'bg-text-tertiary', highlight: false },
    { icon: Activity, label: '社区互动', value: (stats.total_posts || 0) + (stats.total_comments || 0), color: 'text-text-tertiary', bg: 'bg-text-tertiary', highlight: false },
  ] : []

  const isLoading = statsLoading

  if (statsError) {
    return (
      <AppShell>
        <AmbientBackground variant="home">
          <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <ErrorState message="加载失败，请重试" onRetry={() => window.location.reload()} />
          </div>
        </AmbientBackground>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <AmbientBackground variant="home">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-xl md:text-2xl">
                  {stats?.status === 'active'
                    ? <>你的孪生今天替你回复了 <span className="text-accent-cyan font-mono">{stats.total_messages_sent || 0}</span> 条消息</>
                    : <>你好, <span className="text-accent-cyan">{user?.nickname || '探索者'}</span></>}
                </h1>
                <p className="text-text-secondary mt-1">
                  {stats?.status === 'active'
                    ? '它正在替你社交、匹配、维系关系'
                    : '你的孪生正在待命，激活后替你社交'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Notification Bell with bounce */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-xl bg-bg-600 border border-white/[0.08] hover:border-white/15 transition-colors"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell size={20} className="text-text-secondary" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-magenta"
                    />
                  )}
                </motion.button>

                {/* Online Toggle */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
                    onlineActive
                      ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                      : 'bg-bg-600 border-white/[0.08] text-text-secondary'
                  }`}
                  onClick={() => {
                    const next = !onlineActive
                    setOnlineActive(next)
                    if (!next) {
                      // Going offline — trigger the handover ceremony
                      setShowHandover(true)
                    } else {
                      playSound('toggle-on')
                    }
                  }}
                >
                  <motion.div
                    animate={onlineActive ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`w-2 h-2 rounded-full ${onlineActive ? 'bg-accent-cyan' : 'bg-text-ghost'}`}
                  />
                  <span className="text-sm">{onlineActive ? '在线中' : '离线中'}</span>
                </motion.button>
              </div>
            </div>
          </FadeIn>

          {/* Clone Status / Create Clone Card */}
          <FadeIn delay={0.05}>
            {stats === null ? (
              <Card variant="elevated" className="mb-8 border-accent-gold/20">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-gold to-accent-magenta flex items-center justify-center shadow-lg shadow-accent-gold/20">
                      <Plus size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-sans text-xl font-bold">创建你的孪生</h2>
                      <p className="text-text-secondary text-sm mt-0.5">
                        一个 AI 分身，学习你的说话风格，替你聊天、匹配、维系关系
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/onboarding')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-gold to-accent-magenta text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent-gold/30 transition-all"
                  >
                    立即创建
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </Card>
            ) : (
              <Card variant="elevated" className="mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <GlowPulse color="cyan">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        onlineActive
                          ? 'bg-gradient-to-br from-accent-cyan to-accent-magenta'
                          : 'bg-bg-600 border border-white/10'
                      }`}>
                        <Sparkles size={24} className={onlineActive ? 'text-white' : 'text-text-disabled'} />
                      </div>
                    </GlowPulse>
                    <div>
                      <h2 className="font-sans text-xl font-bold">自动模式</h2>
                      <p className="text-text-secondary text-sm">
                        {onlineActive ? '正在替你社交、匹配、维系关系' : '离线中，你的孪生不会主动行动'}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/clone"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.08] text-text-secondary text-sm font-medium hover:border-white/15 hover:text-text-primary transition-colors"
                  >
                    管理孪生
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </Card>
            )}
          </FadeIn>

          {/* Stats Dashboard Strip — single focal row, not competing cards */}
          {isLoading ? (
            <SkeletonList count={4} />
          ) : (
            <StaggerContainer className="flex items-center justify-between gap-2 mb-8 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              {statItems.map((stat, i) => (
                <StaggerItem key={stat.label}>
                  <div className={`flex items-center gap-3 ${i < statItems.length - 1 ? 'pr-4 border-r border-white/[0.04]' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg ${stat.highlight ? `${stat.bg}/10` : 'bg-white/[0.03]'} flex items-center justify-center`}>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <div>
                      <p className={`font-mono text-xl font-bold leading-none ${stat.highlight ? 'text-text-primary' : 'text-text-secondary'}`}>
                        <CountUp target={stat.value} />
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Daily Brief — story-driven replacement for activity log */}
          <DailyBriefSection />
        </div>
      </AmbientBackground>

      <HandoverCeremony
        visible={showHandover}
        userName={user?.nickname || '你'}
        twinName={stats?.name || '你的孪生'}
        userAvatar={user?.avatar_url}
        onComplete={() => setShowHandover(false)}
      />
    </AppShell>
  )
}

function DailyBriefSection() {
  const { data: brief, isLoading } = useDailyBrief()

  return (
    <FadeIn delay={0.2}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">今日简报</h3>
          <Link to="/clone" className="text-xs text-accent-cyan hover:underline">查看全部</Link>
        </div>
        {isLoading ? (
          <div className="h-16 bg-white/5 rounded-xl animate-pulse" />
        ) : brief?.brief ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="text-sm text-text-secondary leading-relaxed py-3 px-1"
          >
            {brief.brief}
          </motion.p>
        ) : (
          <div className="text-center py-6">
            <Ghost size={20} className="text-text-ghost mx-auto mb-2 opacity-40" />
            <p className="text-sm text-text-tertiary">{brief?.message || '你的孪生还在熟悉这个世界'}</p>
          </div>
        )}
      </div>
    </FadeIn>
  )
}
