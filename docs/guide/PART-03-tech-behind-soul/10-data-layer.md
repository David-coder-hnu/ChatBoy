# 第10章 · 数据层——记忆和感知的存储方式

## 为什么需要三种存储

SoulClone 的数据不是"全存到一个数据库里就完了"。不同性质的数据需要不同的存储方式：

| 数据类型 | 例子 | 存储方式 | 为什么 |
|---------|------|---------|--------|
| **永久的、结构化的** | 用户信息、消息历史、匹配记录 | PostgreSQL 16 | 可靠、支持事务、关系查询 |
| **向量的、需要相似度搜索的** | 人格向量、记忆 embedding | PostgreSQL + pgvector | 需要"找最像的人" |
| **临时的、需要极速的** | 在线状态、消息队列、会话 | Redis 7 | 内存级读写速度 |

---

## PostgreSQL 16：主力数据库

### 核心表一览

SoulClone 有 20+ 张表。以下是最重要的几张：

#### 用户相关

| 表名 | 关键字段 | 用途 |
|------|---------|------|
| `users` | id, phone, password_hash, nickname, status | 用户账户和基本信息 |
| `clone_profiles` | user_id, questionnaire_answers, distilled_persona (JSONB), system_prompt, chat_dna (JSONB), persona_vector (vector) | 蒸馏后的完整人格档案 |
| `clones` | user_id, status, autonomy_level, current_mood, total_conversations, avg_response_time | 克隆运行时状态和统计 |

#### 社交相关

| 表名 | 关键字段 | 用途 |
|------|---------|------|
| `matches` | user_a_id, user_b_id, compatibility_score, status | 匹配关系和匹配度分数 |
| `conversations` | match_id, intimacy_score, relationship_stage | 对话会话和亲密度追踪 |
| `messages` | conversation_id, sender_id, sender_type (human/clone), content | 每条消息记录 |
| `posts` | user_id, clone_id, content | 社交动态帖子 |
| `comments` | post_id, user_id, content | 动态评论 |
| `date_invites` | match_id, proposed_by, status, ai_reasoning | AI 辅助的约会邀请 |

#### 记忆与状态

| 表名 | 关键字段 | 用途 |
|------|---------|------|
| `conversation_memories` | conversation_id, summary, key_facts | 单段对话的短期记忆 |
| `long_term_memories` | clone_id, content, importance_score, embedding | 跨对话的长期记忆（带向量） |
| `emotion_states` | clone_id, current_mood, intensity, mood_history (JSONB) | 情绪状态追踪 |
| `relationship_states` | clone_id, target_user_id, intimacy_score, milestones (JSONB) | 每段独立关系的状态 |

#### 系统相关

| 表名 | 关键字段 | 用途 |
|------|---------|------|
| `takeovers` | conversation_id, user_id, timestamp | 人类接管审计日志 |
| `notifications` | user_id, type, content, is_read | 用户通知 |
| `llm_usage_logs` | model, prompt_tokens, completion_tokens, cost, latency_ms | AI API 用量和成本统计 |
| `distillation_jobs` | user_id, status, progress, result | 蒸馏异步任务追踪 |
| `calibration_tests` | clone_id, scenario, clone_reply, user_feedback | 校准测试记录 |

### JSONB：灵活存储非结构化数据

有些数据不适合用固定列存储——比如问卷答案（每道题的格式不同）、情绪历史（随时间变化的数组）。PostgreSQL 的 JSONB 类型让这些数据以 JSON 格式存储在单一列中，同时支持 JSON 内部字段的索引和查询：

```sql
-- 查询所有 autonomy_level >= 3 的克隆
SELECT * FROM clone_profiles
WHERE distilled_persona->>'autonomy_level' >= '3';
```

### pgvector：向量相似度搜索

这是 SoulClone 最重要的数据库特性。pgvector 是 PostgreSQL 的扩展，让它能存储和搜索**向量 embedding**（高维浮点数数组）。

什么场景需要向量搜索？**匹配算法**。

当你创建孪生后，系统从你的人格蒸馏结果中提取一个向量（比如 1536 维的浮点数数组）。然后——

```sql
-- 找到和用户 A 最相似的前 20 个人
SELECT user_id, 1 - (persona_vector <=> :target_vector) AS similarity
FROM clone_profiles
WHERE user_id != :user_a_id
ORDER BY persona_vector <=> :target_vector
LIMIT 20;
```

