# 第24章 · 生产部署

## 从开发到生产

第5章教你用 Docker Compose 在本地跑起来。那是**开发环境**。当你准备把 SoulClone 发布到互联网上让别人访问时，需要做额外的安全配置。

---

## 生产环境检查清单

- [ ] **修改 `SECRET_KEY`**：生成一个加密安全的随机字符串（至少 32 字符）

  ```bash
  # 生成随机密钥（Linux/Mac）
  openssl rand -hex 32
  
  # Windows PowerShell
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
  ```

- [ ] **设置 `ENVIRONMENT=production`**：关闭调试日志、开启性能优化

- [ ] **配置 `CORS_ORIGINS`**：只允许你的生产域名访问 API

  ```env
  CORS_ORIGINS=https://your-domain.com
  ```

- [ ] **启用 HTTPS**：使用 Nginx 或 Caddy 做反向代理，配置 SSL 证书

- [ ] **设置 PostgreSQL 备份**：定期备份数据库

  ```bash
  # 每日备份脚本示例
  docker exec soulclone-postgres pg_dump -U soulclone soulclone > backup.sql
  ```

- [ ] **配置 Redis 持久化**：开启 AOF 或 RDB，防止重启丢数据

- [ ] **设置监控**：Prometheus + Grafana 监控 CPU、内存、请求延迟

- [ ] **配置 LLM API 额度告警**：在 OpenAI 控制台设置月度预算上限

- [ ] **审查限流阈值**：FastAPI 默认有限流中间件，生产环境按实际流量调参

---

## 部署平台选择

| 平台 | 适合 | 说明 |
|------|------|------|
| **VPS（阿里云/腾讯云/AWS EC2）** | 全栈控制 | 手动安装 Docker，`docker compose up -d` |
| **Railway / Render** | 快速部署 | 支持 Docker Compose，自动 HTTPS |
| **Fly.io** | 全球分布式 | 容器化部署，多区域自动分布 |

目前官方推荐 VPS + Docker Compose。简单、可控、成本可预测。

---

## 扩展考量

### 当前架构可支撑的用户规模

| 规模 | 建议 |
|------|------|
| 0 用户（现在） | SQLite + 无 Worker。好好睡觉。 |
| 100 活跃用户 | 仍然是 SQLite。也许加个备份脚本。 |
| 1,000 用户 | 考虑在托管平台（Render/Supabase）用 PostgreSQL |
| 10,000 用户 | 这时候可以抱怨 Redis 和 Celery 了。而且你会有钱雇人帮忙 |

### 扩展路径

- **数据库**：连接池（PgBouncer）→ 读写分离 → 分片
- **Redis**：单机 → Redis Cluster
- **Celery**：单 Worker → 水平扩展（根据队列深度）
- **LLM 成本**：对相似蒸馏输入做缓存 → 简单任务用更便宜模型（gpt-4o-mini）

---

## 环境变量完整参考

| 变量 | 必填 | 生产环境建议 |
|------|------|-------------|
| `OPENAI_API_KEY` | 是 | 使用生产专用 Key，设置月度预算上限 |
| `ANTHROPIC_API_KEY` | 否 | 备用 LLM 通道 |
| `SECRET_KEY` | 是 | **必须修改！** 生成加密随机字符串 |
| `DB_PASSWORD` | 是 | **必须修改！** 不要用默认值 |
| `ENVIRONMENT` | 是 | 设为 `production` |
| `CORS_ORIGINS` | 是 | 设为你实际的域名 |
| `DEFAULT_LLM_MODEL` | 否 | 生产环境可用 `gpt-4o-mini` 降低 20 倍成本 |

---

## 本章小结

- 开发用默认配置，生产必须改 SECRET_KEY 和 DB_PASSWORD
- 生产必须开 HTTPS
- 必须做数据库备份
- 设置 LLM 预算上限防止意外账单
- 当前架构不需要微服务——YAGNI（You Ain't Gonna Need It）
