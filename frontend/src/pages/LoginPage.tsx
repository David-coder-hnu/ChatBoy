import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { phone, password })
      // Mock user data since backend returns token
      setAuth(
        { id: 'mock', phone, nickname: null, avatar_url: null, bio: null, status: 'active' },
        res.data.access_token
      )
      navigate('/home')
    } catch (err: any) {
      setError(err.response?.data?.detail || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-magenta/10 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors">
          <ArrowLeft size={18} />
          返回首页
        </Link>

        <div className="glass-elevated rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">欢迎回来</h1>
            <p className="text-text-secondary">登录你的 SoulClone 账号</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-text-primary placeholder-text-ghost focus:outline-none focus:border-accent-cyan/50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-text-primary placeholder-text-ghost focus:outline-none focus:border-accent-cyan/50 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-ghost hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-accent-magenta text-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-magenta text-white font-semibold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-cyan/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <p className="text-center mt-6 text-text-secondary text-sm">
            还没有账号？{' '}
            <Link to="/register" className="text-accent-cyan hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
