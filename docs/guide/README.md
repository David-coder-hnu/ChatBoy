# SoulClone 入门指引

本目录包含 SoulClone 入门指引的全部 26 章内容。

## 构建 PDF

```powershell
# Windows PowerShell
.\build.ps1
```

`build.ps1` 会将所有章节按顺序拼接为一个 markdown 文件 `soulclone-beginners-guide.md`，然后用 gstack 的 `make-pdf` 技能转换为 PDF。

## 目录结构

```
docs/guide/
├── README.md            ← 本文件
├── 00-cover.md          ← 封面
├── 00-toc.md            ← 目录
├── build.ps1             ← 拼接脚本
├── PART-01-vision/      ← 第一部分：理念篇（第1-3章）
├── PART-02-first-clone/ ← 第二部分：上手篇（第4-6章）
├── PART-03-tech-behind-soul/ ← 第三部分：技术篇（第7-10章）
├── PART-04-ai-twin/     ← 第四部分：AI孪生篇（第11-14章）
├── PART-05-design-system/ ← 第五部分：设计体系篇（第15-19章）
├── PART-06-development/ ← 第六部分：开发指南（第20-23章）
├── PART-07-going-further/ ← 第七部分：进阶篇（第24-26章）
└── assets/              ← 图片和图表
    ├── diagrams/
    └── screenshots/
```
