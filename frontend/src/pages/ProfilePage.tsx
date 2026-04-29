import { motion } from 'framer-motion'
import { MapPin, Calendar, Edit, LogOut, Settings } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useAuthStore } from '@/stores/authStore'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-elevated rounded-3xl p-6 md:p-8 mb-6 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
            <span className="font-display text-3xl font-bold text-white">
              {user?.nickname?.[0] || '?'}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold">{user?.nickname || '用户'}</h1>
          <p className="text-text-secondary mt-1">{user?.bio || '还没有简介'}</p>

          <div className="flex items-center justify-center gap-4 mt-4 text-text-secondary text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              上海
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              加入于 2024
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button className="px-6 py-2.5 rounded-xl glass text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
              <Edit size={16} />
              编辑资料
            </button>
            <button className="px-6 py-2.5 rounded-xl glass text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
              <Settings size={16} />
              设置
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: '匹配', value: '12' },
            { label: '对话', value: '48' },
            { label: '动态', value: '23' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-4 text-center">
              <p className="font-display text-2xl font-bold text-gradient">{stat.value}</p>
              <p className="text-text-ghost text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl glass text-accent-magenta hover:bg-accent-magenta/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </div>
    </AppShell>
  )
}
