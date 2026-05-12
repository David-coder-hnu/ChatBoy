# 第4章 · 快速开始——三分钟，看见另一个自己

## 你需要什么

在开始之前，确保你的电脑上有这些东西：

| 工具 | 用途 | 如何检查 |
|------|------|---------|
| **Git** | 克隆代码仓库 | 终端输入 `git --version` |
| **Docker Desktop** | 运行所有服务 | 终端输入 `docker --version` |
| **OpenAI API Key** | 为孪生注入灵魂 | 在 [platform.openai.com](https://platform.openai.com) 注册并创建 Key |

如果你还没有 API Key，去 OpenAI 官网注册一个账号，在 API Keys 页面创建一个新 Key。新账号通常有免费额度，足够你体验。

> **Windows 用户注意**：Docker Desktop 需要在 BIOS 中开启虚拟化（VT-x/AMD-V）。大多数现代电脑默认已开启。如果 Docker 启动报错，检查一下 BIOS 设置。

---

## 四步启动

打开终端（Windows 用 PowerShell，Mac 用 Terminal），逐行输入以下命令：

### 第 1 步：克隆代码仓库

```bash
git clone https://github.com/David-coder-hnu/SoulClone.git
cd SoulClone
```

这会把整个项目下载到你的电脑上。`cd SoulClone` 进入项目目录。

### 第 2 步：配置环境变量

```bash
cp .env.example .env
```

这行命令复制一份配置模板。现在你需要编辑 `.env` 文件——用任意文本编辑器（记事本、VS Code 都可以）打开它。

**唯一必填的是这一行**：

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

把 `sk-xxx...` 替换成你的 OpenAI API Key。其他配置项保持默认即可。

完整配置项说明见下表（现在你只需要关注第一行）：

| 变量 | 必填 | 说明 |
|------|------|------|
| `OPENAI_API_KEY` | **是** | OpenAI API 密钥 |
| `ANTHROPIC_API_KEY` | 否 | Claude API 密钥（可选备用） |
| `SECRET_KEY` | 否 | JWT 签名密钥，默认值开发够用 |
| `DB_PASSWORD` | 否 | 数据库密码，默认 `soulclone_secret` |
| `ENVIRONMENT` | 否 | `development` 或 `production`，默认开发模式 |
| `CORS_ORIGINS` | 否 | 允许访问的前端地址，默认 `http://localhost:5173` |

### 第 3 步：启动所有服务

```bash
docker compose up -d
```

这个命令做了什么？Docker Compose 会同时启动 5 个容器：

| 容器 | 作用 |
|------|------|
| `soulclone-postgres` | PostgreSQL 16 数据库（带 pgvector 向量扩展） |
| `soulclone-redis` | Redis 7 缓存和消息队列 |
| `soulclone-backend` | FastAPI 后端 API 服务，端口 8000 |
| `soulclone-celery` | Celery 异步任务 worker，每 15 分钟运行克隆周期 |
| `soulclone-frontend` | Vite 前端开发服务器，端口 5173 |

第一次启动需要下载 Docker 镜像，大概 3-5 分钟。之后再次启动只需几秒钟。

`-d` 参数表示"后台运行"——你关掉终端也不会停止服务。

### 第 4 步：打开浏览器

在浏览器地址栏输入：

```
http://localhost:5173
```

你会看到 **Landing Page**——320 个 WebGL 粒子在深海中浮动，鼠标移过时像水波一样被推开。

> *"你的灵魂不止一个容器。"*

---

## 验证：确认一切正常

打开第二个终端窗口，运行以下命令确认所有服务都在运行：

```bash
docker compose ps
```

你应该看到 5 个服务，状态都是 `Up` 或 `running`：

```
NAME                  STATUS
soulclone-postgres    Up (healthy)
soulclone-redis       Up (healthy)
soulclone-backend     Up
soulclone-celery      Up
soulclone-frontend    Up
```

如果某个服务不是 `Up`，用这个命令查看日志：

```bash
docker compose logs <服务名>
```

例如：
```bash
docker compose logs backend    # 查看后端日志
docker compose logs frontend   # 查看前端日志
```

---

## 常见问题速查

### Q: 端口被占用怎么办？

如果 5173、8000、5432、6379 中某个端口已被其他程序占用，Docker 会报错。解决方法：

```bash
# 查看哪个程序占用了端口（Windows PowerShell）
netstat -ano | findstr :5432

# 关掉那个程序，或者修改 docker-compose.yml 中的端口映射
```

### Q: Docker 启动报错 " virtualization not enabled"

进入 BIOS（开机时按 F2/Del/F10），找到 Virtualization Technology（VT-x 或 AMD-V），设为 Enabled。

### Q: 前端页面打开但是一片空白

检查后端是否正常：
```bash
docker compose logs backend | tail -20
```

如果看到 `database does not exist` 之类的错误，运行：
```bash
docker compose down -v    # 清除旧数据卷
docker compose up -d      # 重新启动
```

### Q: API Key 无效

检查 `.env` 文件中 `OPENAI_API_KEY` 是否以 `sk-` 开头，且没有多余的空格或引号。

---

## 接下来

你已经成功启动了 SoulClone。前端在 `localhost:5173`，后端 API 文档在 `localhost:8000/docs`。

下一章会详细讲解每一步的环境配置细节——如果你遇到问题，下一章有更深入的诊断方案。

接着，我们会走一遍完整的创建孪生流程——从注册到蒸馏到听到孪生的第一条回复。
