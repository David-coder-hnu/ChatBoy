import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Zap, MessageCircle, Heart, Users, Activity,
  ChevronRight, Sparkles, Clock
} from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useAuthStore } from '@/stores/authStore'

export default function HomePage() {
  const { user } = useAuthStore()
  const [cloneActive, setCloneActive] = useState(false)

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              你好, <span className="text-gradient">{user?.nickname || '探索者'}</span>
            </h1>
            <p className="text-text-secondary mt-1">你的孪生今天已经活跃了 3 小时</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-cyan/20">
            <div className={`w-2 h-2 rounded-full ${cloneActive ? 'bg-accent-cyan animate-pulse' : 'bg-text-ghost'}`} />
            <span className="text-sm">{cloneActive ? '孪生在线' : '孪生离线'}</span>
          </div>
        </div>

        {/* Clone Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-elevated rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[80px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
                  <Sparkles size={28} className="text-white" />
                </div>
                {cloneActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-cyan border-2 border-background animate-pulse" />
                )}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">{user?.nickname || '你'}的孪生</h2>
                <p className="text-text-secondary text-sm">当前心情：愉悦</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCloneActive(!cloneActive)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  cloneActive
                    ? 'bg-accent-magenta/20 text-accent-magenta border border-accent-magenta/30 hover:bg-accent-magenta/30'
                    : 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/30'
                }`}
              >
                {cloneActive ? '暂停孪生' : '激活孪生'}
              </button>
              <Link
                to="/clone"
                className="px-6 py-3 rounded-xl glass text-text-primary font-semibold hover:bg-white/5 transition-colors"
              >
                管理
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
            {[
              { icon: MessageCircle, label: '今日消息', value: '24', color: 'text-accent-cyan' },
              { icon: Heart, label: '新匹配', value: '3', color: 'text-accent-magenta' },
              { icon: Users, label: '深入聊天', value: '2', color: 'text-accent-gold' },
              { icon: Activity, label: '社区互动', value: '7', color: 'text-green-400' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-text-ghost text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold">孪生活动</h3>
              <Link to="/clone" className="text-accent-cyan text-sm hover:underline flex items-center gap-1">
                查看全部 <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { action: '回复了 小雨 的消息', time: '5分钟前', type: 'message' },
                { action: '在动态下评论了', time: '12分钟前', type: 'comment' },
                { action: '与 阿杰 的亲密度达到 65', time: '30分钟前', type: 'intimacy' },
                { action: '浏览了推荐列表', time: '1小时前', type: 'browse' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center shrink-0">
                    <Activity size={14} className="text-accent-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.action}</p>
                    <p className="text-text-ghost text-xs">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pending Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-bold">待处理</h3>
              <span className="px-2 py-0.5 rounded-full bg-accent-gold/10 text-accent-gold text-xs">2</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-magenta/10 to-transparent border border-accent-magenta/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-magenta/20 flex items-center justify-center shrink-0">
                    <Heart size={18} className="text-accent-magenta" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">约会邀请请求</p>
                    <p className="text-text-secondary text-xs mt-1">
                      你的孪生认为与 小雨 的感情已足够深入，提议周末见面。你需要批准或修改。
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 rounded-lg bg-accent-cyan/20 text-accent-cyan text-xs font-medium hover:bg-accent-cyan/30 transition-colors">
                        查看详情
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-white/5 text-text-secondary text-xs font-medium hover:bg-white/10 transition-colors">
                        稍后处理
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-gold/10 to-transparent border border-accent-gold/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/20 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} className="text-accent-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">接管请求</p>
                    <p className="text-text-secondary text-xs mt-1">
                      你的孪生在聊天中遇到了一个无法确定如何回应的问题，请求你暂时接管。
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 rounded-lg bg-accent-cyan/20 text-accent-cyan text-xs font-medium hover:bg-accent-cyan/30 transition-colors">
                        立即附身
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
