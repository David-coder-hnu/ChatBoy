import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Compass, MessageCircle, Newspaper, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/home', icon: Home, label: '主页' },
  { path: '/discover', icon: Compass, label: '发现' },
  { path: '/feed', icon: Newspaper, label: '社区' },
  { path: '/chat', icon: MessageCircle, label: '聊天' },
  { path: '/profile', icon: User, label: '我的' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/chat/')

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-white/5 fixed h-full z-40">
        <div className="p-6">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-display font-bold text-xl text-gradient">SoulClone</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                location.pathname === item.path
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={cn('flex-1', !hideNav && 'pb-20 md:pb-0 md:ml-64')}>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      {!hideNav && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="md:hidden fixed bottom-0 left-0 right-0 glass-elevated border-t border-white/5 z-50"
        >
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-colors',
                  location.pathname === item.path
                    ? 'text-accent-cyan'
                    : 'text-text-secondary'
                )}
              >
                <item.icon size={22} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </div>
  )
}
