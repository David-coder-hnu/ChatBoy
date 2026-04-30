import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Edit, LogOut, Settings, Sparkles, Heart, MessageCircle, Users, Shield, Camera } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useAuthStore } from '@/stores/authStore'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const [hoverStat, setHoverStat] = useState<string | null>(null)

  const stats = [
    { icon: Users, label: '匹配', value: '12', color: 'text-accent-cyan' as const },
    { icon: MessageCircle, label: '对话', value: '48', color: 'text-accent-magenta' as const },
    { icon: Heart, label: '获赞', value: '156', color: 'text-accent-gold' as const },
    { icon: Sparkles, label: '动态', value: '23', color: 'text-accent-cyan' as const },
  ]

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-2xl mx-auto relative">
        <div className="fixed inset-0 mesh-gradient pointer-events-none" />
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent-cyan/2 rounded-full blur-[150px] pointer-events-none animate-breathe" />

        <div className="relative z-10">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-elevated rounded-3xl p-6 md:p-8 mb-6 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent-cyan/3 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative w-24 h-24 mx-auto mb-4"
              >
                <Avatar size="xl" ring="gradient" fallback={user?.nickname?.[0] || '?'} />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl glass-strong flex items-center justify-center cursor-pointer hover:border-accent-cyan/30 transition-colors duration-150"
                >
                  <Camera size={14} className="text-text-secondary" />
                </motion.div>
              </motion.div>

              <h1 className="font-sans text-2xl font-bold">{user?.nickname || '用户'}</h1>
              <p className="text-text-secondary mt-1">{user?.bio || '还没有简介'}</p>

              <div className="flex items-center justify-center gap-5 mt-4 text-text-secondary text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-text-tertiary" />
                  上海
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-text-tertiary" />
                  加入于 2024
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 mt-6">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Edit size={16} />
                  编辑资料
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Settings size={16} />
                  设置
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -4, scale: 1.03 }}
                onHoverStart={() => setHoverStat(stat.label)}
                onHoverEnd={() => setHoverStat(null)}
                className="glass rounded-2xl p-4 text-center transition-all duration-250 ease-liquid cursor-default"
              >
                <motion.div
                  animate={hoverStat === stat.label ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon size={18} className={`mx-auto mb-2 ${stat.color}`} />
                </motion.div>
                <motion.p
                  key={stat.value}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: i * 0.08 + 0.2 }}
                  className="font-mono text-2xl font-bold text-accent-cyan"
                >
                  {stat.value}
                </motion.p>
                <p className="text-text-tertiary text-xs mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Safety & Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                <Shield size={18} className="text-accent-cyan" />
              </div>
              <div>
                <h3 className="font-medium">隐私与安全</h3>
                <p className="text-text-secondary text-sm">你的数据完全加密存储</p>
              </div>
            </div>
            <div className="space-y-2">
              {['端到端加密聊天', '身份隐私保护', '随时删除所有数据'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-bg-500/50 hover:bg-bg-500/80 transition-colors duration-150 cursor-default group"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="w-2 h-2 rounded-full bg-accent-cyan"
                  />
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-150">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="danger"
              size="md"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              退出登录
            </Button>
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
