# 第25章 · 如何贡献

## 我们在找怎样的人

SoulClone 不是"缺人手"。我们在找**相信社交应该更像灵魂而非表演**的人。

### 四种贡献者画像

| 角色 | 你需要的能力 | 你会做什么 |
|------|------------|-----------|
| **视觉设计师** | 把"灵魂"翻译成像素的能力 | 设计系统维护、动效规范、空状态插画、暗色下的情感表达 |
| **前端工程师** | React 19 + Framer Motion + Web Audio API | 核心页面迭代、动效系统优化、性能调优、PWA 体验 |
| **AI 工程师** | LLM 微调、向量数据库、对话状态管理 | 人格蒸馏算法优化、情感记忆架构、RAG 管道设计 |
| **全栈工程师** | FastAPI + PostgreSQL + Redis + Docker | API 设计、数据库优化、实时通信架构、部署和监控 |

不确定自己适合哪个角色？直接在 Issue 里问："我想加入，我能做什么？"

---

## 提交 PR 的流程

### 1. Fork 仓库并创建功能分支

```bash
git checkout -b feat/my-feature
```

### 2. 写代码（遵循设计宪法）

**任何 UI 变更必须在 PR 描述中回答三个问题：**

1. 这个变更符合 Liquid Dark Matter 的哪一条原则？
2. 它使用了设计系统中的哪个组件/变体？
3. 它的空状态/错误状态/加载状态是什么？

### 3. 确保代码检查通过

```bash
# 后端
cd backend
ruff check .
ruff format .

# 前端
cd frontend
npx tsc --noEmit
npx vite build
```

### 4. 提交 PR

在 PR 描述中告诉我们：**你为什么在乎这件事？**

如果是 UI 变更，附上截图或录屏。

---

## 提交规范

使用以下前缀：

| 前缀 | 用途 | 示例 |
|------|------|------|
| `feat:` | 新功能 | `feat: add voice clone preview` |
| `fix:` | 修复 | `fix: resolve WebSocket reconnect loop` |
| `design:` | 设计/视觉变更 | `design: refine intimacy ring gradients` |
| `docs:` | 文档 | `docs: update deployment guide` |
| `refactor:` | 重构 | `refactor: extract memory manager` |
| `test:` | 测试 | `test: add distillation edge cases` |
| `chore:` | 构建/工具 | `chore: bump deps` |

---

## 设计审查

UI 变更需要遵循 **Liquid Dark Matter** 设计系统：

- 背景色：`#050508`
- 卡片表面：`#0A0A10`
- 强调色：Cyan `#00F0FF` / Magenta `#FF006E` / Gold `#FFBE0B`
- 展示字体：Newsreader + 霞鹜文楷
- 正文字体：Inter
- 数据字体：JetBrains Mono
- 每页必须有 **One More Thing**（一个超出预期的细节）

完整规范见 [AGENTS.md](../../AGENTS.md)。

---

## 从哪里开始

### 新手友好 Issue

项目中标记 `good first issue` 的 Issue 是给第一次贡献的人准备的。这些 Issue 通常是：
- 修复一个已知的小 bug
- 改进空状态的文案
- 添加缺失的 `aria-label`
- 优化一个组件的加载态

### 自己发现问题

用 QA（质量保证）的心态使用 SoulClone。记录下你发现的：
- 哪里让你困惑？
- 哪里加载太慢？
- 哪里在手机上不好点？
- 哪里的空状态不够友好？

这些问题每一个都是一个有价值的 Issue。

---

## 本章小结

- 四种角色：视觉设计师、前端、AI、全栈
- PR 三步：Fork → 写代码 → 检查通过 → 提交
- UI 变更必须回答三个设计宪法问题
- 提交用前缀：`feat:` `fix:` `design:` `docs:` `refactor:` `test:` `chore:`
- 新手从 `good first issue` 开始
