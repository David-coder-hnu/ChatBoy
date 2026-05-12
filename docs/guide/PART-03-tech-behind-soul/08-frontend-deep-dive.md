# 第8章 · 前端深度解析——孪生的面孔

## React 19：组件化思维

SoulClone 前端有 **14 个页面**，每个页面是一个独立的 React 组件。它们不是一开始就全部加载——React Router 7 的**路由级懒加载**让用户只在访问某个页面时才下载它的代码。

```typescript
// 每个页面用 React.lazy() 懒加载
const HomePage = lazy(() => import('@/pages/HomePage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))
```

构建后的结果：主包只有 264KB，Three.js 的 WebGL 代码被拆到独立 chunk 里，只在 Landing Page 加载。

---

## 页面路由表

SoulClone 的 14 个路由和它们对应的页面：

| 路由 | 页面组件 | 功能 | 背景变体 |
|------|---------|------|----------|
| `/` | `LandingPage` | WebGL 粒子深海 + 品牌入口 | 独立 canvas 背景 |
| `/login` | `LoginPage` | 手机号 + 密码登录 | `auth` |
| `/register` | `RegisterPage` | 注册新账号 | `auth` |
| `/onboarding` | `OnboardingPage` | 问卷 + 蒸馏 + 声音预览 | 独立动画背景 |
| `/home` | `HomePage` | 首页仪表板 + 每日简报 | `home` |
| `/discover` | `DiscoverPage` | 滑动匹配 | `discover` |
| `/chat` | `ChatPage` | 消息列表（关系地图） | `chat` |
| `/chat/:id` | `ChatRoomPage` | 聊天室 + 意识流面板 | `chat` |
| `/feed` | `FeedPage` | 社交动态流 | `feed` |
| `/feed/create` | `CreatePostPage` | 发布动态 | `feed` |
| `/profile` | `ProfilePage` | 个人主页 | `profile` |
| `/clone` | `ClonePage` | 克隆仪表板 | `clone` |
| `/calibrate` | `CalibrationPage` | 校准中心 | `calibration` |
| `/notifications` | `NotificationsPage` | 通知列表 | 默认 |

---

## 状态管理：Zustand + React Query

SoulClone 用了**双层状态管理**：

### Zustand：客户端状态

Zustand 只管理一件事——**认证状态**：

```typescript
// stores/authStore.ts — 整个前端只有一个 Zustand store
interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (phone, password) => Promise<void>
  register: (phone, password) => Promise<void>
  logout: () => void
}
```

登录成功后，token 存入 `localStorage`（localStorage key: `soulclone-auth`）。页面刷新时从 localStorage 恢复，无需重新登录。

### React Query：服务端状态

**所有从后端获取的数据**都用 React Query（TanStack Query 5）管理。项目里大约有 20 个 data hook：

| Hook | API 端点 | 在哪里用 |
|------|---------|----------|
| `useConversations` | `GET /conversations` | ChatPage（消息列表） |
| `useDiscoverProfiles` | `GET /matches/discover` | DiscoverPage（匹配发现） |
| `useFeedPosts` | `GET /feed` | FeedPage（动态流） |
| `useUserProfile` | `GET /users/me` | ProfilePage（个人主页） |
| `useNotifications` | `GET /notifications` | 通知 bell 图标 |
| `useCloneStats` | `GET /clones/me` | HomePage, ClonePage |
| `useCloneActivities` | `GET /clones/me/activities` | HomePage, ClonePage |
| `useCloneProfile` | `GET /distillation/profile` | ClonePage, OnboardingPage |
| `useDailyBrief` | `GET /clones/me/daily-brief` | HomePage |
| `useCalibrate` | `POST /distillation/calibrate` | 声音预览反馈 |

React Query 自动处理了：
- **缓存**——数据不会每次切换页面都重新请求
- **过期重取**——数据过一段时间自动刷新
- **乐观更新**——发消息后立即显示，不等服务器确认
- **loading / error / data 三态**——每个异步组件必须处理这三种状态

---

## 设计系统组件

SoulClone 前端有一组**强制使用的基础组件**——不是"建议使用"，是"必须使用"。

### `<AmbientBackground>` — 页面氛围

每个页面必须包裹在 `AmbientBackground` 中：

```tsx
<AmbientBackground variant="home">
  <div>页面内容...</div>
</AmbientBackground>
```

8 种变体对应 8 种页面氛围：`home` · `discover` · `chat` · `feed` · `profile` · `clone` · `calibration` · `auth`。每种变体生成该页面专属的粒子光晕和色彩基调。

