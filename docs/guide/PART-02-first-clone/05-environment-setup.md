# 第5章 · 环境搭建完全指南

上一章我们用了最简单的路径跑起来。这一章是给遇到问题的人准备的——完整的安装指南、环境诊断、常见坑的填法。

---

## Docker Desktop 安装

### Windows

1. 访问 [docker.com](https://www.docker.com/products/docker-desktop/) 下载 Docker Desktop for Windows
2. 双击安装包，一路"下一步"
3. 安装完成后**重启电脑**
4. 重启后 Docker Desktop 会自动启动（任务栏右下角会出现鲸鱼图标）
5. 打开 PowerShell，验证：

```powershell
docker --version
# 输出: Docker version 27.x.x
docker compose version
# 输出: Docker Compose version v2.x.x
```

**Windows 特别说明**：
- Windows 10/11 家庭版需要 WSL 2（Windows Subsystem for Linux）。Docker 安装向导会自动提示你安装
- 如果 Docker 启动后一直转圈，打开 PowerShell 运行 `wsl --update` 然后重启
- 确保 BIOS 中开启了虚拟化技术（VT-x / AMD-V）

### macOS

1. 访问 [docker.com](https://www.docker.com/products/docker-desktop/) 下载 Docker Desktop for Mac
2. 根据你的芯片选择版本：**Apple Silicon**（M1/M2/M3/M4）或 **Intel**
3. 把 Docker.app 拖入 Applications 文件夹
4. 首次启动会要求输入系统密码（用于安装网络组件）
5. 打开 Terminal，验证：

```bash
docker --version
docker compose version
```

---

## Git 安装

### Windows

下载 [Git for Windows](https://git-scm.com/download/win)，安装时一路默认即可。

安装完成后打开 PowerShell：
```powershell
git --version
# 输出: git version 2.xx.x
```

### macOS

macOS 自带 Git。如果没有（或版本太老）：
```bash
xcode-select --install   # 安装命令行工具（包含 Git）
# 或者用 Homebrew:
brew install git
```

---

## 获取 OpenAI API Key

这是最关键的一步。没有 API Key，蒸馏引擎无法工作。

### 步骤

1. 打开 [platform.openai.com](https://platform.openai.com)
2. 注册/登录 OpenAI 账号
3. 左侧菜单 → **API keys** → **Create new secret key**
4. 给 Key 起个名字（比如 `soulclone-dev`）
5. **立即复制保存**——Key 只显示一次，关闭页面后就看不到了
6. 把 Key 粘贴到 `.env` 文件中：

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 充值与费用

- 新账号通常有 $5-$18 免费额度（因地区而异）
- 蒸馏一次大约消耗 $0.05-0.15（取决于输入量）
- 克隆日常运行每天大约 $0.02-0.10
- **你的免费额度足够完整体验很多次**

如果免费额度用完，在 [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing) 充值 $5-$10 即可。

### 网络问题（国内用户）

如果你在国内，访问 OpenAI API 可能需要科学上网。有几种方案：

1. **使用代理**：在 `.env` 中可以不设置 `OPENAI_BASE_URL`，使用默认 `https://api.openai.com/v1`，但需要确保 Docker 容器能访问外网
2. **使用 API 转发服务**：将 `OPENAI_BASE_URL` 设置为转发地址
3. **使用国内的兼容 API**：部分国内 LLM 服务商提供 OpenAI 兼容接口

```env
# 示例：使用转发地址
OPENAI_BASE_URL=https://your-proxy-url.com/v1
```

---

## .env 配置文件详解

`.env` 文件位于项目根目录。它是一个纯文本文件，每一行是一个 `KEY=VALUE` 配置。下面是所有配置项的完整说明：

```env
# === 必填 ===
# OpenAI API 密钥。唯一必填项。
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === LLM 配置 ===
# OpenAI API 地址前缀（默认即可，除非你用转发服务）
OPENAI_BASE_URL=https://api.openai.com/v1

# 默认使用的模型（可改为 gpt-4o-mini 降低成本）
DEFAULT_LLM_MODEL=gpt-4o

# Anthropic Claude API（可选备用）
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === 安全配置 ===
# JWT 签名密钥。开发环境用默认值没问题。
# 生产环境请生成一个随机字符串（至少 32 字符）
SECRET_KEY=soulclone_super_secret_key_change_in_production

# === 数据库配置 ===
# PostgreSQL 密码。开发环境用默认值没问题。
DB_PASSWORD=soulclone_secret

# === 运行环境 ===
# development = 开发模式（热重载、详细日志）
# production = 生产模式（优化性能、减少日志）
ENVIRONMENT=development

# === 跨域配置 ===
# 允许哪些前端地址访问 API。默认即可。
CORS_ORIGINS=http://localhost:5173
```

> **省钱小技巧**：如果频繁测试蒸馏功能，把 `DEFAULT_LLM_MODEL` 改成 `gpt-4o-mini`。便宜约 20 倍，效果略逊但够用。

---

## Docker 服务架构一览

```
                    ┌──────────────────────┐
                    │   你的浏览器          │
                    │   localhost:5173      │
                    └──────────┬───────────┘
                               │ HTTP/WebSocket
                               ▼
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   frontend   │────▶│     backend      │────▶│   postgres   │
│  Vite :5173  │     │   FastAPI :8000  │     │  pgvector    │
│  React 19    │     │   Python 3.12    │     │  :5432       │
└──────────────┘     └────────┬─────────┘     └──────────────┘
                              │
                              ├──────────────────────────────┐
                              │                              │
                              ▼                              ▼
                     ┌──────────────┐              ┌──────────────┐
                     │    redis     │              │    celery    │
                     │   :6379      │              │  worker      │
                     │  消息队列    │              │  15min 周期  │
                     └──────────────┘              └──────────────┘
```

每个容器的作用：

| 容器 | 技术 | 端口 | 作用 |
|------|------|------|------|
| **frontend** | Vite + React 19 | 5173 | 前端页面和资源 |
| **backend** | FastAPI + Python 3.12 | 8000 | REST API、WebSocket、SSE |
| **postgres** | PostgreSQL 16 + pgvector | 5432 | 主数据库、向量相似度搜索 |
| **redis** | Redis 7 | 6379 | 缓存、Celery 消息队列、会话 |
| **celery** | Celery 5.4 | — | 异步任务（蒸馏、克隆周期、情绪衰减） |

---

## 常用管理命令

```bash
# 启动所有服务
docker compose up -d

# 查看运行状态
docker compose ps

# 查看某个服务的实时日志
docker compose logs -f backend
docker compose logs -f frontend

# 停止所有服务
docker compose down

# 停止并清空所有数据（重新开始）
docker compose down -v

# 重新构建镜像（代码更新后）
docker compose build
docker compose up -d
```

---

## 轻量开发模式：不用 Docker

如果你是开发者，想在本地直接跑前端和后端（更快的热重载、更方便的调试），SoulClone 也支持无 Docker 模式。

### 后端（SQLite 模式）

```bash
cd backend
pip install -r requirements.txt
# 设置环境变量
# Windows PowerShell:
$env:DATABASE_URL = "sqlite+aiosqlite:///./soulclone_dev.db"
$env:REDIS_URL = "memory://"
$env:OPENAI_API_KEY = "sk-xxx..."
uvicorn app.main:app --reload
```

后端启动在 `http://localhost:8000`。开发模式使用 **SQLite**（无需安装 PostgreSQL）和**内存 Redis**（无需安装 Redis）。蒸馏任务在请求中同步运行（不需要 Celery Worker）。

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端启动在 `http://localhost:5173`，自动代理 API 请求到 `:8000`。

这种模式适合**日常开发**——改一行代码立即看到效果，不需要等 Docker 重建。详细信息见 [SOLO_DEV.md](../../backend/SOLO_DEV.md)。

---

## 环境诊断清单

在开始创建孪生之前，逐项检查：

- [ ] `docker compose ps` 显示 5 个服务都是 Up
- [ ] 浏览器打开 `localhost:5173` 能看到 Landing Page
- [ ] 浏览器打开 `localhost:8000/docs` 能看到 FastAPI 自动生成的 API 文档
- [ ] `.env` 中 `OPENAI_API_KEY` 以 `sk-` 开头
- [ ] 环境变量中没有多余的空格或引号

全部打勾？进入下一章——创建你的第一个孪生。
