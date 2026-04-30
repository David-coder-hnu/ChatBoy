# SoulClone Design Constitution

> **Law**: Any agent editing UI must follow this document. When in doubt, choose consistency over novelty.

---

## 1. Background System

**Mandate**: All page backgrounds go through `<AmbientBackground>`.

```tsx
// ✅ Correct
<AmbientBackground variant="home">
  <div className="p-4">...</div>
</AmbientBackground>

// ❌ Forbidden — no page writes its own bg divs
<div className="fixed inset-0 mesh-gradient ..." />
```

**Variants**: `home` · `discover` · `chat` · `feed` · `profile` · `clone` · `calibration` · `auth`

**Exception**: LandingPage and OnboardingPage may use their own immersive canvas backgrounds (ParticleShader, AnimatedBackground) because they are intentionally unique entry experiences.

---

## 2. Card System

**Mandate**: Every card-like container must use `<Card>`.

```tsx
// ✅ Correct
<Card variant="elevated" hoverable>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// ❌ Forbidden — no hand-rolled card divs
<div className="bg-bg-500 border border-white/[0.06] rounded-2xl p-6">...</div>
```

**Variants**:

| Variant | Use Case |
|---------|----------|
| `glass` | Low-emphasis lists, secondary info |
| `elevated` | Primary content, hero cards, status panels |
| `flat` | Stats, menu items, dense data grids |
| `liquid` | Auth forms, premium CTAs — gradient border via mask-composite |

**Props**: `hoverable` · `selectable` · `selected`

---

## 3. Animation System

**Mandate**: All animations go through `Motion.tsx` primitives.

```tsx
// ✅ Correct
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover, GlowPulse, CountUp } from '@/components/shared/Motion'

// ❌ Forbidden — no inline motion.div repetition
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>...</motion.div>
```

**Constants** (never hardcode elsewhere):

```ts
SPRING = { stiffness: 100, damping: 15 }
SPRING_SNAPPY = { stiffness: 200, damping: 20 }
DURATION_FAST = 0.25
DURATION_NORMAL = 0.4
STAGGER = 0.05
```

**Global Effects** (already mounted in `App.tsx`):
- `PageTransition` — route-level enter/exit
- `GlobalRipple` — click tactile feedback
- `ScrollProgress` — gradient scroll indicator

---

## 4. Data States

**Mandate**: Every async surface must handle all four states.

```tsx
const { data, isLoading, error } = useSomeQuery()

if (isLoading) return <SkeletonList count={3} />
if (error) return <ErrorState message="..." onRetry={refetch} />
if (!data || data.length === 0) return <SomeEmptyState />
return <RealContent data={data} />
```

**Components**:
- `SkeletonCard` / `SkeletonList` — shimmer pulse with brand gradient
- `EmptyState` — icon + title + description + optional action
- `ErrorState` — retry button + expandable details
- `LoadingSpinner` — branded orbit animation

**Pre-configured empties**: `ChatEmptyState` · `DiscoverEmptyState` · `FeedEmptyState`

---

## 5. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#050508` | Page canvas |
| Surface | `#0a0a10` | Content cards |
| Elevated | `#0f0f14` | Hover lift |
| Accent Cyan | `#00f0ff` | Primary interactive |
| Accent Magenta | `#ff006e` | Emotion / unread / like |
| Accent Gold | `#ffbe0b` | Achievement / CTA |

**Text**:
- `text-primary` — headings, body
- `text-secondary` — subtitles, metadata
- `text-tertiary` — timestamps, hints
- `text-ghost` — disabled, placeholders

---

## 6. Typography

| Role | Font | Weight |
|------|------|--------|
| Display / Headings | Sora + Noto Serif SC | 700 |
| Body | Inter | 400 |
| Data / Numbers | JetBrains Mono | 500 |

**Rules**:
- Headings use `font-sans`
- Numbers use `font-mono`
- Never use raw font sizes — use Tailwind scale (`text-sm`, `text-base`, etc.)

---

## 7. Spacing

- Page padding: `p-4` mobile · `p-8` desktop
- Max content width: `max-w-5xl` (home) · `max-w-3xl` (chat) · `max-w-2xl` (feed/profile)
- Card internal padding: `p-5` or `p-6`
- Grid gaps: `gap-4` standard · `gap-3` dense · `gap-6` spacious

---

## 8. Real Data Only

**Mandate**: Zero mock data in production pages. Every list must use a React Query hook.

**Existing hooks** (use them, don't recreate):

| Hook | Endpoint | Page |
|------|----------|------|
| `useConversations` | `GET /conversations` | ChatPage |
| `useDiscoverProfiles` | `GET /matches/discover` | DiscoverPage |
| `useFeedPosts` | `GET /feed` | FeedPage |
| `useUserProfile` | `GET /users/me` | ProfilePage |
| `useNotifications` | `GET /notifications` | HomePage (bell) |
| `useCloneStats` | `GET /clones/me` | HomePage, ClonePage |
| `useCloneActivities` | `GET /clones/me/activities` | HomePage, ClonePage |

---

## 9. The "One More Thing" Principle

Every major page must have **one** detail that exceeds expectations:

| Page | Detail |
|------|--------|
| HomePage | Conic gradient glow on online toggle |
| ChatPage | Intimacy-based cyan pulse on high-intimacy conversations |
| DiscoverPage | Particle trail following swipe direction |
| FeedPage | Ghost icon (👻) on twin posts — visible only in dark |
| ProfilePage | Big Five radar chart from distilled persona |
| Login/Register | Liquid gradient border via mask-composite |
| ClonePage | Glowing status orb with breathing animation |

---

## 10. Component Checklist

Before committing UI changes, verify:

- [ ] Background uses `AmbientBackground` (or exempt page)
- [ ] Cards use `<Card>`
- [ ] Animations use `Motion.tsx` primitives
- [ ] Loading / empty / error states handled
- [ ] Real data hooks used (no mock arrays)
- [ ] Frontend builds: `tsc && vite build` clean
- [ ] Backend passes: `ruff check .` clean