### `<Card>` — 卡片容器

所有卡片式容器必须用 `<Card>`：

```tsx
<Card variant="elevated" hoverable>
  <h3>标题</h3>
  <p>内容</p>
</Card>
```

4 种变体：`glass`（低强调列表）、`elevated`（主要内容卡）、`flat`（数据密集格）、`liquid`（液态渐变边框——用于登录表单等高价值 CTA）。

### `<Motion>` 动画原语

所有动画必须通过 `Motion.tsx` 的导出组件：

- `FadeIn` — 淡入 + 升起
- `StaggerContainer` — 延迟容器（子元素依次入场）
- `StaggerItem` — 延迟子元素
- `ScaleOnHover` — hover 时微放大
- `GlowPulse` — 呼吸光晕
- `CountUp` — 数字滚动动画

```tsx
// ✅ 用原语
<FadeIn><p>内容</p></FadeIn>

// ❌ 禁止直接写 motion.div
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>...</motion.div>
```

这保证了整个应用的动效语言一致——所有淡入用了同样的速度和缓动曲线，所有卡片 hover 有同样的弹簧手感。

### DataState 组件

每个需要异步数据的组件必须处理四种状态：

```tsx
const { data, isLoading, error } = useSomeQuery()

if (isLoading) return <SkeletonList count={3} />
if (error)     return <ErrorState message="..." onRetry={refetch} />
if (!data?.length) return <EmptyState ... />
return <RealContent data={data} />
```

预置组件：`SkeletonCard` / `SkeletonList`（品牌渐变骨架屏）、`EmptyState`（图标 + 标题 + 描述 + 可选按钮）、`ErrorState`（重试按钮 + 可展开详情）、`LoadingSpinner`（品牌轨道动画）。

---

## Axios 拦截器：自动带 Token

所有 API 请求通过 Axios 实例发出，自动在请求头附加 Bearer token：

```typescript
// 请求拦截器：每个请求自动带 token
instance.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器：401 自动跳转登录页
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
  }
)
```

---

## Tailwind 设计 Token

SoulClone 的 Tailwind 配置不只是 CSS 框架的默认配置——它是完整的设计 token 系统：

```typescript
// tailwind.config.ts 自定义项
colors: {
  accent: {
    cyan: '#00F0FF',     // 连接、消息、思维
    magenta: '#FF006E',  // 心跳、匹配、新关系
    gold: '#FFBE0B',     // 亲密度、灵魂伴侣、成就
  },
  bg: {
    surface: '#0A0A10',  // 内容卡背景
    elevated: '#0F0F14', // hover 浮起
  }
}
```

`clsx` + `tailwind-merge` + `class-variance-authority` 三元组合让组件变体管理变得清晰：

```tsx
const cardVariants = cva('rounded-2xl', {
  variants: {
    variant: {
      glass: 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]',
      elevated: 'bg-bg-surface border border-white/[0.08] shadow-lg',
      // ...
    }
  }
})
```

---

## 声音系统：Web Audio API

SoulClone 没有任何音频文件。8 种品牌音效全部通过 Web Audio API 从零合成：

```typescript
// lib/sound.ts
playSound('send-message')     // 发送消息 — 523Hz 清脆弹拨
playSound('receive-message')  // 接收消息 — 659+784Hz 水晶钟声
playSound('match')             // 匹配成功 — 魔法闪烁
playSound('toggle-on')         // 上线 — 300→600Hz 能量启动
playSound('handover')          // 交接 — 上升合唱和声
playSound('notification')      // 通知 — 880+1109Hz 柔和铃响
playSound('error')             // 错误 — 150Hz 柔和闷响
playSound('page-transition')   // 转场 — 柔和噪声扫频
```

声音默认开启，可通过 `localStorage` 的 `soulclone-sound-enabled` key 关闭。

---

## 本章小结

| 概念 | 一句话 |
|------|--------|
| 页面 | 14 个 React 组件，全部懒加载 |
| 路由 | React Router 7，首屏只加载当前页面 |
| 客户端状态 | Zustand — 只用来管认证 |
| 服务端状态 | React Query — 20 个 data hooks |
| 设计系统 | 强制使用 `AmbientBackground` / `Card` / `Motion` / DataState |
| API 调用 | Axios 自动带 token，401 自动跳登录 |
| 样式 | Tailwind CSS 3.4 + 自定义设计 token |
| 动画 | Framer Motion 11（声明式） + GSAP（精细控制） |
| 声音 | Web Audio API 零文件合成 |
