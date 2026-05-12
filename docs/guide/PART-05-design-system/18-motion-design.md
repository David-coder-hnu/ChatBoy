# 第18章 · 动效有呼吸

## 动效不是"加动画"

大多数开发者理解的"动效"是在完成后加一些 `transition` 和 `@keyframes`。SoulClone 不这样做。

动效是**信息架构的一部分**。一个元素如何出现、如何消失、如何响应你的操作——这些在"传达信息"：

- 一个页面模糊溶解 0.45s → "场景切换了，但一切还在"
- 一个卡片从下方弹入 → "新内容到了，请注意"
- 一个未读数字 spring 弹出 → "有事发生，来看"

---

## Motion.tsx 原语系统

所有动画必须通过 `Motion.tsx` 的 6 个导出组件——禁止在任何页面直接写 `motion.div`：

```tsx
// ✅ 用原语
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover, GlowPulse, CountUp }
  from '@/components/shared/Motion'

<FadeIn>
  <Card>内容</Card>
</FadeIn>

// ❌ 禁止在页面组件里写
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>...</motion.div>
```

为什么？有两个原因：

1. **一致性**：如果每个页面自己写动画参数，20 个 `opacity: 0 → 1` 会有 20 种时长和缓动曲线。原语统一了动画语言
2. **可维护性**：如果哪天想调整所有淡入动画的缓动曲线，改一处就够了

### 6 个原语

| 原语 | 做什么 | 典型参数 |
|------|--------|---------|
| `FadeIn` | 淡入 + 从下方升起 | `y: 20→0, opacity: 0→1, 0.5s, spring阻尼25` |
| `StaggerContainer` | 延迟容器——子元素依次入场 | `staggerDelay: 0.05s` |
| `StaggerItem` | 延迟子元素 | 放在 StaggerContainer 内，自动获得 stagger 延迟 |
| `ScaleOnHover` | hover 时微放大 | `scale: 1.0→1.02, 0.2s, ease-out` |
| `GlowPulse` | 呼吸光晕 | `opacity: 0.3→0.6, 4s, ease-in-out infinite` |
| `CountUp` | 数字滚动动画 | 从 0 滚动到目标数字 |

---

## 动画常量（全局统一）

```typescript
SPRING = { stiffness: 100, damping: 15 }        // 柔和弹簧（入场动画）
SPRING_SNAPPY = { stiffness: 200, damping: 20 }  // 快速弹簧（点击反馈）
DURATION_FAST = 0.25   // 快速响应（hover、微交互）
DURATION_NORMAL = 0.4  // 常规动画（入场、转场）
STAGGER = 0.05         // 列表项依次延迟
```

这些值在 `Motion.tsx` 中定义一次，整个项目复用。不在任何其他地方硬编码。

---

## 全局动效（App.tsx 中已挂载）

三个全局动效在所有页面上生效：

| 全局动效 | 作用 |
|---------|------|
| `PageTransition` | 路由切换时的模糊溶解转场（0.45s） |
| `GlobalRipple` | 点击触觉反馈——点击处扩散涟漪 |
| `ScrollProgress` | 页面顶部渐变色滚动进度条 |

---

## 动效协议

| 用途 | 时长 | 缓动 |
|------|------|------|
| 页面转场 | 0.45s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 卡片入场 | 0.5s | spring 阻尼 25 |
| Hover 微放大 | 0.2s | ease-out |
| 粒子浮动 | 3-8s 循环 | ease-in-out infinite |
| 光晕呼吸 | 4s 循环 | ease-in-out infinite |

---

## 被禁止的动效

重申减法原则中关于动效的部分：

| 禁止 | 为什么 |
|------|--------|
| 无限旋转 | 旋转 = 加载中。没在加载时旋转 = 焦虑 |
| 静态元素呼吸光晕 | 不动的卡片，一闪一闪 = 装饰，不是信息 |
| 文字闪烁/滑入 | 文字是内容，不是 chrome。内容不应该动 |

---

## Landing Page 的例外

Landing Page 和 OnboardingPage 有独立的沉浸式画布背景（ParticleShader、AnimatedBackground），因为它们是**故意独特的入场体验**。它们绕过 `AmbientBackground`，但这不意味着它们可以无视动效纪律——Motion 原语和常量仍然适用。

---

## 本章小结

- 动效是信息架构的一部分，不是装饰
- 6 个 Motion 原语统一整个应用的动画语言
- 动画常量全局定义一次，到处引用
- 三个全局动效在 App.tsx 挂载
- 页面转场 = 模糊溶解 0.45s，卡片入场 = spring 0.5s
