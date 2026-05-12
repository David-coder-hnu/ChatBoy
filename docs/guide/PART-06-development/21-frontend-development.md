# 第21章 · 前端开发指南

## 启动前端开发服务器

```bash
cd frontend
npm install        # 首次运行需要装依赖
npm run dev        # 启动 Vite 开发服务器
```

前端启动在 `http://localhost:5173`。改代码后浏览器自动刷新——Vite 的热模块替换（HMR）做到了亚秒级更新。

---

## 组件开发工作流

### 每次开发前：读 AGENTS.md 检查清单

```
□ 背景用 AmbientBackground（或豁免页）
□ 卡片用 <Card>（除了用空间分隔的列表项）
□ 动画用 Motion.tsx 原语
□ 加载/空/错误状态都处理了
□ 用了真实数据 hook（没有 mock 数组）
□ 可访问性检查清单通过
□ 减法原则检查清单通过
□ SVG 颜色用 CSS 变量（var(--accent-*)），不是硬编码色值
□ npm run build 通过
```

---

## 添加一个新页面

假设你要加一个"设置页"：

### 第 1 步：创建页面组件

```tsx
// frontend/src/pages/SettingsPage.tsx
import { AmbientBackground } from '@/components/shared/AmbientBackground'
import { Card } from '@/components/shared/Card'
import { FadeIn } from '@/components/shared/Motion'

export default function SettingsPage() {
  return (
    <AmbientBackground variant="home">
      <FadeIn>
        <Card variant="elevated">
          <h1>设置</h1>
        </Card>
      </FadeIn>
    </AmbientBackground>
  )
}
```

### 第 2 步：注册路由

```tsx
// frontend/src/App.tsx
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

// 在 <Routes> 中添加
<Route path="/settings" element={<SettingsPage />} />
```

### 第 3 步：如果需要数据，写 React Query hook

```tsx
// frontend/src/hooks/useSettings.ts
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/v1/settings').then(r => r.data),
  })
}
```

---

## 使用现有设计组件

所有页面开发必须使用已有的共享组件，不要自己手写：

```tsx
// ✅ 用共享组件
<Card variant="glass" hoverable>...</Card>
<FadeIn><p>内容</p></FadeIn>
<SkeletonList count={3} />
<EmptyState icon={MessageIcon} title="暂无消息" />

// ❌ 禁止手写
<div className="bg-bg-500 border border-white/[0.06] rounded-2xl p-6">...</div>
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>...</motion.div>
```

---

## 四种状态必须处理

每个包含异步数据的组件必须处理四种状态：

```tsx
const { data, isLoading, error } = useConversations()

if (isLoading)        return <SkeletonList count={3} />
if (error)            return <ErrorState message="加载失败" onRetry={refetch} />
if (!data?.length)    return <ChatEmptyState />
return data.map(conv => <ConversationCard key={conv.id} data={conv} />)
```

---

## 构建和检查

```bash
# TypeScript 类型检查
npx tsc --noEmit

# 生产构建
npx vite build

# 预览生产构建
npx vite preview
```

主包控制在 ~264KB。Three.js 的 WebGL 代码被 Vite 自动拆到独立 chunk，只在 Landing Page 加载。

---

## 常用开发技巧

### Vite 路径别名

```typescript
import { Card } from '@/components/shared/Card'   // @ = frontend/src/
import { useConversations } from '@/hooks/useConversations'
import { useAuthStore } from '@/stores/authStore'
```

### Tailwind 设计 token

```tsx
<div className="bg-bg-surface text-primary border-accent-cyan/20">
  {/* 不是 bg-[#0a0a10] text-white border-[#00f0ff]/20 */}
</div>
```

用 Tailwind 配置中定义好的 token，不要直接用色值。

### 音效触发

```typescript
import { playSound } from '@/lib/sound'
playSound('send-message')
```

---

## 本章小结

1. `npm run dev` 启动前端
2. 开发前读 AGENTS.md 检查清单
3. 加页面 = 创建组件 + 注册路由 + (可选) 写 React Query hook
4. 必须使用共享组件（Card, Motion, AmbientBackground, DataState）
5. 异步组件必须处理四种状态
6. `npx tsc --noEmit && npx vite build` 确保通过
