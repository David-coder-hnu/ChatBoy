import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Send, Sparkles, User, Phone,
  Hand
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Message {
  id: string
  sender_type: 'human' | 'clone'
  content: string
  created_at: string
  is_takeover_notification?: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender_type: 'clone',
    content: '嗨，你好呀！我是通过匹配发现你的，感觉我们兴趣很相似 ✨',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    sender_type: 'human',
    content: '哈哈真的吗？你平时喜欢做什么？',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
  },
  {
    id: '3',
    sender_type: 'clone',
    content: '我喜欢摄影和咖啡！周末经常带着相机去街拍，然后在咖啡馆修图。你呢？',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '4',
    sender_type: 'human',
    content: '我也喜欢拍照！不过我更多是用手机拍生活碎片 😂',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '5',
    sender_type: 'clone',
    content: '手机摄影也超棒的！重要的是记录下来的那个瞬间～ 你最近拍了什么好看的照片吗？',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
]

export default function ChatRoomPage() {
  useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState('')
  const [isTakeover, setIsTakeover] = useState(false)
  const [showTakeoverHint, setShowTakeoverHint] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: Message = {
      id: Date.now().toString(),
      sender_type: isTakeover ? 'human' : 'clone',
      content: input,
      created_at: new Date().toISOString(),
    }
    setMessages((p) => [...p, newMsg])
    setInput('')
  }

  const toggleTakeover = () => {
    if (!isTakeover) {
      setShowTakeoverHint(true)
      setTimeout(() => setShowTakeoverHint(false), 3000)
    }
    setIsTakeover(!isTakeover)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 shrink-0 z-20">
        <button
          onClick={() => navigate('/chat')}
          className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/30 to-accent-magenta/30 flex items-center justify-center">
            <span className="font-display font-bold">雨</span>
          </div>
          <div>
            <h2 className="font-medium">小雨</h2>
            <div className="flex items-center gap-1 text-text-ghost text-xs">
              <Sparkles size={10} className="text-accent-cyan" />
              <span>身份未知</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface border border-white/5">
            <Phone size={12} className="text-accent-gold" />
            <span className="text-xs text-text-secondary">亲密度 65</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender_type === 'human' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  msg.sender_type === 'human'
                    ? 'bg-accent-cyan/20 text-text-primary rounded-br-md'
                    : 'glass border border-white/5 rounded-bl-md'
                }`}
              >
                {msg.sender_type === 'clone' && !isTakeover && (
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles size={10} className="text-accent-cyan" />
                    <span className="text-[10px] text-accent-cyan">孪生代发</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className="text-[10px] text-text-ghost mt-1 text-right">
                  {formatDate(msg.created_at)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Takeover hint */}
      <AnimatePresence>
        {showTakeoverHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 py-2 bg-accent-cyan/10 border-t border-accent-cyan/20 text-center"
          >
            <p className="text-accent-cyan text-sm">你已附身到孪生，现在由你亲自聊天</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="glass border-t border-white/5 p-4 shrink-0">
        {!isTakeover && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-accent-cyan/5 border border-accent-cyan/10">
            <Sparkles size={14} className="text-accent-cyan" />
            <span className="text-xs text-accent-cyan">你的孪生正在替你聊天</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTakeover}
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isTakeover
                ? 'bg-accent-cyan text-white glow-cyan'
                : 'glass border border-white/10 text-text-secondary hover:text-accent-cyan'
            }`}
          >
            {isTakeover ? <User size={20} /> : <Hand size={20} />}
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isTakeover ? '以真人身份发送...' : '以孪生身份发送...'}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-text-primary placeholder-text-ghost focus:outline-none focus:border-accent-cyan/50 transition-colors pr-12"
            />
            <button
              onClick={sendMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
