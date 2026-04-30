# Contributing to SoulClone

感谢你的兴趣。在提交贡献之前，请阅读以下指南。

## 开发环境

确保你已安装：

- Node.js 20+
- Python 3.12+
- Docker & Docker Compose

## 提交规范

使用以下类型前缀：

- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建/工具

## 代码检查

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

## 提交 PR

1. Fork 仓库并创建功能分支
2. 确保所有检查通过
3. 提交 PR 并描述变更动机

## 设计规范

UI 变更需遵循 **Liquid Dark Matter** 设计系统：

- 背景色：`#050508`
- 卡片表面：`#0a0a10`
- 强调色：Cyan `#00f0ff` / Magenta `#ff006e` / Gold `#ffbe0b`
- 标题字体：Sora + Noto Serif SC
- 正文字体：Inter
