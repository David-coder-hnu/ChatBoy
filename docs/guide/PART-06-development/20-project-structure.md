# 第20章 · 项目结构——目录地图

## 一眼看完全局

```
soulclone/
├── frontend/               ← 孪生的面孔（React 19 + TypeScript）
│   ├── src/
│   │   ├── pages/          ← 14 个页面组件
│   │   ├── components/     ← 共享组件
│   │   │   ├── chat/       ←  聊天相关组件
│   │   │   ├── feed/       ←  动态相关组件
│   │   │   ├── layout/     ←  布局组件（AppShell, FloatingDock）
│   │   │   ├── match/      ←  匹配相关组件
│   │   │   ├── onboarding/ ←  入门流程组件
│   │   │   ├── profile/    ←  个人资料组件
│   │   │   ├── shared/     ←  通用组件（Card, Motion, AmbientBackground）
│   │   │   └── ui/         ←  基础 UI（Button, Input, Skeleton 等）
│   │   ├── hooks/          ← 自定义 React hooks
│   │   ├── lib/            ← 工具库（sound.ts, api.ts）
│   │   ├── stores/         ← Zustand store（authStore.ts）
│   │   ├── types/          ← TypeScript 类型定义
│   │   ├── App.tsx          ← 路由 + 全局动效挂载
│   │   ├── main.tsx         ← React 入口
│   │   └── index.css        ← Tailwind + 设计 token 定义
│   ├── package.json         ← 依赖和脚本
│   ├── vite.config.ts       ← Vite 构建配置
│   ├── tailwind.config.ts   ← Tailwind 设计 token
│   └── tsconfig.json        ← TypeScript 配置
│
├── backend/                ← 孪生的大脑（FastAPI + Python）
│   ├── app/
│   │   ├── ai/             ← AI 引擎
│   │   │   ├── distillation/    ← 人格蒸馏（4 个模块）
│   │   │   ├── clone_engine/    ← 克隆运行时（4 个模块）
│   │   │   ├── llm_client.py    ← LLM 客户端（OpenAI + Claude）
│   │   │   ├── fidelity_scorer.py ← 符合度评分器
│   │   │   └── utils.py         ← 工具函数
│   │   ├── api/            ← API 路由（12 个模块）
│   │   │   └── v1/         ←   API v1 版本
│   │   ├── models/         ← SQLAlchemy 数据模型（20+ 张表）
│   │   ├── schemas/        ← Pydantic 请求/响应模型
│   │   ├── services/       ← 业务逻辑服务层
│   │   ├── core/           ← 核心业务逻辑
│   │   ├── websocket/      ← WebSocket 处理器
│   │   ├── sse/            ← SSE 端点
│   │   ├── middleware/     ← 中间件（JWT 认证等）
│   │   ├── db/             ← 数据库配置和会话
│   │   ├── config.py       ← 应用配置（Pydantic Settings）
│   │   └── main.py         ← FastAPI 入口
│   ├── tests/              ← 测试套件
│   ├── requirements.txt     ← Python 依赖
│   ├── SOLO_DEV.md          ← 独立开发者生存指南
│   └── celery_worker.py     ← Celery Worker 入口
│
├── docs/
│   ├── architecture.md     ← 系统架构文档
│   ├── deployment.md       ← 部署指南
│   └── guide/              ← 本指南（26 章入门指引）
│
├── docker-compose.yml      ← Docker 编排（5 个服务）
├── .env.example            ← 环境变量模板
├── AGENTS.md               ← 设计宪法（Liquid Dark Matter）
├── README.md               ← 项目介绍
├── CONTRIBUTING.md         ← 贡献指南
└── SECURITY.md             ← 安全策略
```

---

## 前端与后端如何通信

```
浏览器 (localhost:5173)
    │
    ├── HTTP REST → 后端 (localhost:8000/api/v1/*)
    │   用于：查数据、提交表单、触发蒸馏
    │
    ├── WebSocket → 后端 (localhost:8000/ws/chat)
    │   用于：实时聊天、消息推送
    │
    └── SSE → 后端 (localhost:8000/api/v1/notifications/stream)
        用于：通知实时推送（单向）
```

Vite 开发服务器配置了代理：`/api` 和 `/ws` 的请求自动转发到后端 8000 端口。所以前端代码里写 `axios.get('/api/v1/users/me')` 就能直接访问后端。

---

## 关键配置文件

| 文件 | 作用 |
|------|------|
| `frontend/vite.config.ts` | Vite 构建配置——路径别名、代理、代码分包 |
| `frontend/tailwind.config.ts` | Tailwind 设计 token——品牌色、字体、动画 |
| `frontend/tsconfig.json` | TypeScript 严格模式 + `@/*` 路径别名 |
| `backend/app/config.py` | 后端配置——数据库 URL、Redis URL、LLM Key、CORS |
| `docker-compose.yml` | 5 个 Docker 服务的编排配置 |
| `.env` | 环境变量——API Key、数据库密码、运行模式 |

---

## 本章小结

- `frontend/src/pages/` — 14 个页面组件，每个对应一个路由
- `frontend/src/components/shared/` — 强制使用的共享组件（Card, Motion, AmbientBackground, DataState）
- `backend/app/ai/` — AI 引擎（蒸馏 + 克隆运行时 + 评分器）
- `backend/app/api/v1/` — 12 个 API 路由模块
- `backend/app/models/` — 20+ 张数据库表的 SQLAlchemy 模型
- 前后端通过 HTTP REST + WebSocket + SSE 三种方式通信
