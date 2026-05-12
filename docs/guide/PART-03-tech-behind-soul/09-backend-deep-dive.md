# 第9章 · 后端深度解析——孪生的大脑

## FastAPI：从零到 API 文档只需写类型

FastAPI 的核心哲学是：**你定义数据类型，框架自动生成 API 文档、参数验证、序列化。**

举个例子。定义一个用户注册接口：

```python
# schemas/auth.py — Pydantic 数据模型
class RegisterRequest(BaseModel):
    phone: str
    password: str
    nickname: str | None = None

class RegisterResponse(BaseModel):
    user_id: str
    access_token: str
    token_type: str = "bearer"

# api/v1/auth.py — API 路由
@router.post("/register", response_model=RegisterResponse)
async def register(req: RegisterRequest):
    # req.phone, req.password 已自动验证
    user = await auth_service.register(req.phone, req.password)
    token = create_access_token(user.id)
    return RegisterResponse(user_id=user.id, access_token=token)
```

FastAPI 自动做了三件事：
1. 请求体自动验证——`phone` 必须是字符串、`password` 不能为空
2. 自动生成 OpenAPI 文档——打开 `localhost:8000/docs` 就能看到交互式 API 文档
3. 响应体自动序列化——你返回 `RegisterResponse` 对象，FastAPI 转成 JSON

---

## 12 个 API 路由模块

后端按功能域分成了 12 个路由模块，每个模块注册在 `/api/v1/` 下：

| 模块 | 路径前缀 | 职责 |
|------|---------|------|
| `auth` | `/api/v1/auth` | 注册、登录、刷新 token |
| `users` | `/api/v1/users` | 用户信息 CRUD、个人信息编辑 |
| `distillation` | `/api/v1/distillation` | 提交问卷、触发蒸馏、查看进度、提交校准反馈 |
| `clones` | `/api/v1/clones` | 克隆状态、统计数据、每日简报、自主等级调整 |
| `matches` | `/api/v1/matches` | 匹配发现、滑动操作、匹配列表 |
| `conversations` | `/api/v1/conversations` | 对话列表、创建对话、亲密度查询 |
| `messages` | `/api/v1/messages` | 消息历史、发送消息（REST 备选） |
| `posts` | `/api/v1/posts` | 动态 CRUD、动态流 |
| `feed` | `/api/v1/feed` | 个性化推荐流 |
| `notifications` | `/api/v1/notifications` | 通知列表、已读标记 |
| `date_invites` | `/api/v1/date-invites` | 约会邀请（AI 推理辅助） |
| `calibration` | `/api/v1/calibration` | 校准测试、校准修正历史 |

---

## SQLAlchemy 2.0：用 Python 操作数据库

后端不写 SQL。SQLAlchemy ORM 让数据库表变成 Python 类：

```python
# models/user.py
class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid4)
    phone: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(128))
    nickname: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="active")

# 查询示例
async with async_session() as db:
    user = await db.execute(
        select(User).where(User.phone == "13800138000")
    )
    user = user.scalar_one_or_none()
```

**异步是关键。** `async_session` + `asyncpg`（PostgreSQL 异步驱动）让数据库查询不阻塞其他请求。100 个用户同时查数据，不会排队等。

---

## JWT 认证流

用户登录后，后端签发一个 JWT（JSON Web Token）。后续所有请求带这个 token 证明身份：

```
登录:  客户端 → POST /api/v1/auth/login → 服务器验证密码 → 返回 JWT
请求:  客户端 → GET /api/v1/users/me (Header: Authorization: Bearer <JWT>)
             → 中间件解析 JWT → 提取 user_id → 路由处理
```

JWT 的优势是**无状态**——服务器不需要存储"谁登录了"。token 本身含有用户 ID 和过期时间，用密钥签名防篡改。

```python
# 生成 token
def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=7)  # 7 天有效期
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# 验证 token（中间件自动调用）
async def get_current_user_id(
    credentials: HTTPBearer = Depends(security)
) -> str:
    payload = jwt.decode(credentials.credentials, SECRET_KEY)
    return payload["sub"]
```