`<=>` 是 pgvector 的余弦距离运算符。`1 - 余弦距离 = 余弦相似度`，取值范围 0 到 1。

这个查询的执行结果是匹配算法 40% 的权重来源——**向量相似度**。

### 为什么一张数据库表能同时存 JSONB 和向量？

这就是选 PostgreSQL 而不是 MongoDB + Pinecone 的原因。一张 `clone_profiles` 表里：
- `questionnaire_answers` 用 JSONB 存问卷原始答案（灵活结构）
- `distilled_persona` 用 JSONB 存蒸馏后的人格结构化数据
- `persona_vector` 用 vector 存人格 embedding

一个查询就能同时取到结构化和向量数据，不需要跨数据库 join。

---

## Redis 7：内存中的速度之王

PostgreSQL 的数据存在硬盘上，读写需要毫秒级。Redis 的数据存在**内存**中，读写只需要微秒级。

SoulClone 用 Redis 做三件事：

### 1. Celery 消息队列

Celery 需要一个"中间人"来传递任务。Redis 的 List 数据结构天然适合做队列：

```
Backend → LPUSH redis:celery_queue "distill_user_abc"  → Celery Worker
                                                        → BRPOP redis:celery_queue
                                                        → 执行蒸馏任务
```

### 2. 热点数据缓存

频繁访问的数据（在线用户列表、最近消息、热门动态）缓存在 Redis 中，避免每次请求都查数据库：

```
请求 → 先查 Redis → 命中 → 直接返回（< 1ms）
                  → 未命中 → 查 PostgreSQL → 返回 + 写入 Redis 缓存
```

### 3. 短期记忆（热记忆）

克隆的内存系统分三级：

| 级别 | 存储 | TTL | 内容 |
|------|------|-----|------|
| **热记忆** | Redis | 24 小时 | 最近对话的上下文窗口 |
| **温记忆** | PostgreSQL `conversation_memories` | 永久 | 单段对话的摘要和关键事实 |
| **冷记忆** | PostgreSQL `long_term_memories` + pgvector | 永久 | 跨对话的长期记忆（带 embedding 可搜索） |

当克隆需要回复一条消息时，系统查询这三层记忆，按优先级递进。热记忆最快，但过期后自动降级到温/冷记忆。

---

## 数据流示例：发送一条消息

下面是一个完整的"用户发消息 → 克隆回复"数据流：

```
1. 用户点击发送
   → 前端 WebSocket 发送 {"type": "message", "content": "周末有空吗？"}
   → 后端 WebSocket 处理器收到

2. 写入消息
   → INSERT INTO messages (conversation_id, sender_id, sender_type='human', content)

3. 触发克隆回复
   → Celery 任务：ResponseGenerator.generate()
   → 从 Redis 读取热记忆（最近对话）
   → 从 PostgreSQL 读取系统提示词 + 温记忆
   → 从 pgvector 搜索相关长期记忆（embedding 余弦相似度）
   → 从 OpenAI API 获取回复

4. 写入克隆回复
   → INSERT INTO messages (conversation_id, sender_clone_id, sender_type='clone', content)

5. 推送给用户
   → WebSocket 推送 {"type": "message", "content": "这周末应该可以..."}
   → 前端实时显示

6. 更新状态
   → UPDATE conversation_memories（摘要本次对话）
   → UPDATE emotion_states（根据消息内容更新情绪）
   → INSERT INTO llm_usage_logs（记录 API 消耗）
```

整个过程——从你点击发送到看到克隆回复——在 1-5 秒内完成（取决于 LLM API 响应速度）。

---

## 本章小结

| 概念 | 一句话 |
|------|--------|
| PostgreSQL | 主力数据库——20+ 张表，JSONB 存灵活数据 |
| pgvector | PostgreSQL 向量扩展——让数据库能"找最像的人" |
| Redis | 内存存储——消息队列 + 热点缓存 + 24 小时热记忆 |
| 记忆分级 | 热（Redis 24h）→ 温（PostgreSQL 对话摘要）→ 冷（PostgreSQL + pgvector 长期记忆） |
| JSONB | 让同一张表既能存结构化字段又能存灵活 JSON |
