# 第22章 · 后端开发指南

## 两种开发模式

SoulClone 后端支持两种运行模式：

### 模式 1：Docker（完整环境）

```bash
docker compose up -d
```

PostgreSQL 16 + Redis 7 + Celery Worker 全部启动。适合测试完整功能、验证部署。

### 模式 2：SQLite 独立模式（日常开发）

```bash
cd backend
pip install -r requirements.txt

# Windows PowerShell:
$env:DATABASE_URL = "sqlite+aiosqlite:///./soulclone_dev.db"
$env:REDIS_URL = "memory://"
$env:OPENAI_API_KEY = "sk-xxx..."

uvicorn app.main:app --reload
```

- 数据库：SQLite（单文件，零配置）
- Redis：内存模拟（fakeredis，无需安装）
- Celery：不需要——蒸馏任务在请求中同步运行

这种模式适合 90% 的日常开发场景。不用装 PostgreSQL、不用装 Redis、不用启动 Celery。

---

## 添加一个新 API 端点

假设你要加一个"获取用户设置"的接口：

### 第 1 步：定义 Pydantic Schema

```python
# backend/app/schemas/settings.py
from pydantic import BaseModel

class SettingsResponse(BaseModel):
    sound_enabled: bool = True
    dark_mode: bool = True
    language: str = "zh"
```

### 第 2 步：写路由

```python
# backend/app/api/v1/settings.py
from fastapi import APIRouter, Depends
from app.schemas.settings import SettingsResponse

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/", response_model=SettingsResponse)
async def get_settings(
    user_id: str = Depends(get_current_user_id)  # JWT 认证
):
    # 从数据库读取...
    return SettingsResponse()
```

### 第 3 步：注册路由

```python
# backend/app/main.py
from app.api.v1 import settings
app.include_router(settings.router, prefix="/api/v1")
```

访问 `http://localhost:8000/docs` 就能看到新端点的交互式文档。

---

## AI 服务架构

```
api/v1/distillation.py  ← 接收蒸馏请求
        │
        ▼
services/distillation_service.py  ← 编排蒸馏流程
        │
        ▼
app/ai/
  ├── distillation/
  │   ├── persona_distiller.py  ← PersonaDistiller.distill()
  │   ├── style_extractor.py    ← StyleExtractor.extract()
  │   ├── prompt_forge.py       ← PromptForge.forge()
  │   └── validation.py         ← DistillationValidator.validate()
  ├── llm_client.py             ← LLMClient（OpenAI + Claude 统一接口）
  └── fidelity_scorer.py        ← FidelityScorer.compute_fidelity()
```

### LLMClient 统一接口

所有 AI 调用通过同一个客户端：

```python
from app.ai.llm_client import llm_client

# 调用 GPT-4o
response = await llm_client.chat_completion(
    messages=[{"role": "user", "content": "..."}],
    temperature=0.2,
    max_tokens=2000,
    task_type="persona_distillation",  # 用于用量统计
)
```

内置功能：自动重试（3 次，指数退避）、用量记录（写入 `llm_usage_logs`）、JSON 提取（非结构化回复中提取 JSON）、流式支持。

---

## Celery 任务

Celery Worker 负责异步长时间任务。任务是独立的 Python 函数：

```python
# 在 celery_worker.py 中注册
@celery.task
def run_clone_cycle():
    # 每 15 分钟执行一次
    pass
```

在开发模式（SQLite）中，蒸馏任务通过 FastAPI 的 `BackgroundTasks` 在请求中同步执行——不需要 Celery。

---

## 代码质量检查

```bash
cd backend

# Lint 检查
ruff check .

# 自动格式化
ruff format .

# 运行冒烟测试（< 1 分钟）
pytest -m smoke
```

---

## 常见开发问题

| 问题 | 解决 |
|------|------|
| "Database locked" (SQLite) | 一次只能一个进程写入。关掉其他终端里运行的 app |
| Celery Worker 启动不了 | **不要启动它。** 开发模式不需要 |
| "Table doesn't exist" | 删除 `soulclone_dev.db`，重启——表自动重建 |
| 测试因外部 API 失败 | 打上 `@pytest.mark.slow` 标记，用 `pytest -m smoke` 跳过 |

---

## "Freeze" 心态

后端的核心工作只有三件：

1. **存储用户数据** → SQLite 做这个。零维护。
2. **调用 AI API** → FastAPI BackgroundTasks 做这个。零维护。
3. **认证用户** → JWT 中间件做这个。零维护。

其余一切——WebSocket、SSE、定时任务——都是**冻结的**。

> **冻结意味着**：如果它在工作，别碰。如果它坏了，打补丁。不要重写。不要优化。不要打磨。

详见 [SOLO_DEV.md](../../backend/SOLO_DEV.md)——独立开发者生存指南。

---

## 本章小结

1. 两种模式：Docker（完整）和 SQLite（日常开发）
2. 加 API = Schema + 路由 + 注册
3. 所有 AI 调用走统一的 `llm_client`
4. 开发模式不需要 Celery
5. `ruff check .` + `pytest -m smoke` = 代码质量检查
6. Freeze 心态：工作的代码不需要优化
