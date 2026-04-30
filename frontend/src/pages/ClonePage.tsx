import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Sliders, Activity, MessageSquare, Brain, FlaskConical, ArrowRight, Power, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

export default function ClonePage() {
  const navigate = useNavigate()
  const [autonomy, setAutonomy] = useState(7)
  const [active, setActive] = useState(false)

  const traits = [
    { label: '开放性', value: 85 },
    { label: '尽责性', value: 70 },
    { label: '外向性', value: 60 },
    { label: '宜人性', value: 90 },
    { label: '情绪稳定', value: 65 },
  ]

  const stats = [
    { icon: MessageSquare, label: '总消息数', value: '156', color: 'text-accent-cyan' as const, bg: 'bg-accent-cyan' },
    { icon: Activity, label: '匹配成功', value: '12', color: 'text-accent-magenta' as const, bg: 'bg-accent-magenta' },
    { icon: Sparkles, label: '约会邀请', value: '2', color: 'text-accent-gold' as const, bg: 'bg-accent-gold' },
  ]

  const activities = [
    { time: '10:30', action: '回复了小雨的消息', type: 'message' },
    { time: '09:15', action: '与新用户匹配成功', type: 'match' },
    { time: '08:00', action: '自动上线', type: 'system' },
  ]

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-2xl mx-auto relative">
        <div className="fixed inset-0 mesh-gradient pointer-events-none" />
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent-cyan/3 rounded-full blur-[150px] pointer-events-none animate-breathe" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">克隆仪表板</h1>
              <p className="text-text-secondary text-sm mt-0.5">管理你的 AI 数字孪生</p>
            </div>
          </div>

          {/* Clone Identity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-elevated rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent-magenta/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <Avatar size="xl" ring="cyan" status="ai-twin-online" fallback="AI" />
              <h2 className="font-display text-xl font-bold mt-4">你的数字孪生</h2>
              <Badge variant="cyan" size="sm" className="mt-2">AI 孪生在线</Badge>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 w-full mt-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-mono text-2xl font-bold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Clone Status & Control */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-elevated rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={active ? {
                      boxShadow: ['0 0 20px rgba(0,240,255,0.2)', '0 0 40px rgba(0,240,255,0.4)', '0 0 20px rgba(0,240,255,0.2)']
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      active ? 'bg-gradient-to-br from-accent-cyan to-accent-magenta' : 'bg-bg-500 border border-white/10'
                    }`}
                  >
                    <Sparkles size={28} className={active ? 'text-white' : 'text-text-disabled'} />
                  </motion.div>
                  <div>
                    <h2 className="font-display text-xl font-bold tracking-tight">自动模式</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <motion.div
                        animate={active ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`w-2 h-2 rounded-full ${active ? 'bg-accent-cyan' : 'bg-text-disabled'}`}
                      />
                      <p className="text-text-secondary text-sm">
                        {active ? '正在自动运行中' : '当前处于手动状态'}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant={active ? 'secondary' : 'primary'}
                  size="md"
                  onClick={() => setActive(!active)}
                >
                  {active ? <Power size={16} /> : <Zap size={16} />}
                  {active ? '暂停' : '激活'}
                </Button>
              </div>

              {/* Autonomy Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders size={16} className="text-text-secondary" />
                    <span className="text-sm font-medium">自主等级</span>
                  </div>
                  <motion.span
                    key={autonomy}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-accent-cyan font-mono font-bold text-lg"
                  >
                    {autonomy}/10
                  </motion.span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={autonomy}
                    onChange={(e) => setAutonomy(Number(e.target.value))}
                    className="w-full h-1.5 bg-bg-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-cyan [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(0,240,255,0.5)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full pointer-events-none"
                    style={{ width: `${(autonomy - 1) / 9 * 100}%` }}
                  />
                </div>
                <motion.p
                  key={autonomy <= 3 ? 'low' : autonomy <= 7 ? 'mid' : 'high'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-text-tertiary text-xs"
                >
                  {autonomy <= 3 && '保守：只在收到消息时回复'}
                  {autonomy > 3 && autonomy <= 7 && '平衡：会主动维护和推进关系'}
                  {autonomy > 7 && '激进：非常主动，积极寻求新匹配'}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Calibration CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="glass rounded-2xl p-5 mb-6 border border-accent-cyan/20 cursor-pointer hover:border-accent-cyan/40 transition-all duration-250 ease-liquid group"
            onClick={() => navigate('/calibrate')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors duration-150">
                  <FlaskConical size={22} className="text-accent-cyan" />
                </div>
                <div>
                  <h3 className="font-medium">风格校准实验室</h3>
                  <p className="text-text-secondary text-sm">测试回复风格，提供反馈让系统更精准模仿你</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-text-tertiary group-hover:text-accent-cyan group-hover:translate-x-1 transition-all duration-150 ease-spring" />
            </div>
          </motion.div>

          {/* Personality + Stats Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain size={18} className="text-accent-cyan" />
                <h3 className="font-medium">人格核心</h3>
              </div>
              <div className="space-y-4">
                {traits.map((trait, i) => (
                  <motion.div
                    key={trait.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-secondary">{trait.label}</span>
                      <span className="text-text-primary font-mono font-medium">{trait.value}</span>
                    </div>
                    <div className="h-1.5 bg-bg-600 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trait.value}%` }}
                        transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 100 }}
                        className="h-full bg-gradient-to-r from-accent-cyan to-accent-magenta"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-accent-magenta" />
                <h3 className="font-medium">活跃度统计</h3>
              </div>
              <div className="space-y-3">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-bg-500/50 hover:bg-bg-500/80 transition-colors duration-150 cursor-default group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${stat.bg}/10 flex items-center justify-center`}>
                        <stat.icon size={16} className={stat.color} />
                      </div>
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-150">{stat.label}</span>
                    </div>
                    <span className="font-mono font-bold text-text-primary">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-5 mt-4"
          >
            <h3 className="font-medium mb-4">今日活动</h3>
            <div className="space-y-3">
              {activities.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs text-text-tertiary font-mono w-10">{activity.time}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60" />
                  <span className="text-sm text-text-secondary">{activity.action}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
