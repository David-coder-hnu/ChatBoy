import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, Sparkles, User, Lock, Smartphone } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Input } from '@/components/ui/Input'
import { Divider } from '@/components/ui/Divider'

export default function RegisterPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', { phone, password, nickname })
      setAuth(
        { id: 'mock', phone, nickname: nickname || null, avatar_url: null, bio: null, status: 'distilling' },
        res.data.access_token
      )
      navigate('/onboarding')
    } catch (err: any) {
      setError(err.response?.data?.detail || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* Aurora Background */}
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent-magenta/3 rounded-full blur-[150px] pointer-events-none animate-breathe" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-accent-cyan/3 rounded-full blur-[150px] pointer-events-none animate-breathe" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-150 ease-spring" />
          <span className="text-sm">返回首页</span>
        </Link>

        {/* Card: Glass-Strong + gradient-border */}
        <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,0,110,0.15), rgba(255,190,11,0.2))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-magenta/3 rounded-full blur-[80px] pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/30 mb-4"
            >
              <Sparkles size={14} className="text-gold-400" />
              <span className="text-xs text-gold-400 font-medium">免费创建</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-3xl font-bold mb-2"
            >
              创建账号
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-text-secondary text-sm"
            >
              只需几分钟，开启你的数字孪生之旅
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="block text-sm font-medium mb-2 text-text-secondary">手机号</label>
              <div className="relative">
                <Smartphone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-ghost pointer-events-none z-10" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="请输入手机号"
                  inputSize="md"
                  className={focusedField === 'phone' ? 'glow-cyan-sm' : ''}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="block text-sm font-medium mb-2 text-text-secondary">昵称</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-ghost pointer-events-none z-10" />
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onFocus={() => setFocusedField('nickname')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="怎么称呼你？"
                  inputSize="md"
                  className={focusedField === 'nickname' ? 'glow-cyan-sm' : ''}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="block text-sm font-medium mb-2 text-text-secondary">密码</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-ghost pointer-events-none z-10" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="设置密码（至少6位）"
                  inputSize="md"
                  className={focusedField === 'password' ? 'glow-cyan-sm' : ''}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-ghost hover:text-text-secondary transition-colors duration-150 z-10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-error text-sm flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 rounded-full bg-gradient-to-r from-accent-gold to-accent-magenta text-white font-semibold text-base transition-all duration-150 ease-spring hover:shadow-lg hover:shadow-accent-gold/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group glow-gold-md hover:glow-gold-lg"
            >
              <span className="relative z-10">{loading ? '创建中...' : '创建账号'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-magenta to-accent-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 relative z-10"
          >
            <Divider label="或" className="mb-6" />

            <div className="flex items-center justify-center gap-4">
              {[
                { name: '微信', icon: 'W' },
                { name: 'Apple', icon: 'A' },
                { name: 'Google', icon: 'G' },
              ].map((s) => (
                <button
                  key={s.name}
                  className="w-11 h-11 rounded-full glass flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-white/15 transition-all duration-150 ease-spring active:scale-95"
                  title={s.name}
                >
                  <span className="text-sm font-semibold">{s.icon}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-text-secondary text-sm relative z-10"
          >
            已有账号？{' '}
            <Link to="/login" className="text-accent-cyan hover:text-accent-cyan-dark transition-colors font-medium">
              直接登录
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
