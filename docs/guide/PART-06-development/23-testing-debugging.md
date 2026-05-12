# 第23章 · 测试与调试

## 前端检查

### TypeScript 类型检查

```bash
cd frontend
npx tsc --noEmit
```

如果类型检查不通过，说明有某个地方的类型对不上。比如你改了 API 返回的数据格式，但没更新 TypeScript 类型定义。

### 构建检查

```bash
npx vite build
```

构建失败通常意味着：
- 有文件 import 了一个不存在的模块
- TypeScript 编译错误（先用 `tsc --noEmit` 检查）
- 循环依赖（A import B，B import A）

### 浏览器调试

- **React DevTools**：查看组件树、props、state
- **Network 面板**：查看 API 请求和响应
- **Application 面板**：查看 localStorage（`soulclone-auth` token、`soulclone-sound-enabled` 等）

---

## 后端检查

### Lint

```bash
cd backend
ruff check .
ruff format . --check
```

ruff 是极快的 Python linter 和 formatter。它检查代码风格、未使用的变量、import 顺序等。

### 冒烟测试

```bash
pytest -m smoke
```

冒烟测试覆盖核心流程（注册、登录、蒸馏、消息），< 1 分钟完成。日常开发只跑冒烟测试就够了。完整测试套件在发布前才跑。

---

## 常见 Bug 和修复

### 前端

| 症状 | 可能原因 | 修复 |
|------|---------|------|
| 页面空白，无报错 | React 渲染抛异常但被吃掉了 | 打开浏览器 Console，看红色错误 |
| API 请求 401 | Token 过期或未登录 | 清除 localStorage，重新登录 |
| 组件 CSS 不生效 | Tailwind class 没被扫描到 | 检查 class 是否完整写在代码里（不是动态拼接的字符串） |
| `motion.div` 动画不触发 | 直接在页面里写了 `motion.div` | 改用 `Motion.tsx` 原语 |
| WebSocket 连接失败 | 后端没启动或端口不对 | 检查 `docker compose ps` |

### 后端

| 症状 | 可能原因 | 修复 |
|------|---------|------|
| "Database locked" | SQLite 被多个进程同时写入 | 关掉其他终端 |
| "Table doesn't exist" | 表没创建 | 删除 `soulclone_dev.db`，重启 |
| LLM 调用超时 | API 网络问题 | 检查 API Key 和网络连接。国内用户可能需要配置 `OPENAI_BASE_URL` |
| Celery 任务不执行 | Worker 没启动 | 开发模式不需要 Celery。如果是 Docker 模式，`docker compose logs celery` 查看 |
| 蒸馏返回空结果 | LLM 返回了非 JSON 内容 | 查看后端日志 `docker compose logs backend`，检查 `llm_client` 的 JSON 提取逻辑 |

---

## 日志查看

### Docker 模式

```bash
# 查看所有服务日志
docker compose logs

# 只看后端
docker compose logs -f backend

# 只看 Celery
docker compose logs -f celery

# 只看最近 50 行
docker compose logs --tail=50 backend
```

### 独立模式

后端日志直接打印在终端（`uvicorn` 自带彩色日志输出）。

---

## 调试蒸馏流程

蒸馏是整个系统最复杂的流程。如果蒸馏失败或不准确：

1. **检查问卷是否完整**：每个问题都回答了吗？矛盾检查是否触发了？
2. **检查聊天样本质量**：样本太短（<100 字）或格式不对（工作群/通知）会导致分析不准
3. **查看 LLM 调用日志**：`llm_usage_logs` 表记录了每次 API 调用的 token 数、延迟和成本
4. **检查蒸馏作业状态**：`distillation_jobs` 表追踪每个蒸馏作业的进度和结果

---

## 本章小结

- 前端：`tsc --noEmit` + `vite build` + 浏览器 DevTools
- 后端：`ruff check .` + `pytest -m smoke`
- 蒸馏调试：查问卷完整度 → 查聊天样本 → 查 LLM 日志 → 查作业状态
- 日志：`docker compose logs -f <服务名>`
