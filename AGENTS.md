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

**Iron law**: One page, one dominant color. Page backgrounds must not blend all three brand colors. A two-color gradient is acceptable ONLY as a visual transition element on a specific UI component (e.g., an auth card border, an onboarding completion badge) — never as a page background. If cyan+magenta+gold appear together in one element, the color system loses all meaning. The only valid three-color combination is in the logo — because the logo IS the three colors meeting.

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Background | `#050508` | — | Page canvas |
| Surface | `#0a0a10` | `--bg-surface` | Content cards |
| Elevated | `#0f0f14` | `--bg-elevated` | Hover lift |
| Accent Cyan | `#00f0ff` | `--accent-cyan` | Primary interactive |
| Accent Magenta | `#ff006e` | `--accent-magenta` | Emotion / unread / like |
| Accent Gold | `#ffbe0b` | `--accent-gold` | Achievement / CTA |

**Rule**: All SVG and inline color values must use CSS variables (`var(--accent-cyan)`), not hard-coded hex. Hard-coded hex is only allowed in `index.css` token definitions.

**Fidelity Tier Colors** (semantic mapping for fidelity/clone quality UI):

| Tier | Color | CSS Variable | Meaning |
|------|-------|-------------|---------|
| 精良级 (≥85) | Gold | `--accent-gold` | Clone is highly faithful |
| 稳固级 (65-84) | Cyan | `--accent-cyan` | Good alignment, room to improve |
| 初级 (40-64) | Magenta | `--accent-magenta` | Basic framework, low precision |
| 待校准 (<40) | Magenta | `--accent-magenta` | Insufficient training data |

