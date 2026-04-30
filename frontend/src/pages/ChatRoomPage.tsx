import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Send, Sparkles, User, Phone,
  Hand, MoreHorizontal
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

interface Message {
  id: string
  is_from_me: boolean
  content: string
  created_at: string
  is_ai_twin?: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    is_from_me: false,
    content: '嗨，你好呀！我是通过匹配发现你的，感觉我们兴趣很相似 ✨',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    is_from_me: true,
    content: '哈哈真的吗？你平时喜欢做什么？',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
  },
  {
    id: '3',
    is_from_me: false,
    content: '我喜欢摄影和咖啡！周末经常带着相机去街拍，然后在咖啡馆修图。你呢？',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '4',
    is_from_me: true,
    is_ai_twin: true,
    content: '我也喜欢拍照！不过我更多是用手机拍生活碎片 😂',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '5',
    is_from_me: false,
    content: '手机摄影也超棒的！重要的是记录下来的那个瞬间～ 你最近拍了什么好看的照片吗？',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
]

export default function ChatRoomPage() {
  useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState('')
  const [isManualMode, setIsManualMode] = useState(false)
  const [showModeHint, setShowModeHint] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: Message = {
      id: Date.now().toString(),
      is_from_me: true,
      content: input,
      created_at: new Date().toISOString(),
    }
    setMessages((p) => [...p, newMsg])
    setInput('')
    inputRef.current?.focus()

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        is_from_me: false,
        content: '听起来很棒！有机会一定要看看你的作品 ✨',
        created_at: new Date().toISOString(),
      }
      setMessages((p) => [...p, reply])
    }, 2000)
  }

  const toggleMode = () => {
    if (!isManualMode) {
      setShowModeHint(true)
      setTimeout(() => setShowModeHint(false), 3000)
    }
    setIsManualMode(!isManualMode)
  }

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent-cyan/2 rounded-full blur-[150px] pointer-events-none animate-breathe" />

      {/* Header: Top Navigation (glass) */}
      <div className="glass border-b border-white/[0.06] px-4 py-3 flex items-center gap-3 shrink-0 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/chat')}
          className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors duration-150"
        >
          <ArrowLeft size={20} />
        </motion.button>

        <div className="flex-1 flex items-center gap-3">
          <Avatar size="sm" status="online" fallback="雨" />
          <div>
            <h2 className="font-medium text-sm">小雨</h2>
            <div className="flex items-center gap-1 text-text-tertiary text-xs">
              <Sparkles size={10} className="text-accent-gold" />
              <span>身份未知</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-white/[0.08]">
            <Phone size={12} className="text-accent-gold" />
            <span className="text-xs text-text-secondary">亲密度 65</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors duration-150"
          >
            <MoreHorizontal size={18} className="text-text-secondary" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {/* System message */}
        <div className="text-center py-2">
          <span className="text-[10px] text-text-tertiary">对方 AI 孪生已接管对话</span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index < 5 ? 0 : 0 }}
              className={`flex ${msg.is_from_me ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[80%] sm:max-w-[70%]">
                {/* AI Twin badge */}
                {msg.is_ai_twin && (
                  <Badge variant="gold" size="sm" className="mb-1">
                    AI 孪生
                  </Badge>
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`px-4 py-3 rounded-2xl ${
                    msg.is_from_me && !msg.is_ai_twin
                      ? 'bg-accent-cyan/10 backdrop-blur-lg border border-accent-cyan/25 text-text-primary rounded-br-sm'
                      : msg.is_ai_twin
                      ? 'bg-gradient-to-r from-cyan-500/5 to-magenta-500/5 backdrop-blur-xl border border-cyan-400/20 text-text-primary rounded-br-sm'
                      : 'glass border border-white/[0.08] rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-[10px] text-text-tertiary mt-1.5 text-right">
                    {formatDate(msg.created_at)}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex justify-start"
            >
              <div className="glass border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                    className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                    className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                    className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Mode hint */}
      <AnimatePresence>
        {showModeHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 py-2.5 bg-cyan-500/10 border-t border-cyan-400/20 text-center z-20"
          >
            <p className="text-accent-cyan text-sm font-medium">已切换为手动模式，现在由你亲自回复</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="glass-strong border-t border-white/[0.06] p-4 shrink-0 z-20 relative">
        {!isManualMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-gold-500/5 border border-gold-400/10"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={14} className="text-accent-gold" />
            </motion.div>
            <span className="text-xs text-accent-gold">智能辅助已开启</span>
          </motion.div>
        )}

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMode}
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 ease-spring ${
              isManualMode
                ? 'bg-gradient-to-br from-accent-cyan to-accent-magenta text-white glow-cyan-md'
                : 'glass border border-white/[0.08] text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/30'
            }`}
          >
            {isManualMode ? <User size={20} /> : <Hand size={20} />}
          </motion.button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="说点什么..."
              className="w-full px-4 py-3 rounded-xl bg-[rgba(15,15,20,0.4)] backdrop-blur-xl border border-white/10 text-text-primary placeholder-text-placeholder focus:outline-none focus:border-cyan-400/60 focus:shadow-[0_0_16px_rgba(0,240,255,0.4)] focus:bg-[rgba(24,24,32,0.6)] transition-all duration-200 ease-liquid pr-12"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/25 hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all duration-150 ease-spring disabled:opacity-30 disabled:hover:shadow-none"
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