---

## WebSocket：实时聊天

HTTP 的工作方式是"请求 → 响应"，适合查数据、提交表单。但聊天不行——你需要**服务器主动推送消息**。

这就是 WebSocket。一次连接建立后，服务器和客户端可以随时互发消息：

```
客户端 ←────────→ 服务器
   │                    │
   │  {"type":"message", │
   │   "content":"你好"} │
   │ ──────────────────▶ │
   │                    │  存入数据库
   │                    │  转发给接收方
   │  {"type":"message", │
   │   "content":"你好"} │
   │ ◀────────────────── │
```

SoulClone 的 WebSocket 端点：`/ws/chat`

**接管机制**：用户在聊天页长按 2.5 秒发送 `takeover` 消息，WebSocket 处理器把后续消息标记为"人类发送"（而非克隆发送）。接管期间的消息成为新的训练样本。

---

## SSE：服务端推送通知

SSE（Server-Sent Events）是一种轻量的服务器推送方案。和 WebSocket 不同，SSE 是单向（服务器→客户端）：

```
客户端 GET /api/v1/notifications/stream ──▶ 服务器
客户端 ◀── event: notification           ── 服务器
客户端 ◀── event: notification           ── 服务器
客户端 ◀── event: notification           ── 服务器
```

SoulClone 用 SSE 推送通知——新匹配、新消息、克隆活动更新。SSE 比 WebSocket 更简单，因为通知不需要客户端发送数据。

---

## LLM 客户端：双通道 AI

后端有一个统一的 LLM 客户端（`LLMClient`），封装了 OpenAI 和 Anthropic 两种模型：

```python
class LLMClient:
    async def chat(
        self,
        messages: list[dict],
        model: str = "gpt-4o",
        temperature: float = 0.7,
        stream: bool = False,
    ) -> str:
        # 自动选择 provider
        if model.startswith("claude"):
            return await self._call_anthropic(...)
        else:
            return await self._call_openai(...)
```

内置功能：
- **自动重试**：API 调用失败时自动重试（最多 3 次，指数退避）
- **用量记录**：每次调用写入 `LLMUsageLog` 表（模型、token 数、成本、延迟）
- **JSON 提取**：当需要结构化输出时，自动从 LLM 回复中提取 JSON（带重试）
- **流式支持**：支持 `stream=True` 逐 token 返回

---

## Celery：后台任务引擎

HTTP 请求不能等太久——用户看一个 loading 转 5 分钟会关掉页面。所以耗时的任务交给 Celery 在后台跑：

| 任务 | 触发方式 | 耗时 |
|------|---------|------|
| 人格蒸馏 | 用户提交问卷后触发 | 2-4 分钟 |
| 克隆运行时周期 | 每 15 分钟自动触发 | ~30 秒/克隆 |
| 情绪状态衰减 | 定时任务（基于时间流逝） | <1 秒/克隆 |
| 长期记忆总结 | 对话达到阈值时触发 | 5-15 秒 |

Celery Worker 是一个独立进程，从 Redis 消息队列取任务执行。后端 API 只是"投递任务"，Worker 执行完成后更新数据库状态。

在开发模式（SQLite + 内存 Redis）下，蒸馏任务在 FastAPI 的 `BackgroundTasks` 中同步运行——不需要单独启动 Celery。

---

## 本章小结

| 概念 | 一句话 |
|------|--------|
| Web 框架 | FastAPI 0.115 — 定义类型，自动生成 API 文档 |
| 路由 | 12 个模块，每个管一个功能域 |
| 数据库操作 | SQLAlchemy 2.0 异步 ORM，不写 SQL |
| 身份认证 | JWT — 无状态、7 天有效期、Bearer Token |
| 实时通信 | WebSocket（聊天） + SSE（通知推送） |
| AI 调用 | 统一 LLMClient，封装 OpenAI + Anthropic，自动重试 |
| 后台任务 | Celery 5.4 — 蒸馏、克隆周期、情绪衰减 |