**Page-Dominant Colors** (one per page — tells the user which "chapter" they're in):

| Page | Dominant | Usage |
|------|----------|-------|
| Home | Cyan | Stats highlights, primary CTAs, active states |
| Chat | Cyan | Send button, online indicators, links |
| Discover | Magenta | Swipe hearts, match highlights, CTA buttons |
| Profile | Magenta | Edit actions, relationship stats |
| Clone | Gold | Radar fill, autonomy level, fidelity panel, achievement badges |
| Calibration | Gold | Test results, progress indicators |
| Feed | Cyan→Gold | Post actions, engagement metrics |
| Auth | Cyan→Magenta | Form focus, button accents |
| Onboarding (complete) | Cyan→Gold | Completion badge gradient only — not background |

**Text**:
- `text-primary` — headings, body
- `text-secondary` — subtitles, metadata
- `text-tertiary` — timestamps, hints
- `text-ghost` — disabled, placeholders

---

## 6. Typography

| Role | Font | Weight |
|------|------|--------|
| Display | Newsreader + LXGW WenKai | Light 300 |
| Headings | LXGW WenKai + Newsreader | 400 |
| Body | Inter + PingFang SC | 400 |
| Data / Numbers | JetBrains Mono | 500 |

**Rules**:
- Display headlines use `font-display` (Newsreader, Light 300, tracking `-0.02em`)
- Chinese headings use `font-heading` (LXGW WenKai)
- Body text uses `font-body` (Inter)
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
| `useCloneProfile` | `GET /distillation/profile` | ClonePage, OnboardingPage |
| `useDailyBrief` | `GET /clones/me/daily-brief` | HomePage |
| `useCalibrate` | `POST /distillation/calibrate` | OnboardingPage (VoicePreview feedback) |

---

## 9. The "One More Thing" Principle

Every major page must have **one** detail that exceeds expectations — exactly one. Not two. One.

This detail must be **discoverable**, not **announced**. The user finds it; you don't shove it at them. It should feel like the product is whispering, not shouting.

| Page | Detail |
|------|--------|
| HomePage | Daily brief in clone's own first-person voice — not a system report, the clone talking to you |
| ChatPage | Intimacy-based cyan pulse ring on high-intimacy conversations |
| DiscoverPage | Particle trail following swipe direction |
| FeedPage | Ghost icon (👻) on twin posts — visible only in dark |
| ProfilePage | Big Five radar chart from distilled persona |
| Login/Register | Liquid gradient border via mask-composite |
| ClonePage | Fidelity panel with semantic color tier (Gold=精良/Cyan=稳固/Magenta=初级) |
| OnboardingPage (complete) | Voice preview — 3 sample clone replies with thumbs up/down feedback |

---

## 10. Sound System

Every key interaction has audio feedback via `playSound(name)` in `frontend/src/lib/sound.ts`.

| Interaction | Sound | Description |
|-------------|-------|-------------|
| Page transition | `page-transition` | Soft noise sweep |
| Send message | `send-message` | Crisp pluck (523 Hz) |
| Receive message | `receive-message` | Crystal chime (659+784 Hz) |
| Match success | `match` | Magic sparkle (523+659+784 Hz) |
| Toggle online | `toggle-on` | Power-up sweep (300→600 Hz) |
| Handover ceremony | `handover` | Ascending choral harmony |
| New notification | `notification` | Gentle bell (880+1109 Hz) |
| Error | `error` | Soft thud (150 Hz sawtooth) |

**Rules**:
- Sound is opt-out via localStorage key `soulclone-sound-enabled`
- Call `initAudioContext()` on first user interaction to satisfy autoplay policy
- Audio errors are non-critical — wrap in try/catch, never block UI

---

## 11. Component Checklist

Before committing UI changes, verify:

- [ ] Background uses `AmbientBackground` (or exempt page)
- [ ] Cards use `<Card>` (except stream/list items where space separates)
- [ ] Animations use `Motion.tsx` primitives
- [ ] Loading / empty / error states handled
- [ ] Real data hooks used (no mock arrays)
- [ ] **Accessibility checklist passed** (see §13.1)
- [ ] **Restraint checklist passed** (see §12)
- [ ] SVG colors use CSS variables (`var(--accent-*)`), not hard-coded hex
- [ ] Frontend builds: `tsc && vite build` clean
- [ ] Backend passes: `ruff check .` clean

---

## 12. The Subtraction Principle

> "真正的简洁不是没有杂乱。是让必要的东西变得美丽。大多数产品的问题是——他们加了太多东西，因为他们害怕'不够'。"
> — Jony Ive

This section codifies what agents must NOT do. Every rule below is a gate. You don't negotiate with gates.

### 12.1 Forbidden Patterns

These CSS classes, effects, and patterns are banned project-wide. They exist in `index.css` only so they can be deleted, not used.

| Forbidden | Reason | What to use instead |
|-----------|--------|---------------------|
| `text-glow-cyan` / `text-glow-magenta` / `text-glow-gold` | Text does not need to glow. If your typography hierarchy is correct, the eye already knows where to look. | Correct font weight + color token |
| `conic-glow` + `@keyframes conic-spin` | REMOVED 2026-05-11. Rotating gradient borders create visual anxiety. | Deleted from index.css and HomePage. |
| `cursor-glow` | A 300px radial gradient following the mouse is a gaming peripheral feature. This is a social platform, not a Razer driver panel. | Nothing. The cursor is fine as-is. |
| `text-shimmer` + `@keyframes shimmer` | Text animation that mimics PowerPoint "WordArt." Text should be confident and still. | Static text. If emphasis is needed, use `font-display` + Gold color. |
| `noise-overlay` | SVG film-grain texture on auth pages. Decorative noise with no semantic meaning. | Clean background. Let `AmbientBackground variant="auth"` handle atmosphere. |

### 12.2 Visual Budget: One Effect Per Element

Every interactive element gets exactly **one** visual response on hover/focus. Not two. Not three.

```
❌ BAD: hover → y:-4px + glow orb appears + bottom line appears + border color changes
✅ GOOD: hover → y:-2px + shadow deepens slightly
```

When adding a hover state, ask: "What is the ONE thing that needs to communicate 'this is interactive'?" Do that. Delete the rest.

### 12.3 Background Color Stack: Single Source of Truth

`AmbientBackground` controls page atmosphere. `mesh-gradient` in `index.css` is a global override that injects all three brand colors on every page. This contradicts the page-dominant color system (§5).

**Rule**: `mesh-gradient` must use only ONE color — the page-dominant accent — OR be removed entirely in favor of `AmbientBackground`. Never run both systems simultaneously with different color palettes.

### 12.4 Motion: No Infinite Rotation, No Gratuitous Spin

Motion serves two purposes: **feedback** (confirming an action happened) and **transition** (guiding attention between states).

Motion that serves neither purpose is noise:

| Forbidden | Why |
|-----------|-----|
| Infinite rotation (any element) | Rotation signals "loading." When nothing is loading, it's anxiety-inducing. |
| Pulsing glow on static elements | A glow that breathes on a card that's just sitting there is decorative, not informative. |
| Shimmer/slide on text | Text is content, not chrome. It should not move unless the content changed. |

**Allowed motion**:
- Page transitions (blur dissolve, 0.45s) — guides attention
- Entrance animations (fade+lift, 0.5s) — establishes hierarchy
- Hover responses (scale 1.02, 0.2s) — confirms interactivity
- Send/receive feedback (spring bounce on unread badge, message sent pluck sound) — confirms action
- Handover ceremony phases — narrative purpose

### 12.5 Chrome Belongs to the Browser

Scrollbars, selection colors, focus rings — these are browser UI. They should be quiet.

- **Scrollbar**: Single solid color at low opacity (≤0.15). No gradients. Customized per `index.css`.
- **Selection**: Already correct — `rgba(0,240,255,0.3)` on `#fff` text. Don't change.
- **Focus ring**: Already correct — cyan ring on dark background. Don't decorate further.

### 12.6 The "Delete Test"

Before adding any visual effect, answer:

1. **What information does this communicate?** If the answer is "it looks cool" — delete.
2. **Would the page be worse without it?** If you're not sure — delete.
3. **Is there already another effect serving the same purpose?** If yes — delete the newer one.

Every visual element on screen costs the user attention. If it's not paying rent in information, it's stealing from the things that matter.

---

## 13. Accessibility

Every UI change must maintain or improve accessibility. Accessibility is not an afterthought — it is scope.

### 13.1 Mandatory Checklist

Before committing any UI change:

- [ ] Interactive elements have `aria-label` or associated `<label htmlFor={id}>`
- [ ] Loading states use `role="status" aria-busy="true" aria-label="加载中"`
- [ ] Touch targets are ≥ 44x44px on mobile (`min-w-[44px] min-h-[44px]`)
- [ ] Images have meaningful `alt` text (decorative images may use `alt=""`)
- [ ] Form inputs have `id` attributes and associated labels
- [ ] Navigation uses semantic `<nav>` with `aria-label`
- [ ] Main content area is `<main>` with `id="main-content"` for skip-link

### 13.2 Global Infrastructure (already in place)

- **Skip-link**: AppShell includes a skip-to-content link for keyboard users
- **ARIA landmarks**: `role="navigation"` on FloatingDock, `role="main"` on content area
- **Focus rings**: Visible cyan ring on all interactive elements
- **Screen reader only**: `.sr-only` utility available in `index.css`
- **Custom scrollbar**: Dark theme harmony, webkit + Firefox compatible

### 13.3 Component-Level Rules

- `SkeletonCard` / `PostSkeleton`: Must carry `role="status" aria-busy="true"`
- `LoadingSpinner`: Used as Suspense fallback, carries implicit loading state
- `EmptyState` / `ErrorState`: Already carry descriptive text — ensure it's meaningful
- Form inputs: Use the `label` prop on `<Input>` component for automatic htmlFor/id binding

> "真正的简洁不是没有杂乱。是让必要的东西变得美丽。大多数产品的问题是——他们加了太多东西，因为他们害怕'不够'。"
> — Jony Ive

This section codifies what agents must NOT do. Every rule below is a gate. You don't negotiate with gates.

### 12.1 Forbidden Patterns

These CSS classes, effects, and patterns are banned project-wide. They exist in `index.css` only so they can be deleted, not used.

| Forbidden | Reason | What to use instead |
|-----------|--------|---------------------|
| `text-glow-cyan` / `text-glow-magenta` / `text-glow-gold` | Text does not need to glow. If your typography hierarchy is correct, the eye already knows where to look. | Correct font weight + color token |
| `conic-glow` + `@keyframes conic-spin` | Rotating gradient borders create visual anxiety. UI should feel still, not spinning. | Static border with page-dominant color |
| `cursor-glow` | A 300px radial gradient following the mouse is a gaming peripheral feature. This is a social platform, not a Razer driver panel. | Nothing. The cursor is fine as-is. |
| `text-shimmer` + `@keyframes shimmer` | Text animation that mimics PowerPoint "WordArt." Text should be confident and still. | Static text. If emphasis is needed, use `font-display` + Gold color. |
| `noise-overlay` | SVG film-grain texture on auth pages. Decorative noise with no semantic meaning. | Clean background. Let `AmbientBackground variant="auth"` handle atmosphere. |

### 12.2 Visual Budget: One Effect Per Element

Every interactive element gets exactly **one** visual response on hover/focus. Not two. Not three.

```
❌ BAD: hover → y:-4px + glow orb appears + bottom line appears + border color changes
✅ GOOD: hover → y:-2px + shadow deepens slightly
```

When adding a hover state, ask: "What is the ONE thing that needs to communicate 'this is interactive'?" Do that. Delete the rest.

### 12.3 Background Color Stack: Single Source of Truth

`AmbientBackground` controls page atmosphere. `mesh-gradient` in `index.css` is a global override that injects all three brand colors on every page. This contradicts the page-dominant color system (§5).

**Rule**: `mesh-gradient` must use only ONE color — the page-dominant accent — OR be removed entirely in favor of `AmbientBackground`. Never run both systems simultaneously with different color palettes.

### 12.4 Motion: No Infinite Rotation, No Gratuitous Spin

Motion serves two purposes: **feedback** (confirming an action happened) and **transition** (guiding attention between states).

Motion that serves neither purpose is noise:

| Forbidden | Why |
|-----------|-----|
| Infinite rotation (any element) | Rotation signals "loading." When nothing is loading, it's anxiety-inducing. |
| Pulsing glow on static elements | A glow that breathes on a card that's just sitting there is decorative, not informative. |
| Shimmer/slide on text | Text is content, not chrome. It should not move unless the content changed. |

**Allowed motion**:
- Page transitions (blur dissolve, 0.45s) — guides attention
- Entrance animations (fade+lift, 0.5s) — establishes hierarchy
- Hover responses (scale 1.02, 0.2s) — confirms interactivity
- Send/receive feedback (spring bounce on unread badge, message sent pluck sound) — confirms action
- Handover ceremony phases — narrative purpose

### 12.5 Chrome Belongs to the Browser

Scrollbars, selection colors, focus rings — these are browser UI. They should be quiet.

- **Scrollbar**: Single solid color at low opacity (≤0.15). No gradients.
- **Selection**: Already correct — `rgba(0,240,255,0.3)` on `#fff` text. Don't change.
- **Focus ring**: Already correct — cyan ring on dark background. Don't decorate further.

### 12.6 The "Delete Test"

Before adding any visual effect, answer:

1. **What information does this communicate?** If the answer is "it looks cool" — delete.
2. **Would the page be worse without it?** If you're not sure — delete.
3. **Is there already another effect serving the same purpose?** If yes — delete the newer one.

Every visual element on screen costs the user attention. If it's not paying rent in information, it's stealing from the things that matter.
