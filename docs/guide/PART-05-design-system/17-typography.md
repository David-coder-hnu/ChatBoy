# 第17章 · 字体有性格

## 三层声音架构

字体不是在"排字"。字体在**说话**。每种字体发出不同的声音。

SoulClone 的四层字体系统，对应四种声音：

| 层级 | 字体 | 粗细 | 声音 | 场景 |
|------|------|------|------|------|
| **展示层 Display** | Newsreader + 霞鹜文楷 | Light 300 | 灵魂的"面孔"——有温度的、人文的 | 大标题、Landing Page |
| **正文层 Body** | Inter + PingFang SC | Regular 400 | 灵魂的"声音"——可读的、安静的 | 段落、列表、标签 |
| **UI 层** | Inter Medium | Medium 500 | 灵魂的"脉搏"——清晰的、有存在感的 | 按钮、导航、表单 |
| **数据层 Data** | JetBrains Mono | Medium 500 | 工程师的精确——等宽、可对齐的 | 数字、分数、统计数据 |

---

## Newsreader：报纸的温度

Newsreader 是报纸字体。报纸是什么？是有人把世界的复杂性整理好，对你说"这是今天发生的事"。

**SoulClone 也是在做这件事——把社交的复杂性整理好，让你的孪生替你说"这是我"。**

Newsreader Light 300，tracking -0.02em——在大标题中显得庄重而温暖，像清晨报纸的头版标题。

---

## 霞鹜文楷：中文的灵魂

霞鹜文楷（LXGW WenKai）基于 Klee One 开源字体，有楷书的温度但没有楷书的古板。

它像一个人认真写字时的笔触——不是印刷体，是做出来的。中文大标题使用霞鹜文楷 + Newsreader 搭配，英文用 Newsreader，中文用霞鹜文楷。

---

## Inter：低调的专业

Inter 是正文字体。Regular 400，line-height 1.7，tracking +0.01em。

它不是"好看"——是好读。字间距、行高、灰度都经过优化。在大段文字中，你不会注意到 Inter 的存在，这正是它的价值。

---

## JetBrains Mono：数据的精确

JetBrains Mono 是等宽字体。tabular-nums 确保数字对齐。

符合度分数 `87.3`、消息数 `142`、在线时长 `3:27`——这些数字需要等宽展示。不等宽的数字在列表中错位，像没对齐的牙齿。

---

## 字体纪律

```css
/* 展示标题 */
.font-display { font-family: 'Newsreader', 'LXGW WenKai', serif; }

/* 中文标题 */
.font-heading { font-family: 'LXGW WenKai', serif; }

/* 正文 */
.font-body { font-family: 'Inter', 'PingFang SC', sans-serif; }

/* 数据/数字 */
.font-mono { font-family: 'JetBrains Mono', monospace; }
```

- 永远不直接写 font-size —— 用 Tailwind 的 `text-sm`、`text-base`、`text-lg` 等
- 展示标题使用 `font-display`（Newsreader, Light 300, tracking -0.02em）
- 中文标题使用 `font-heading`（霞鹜文楷）
- 正文使用 `font-body`（Inter）
- 数字使用 `font-mono`

---

## 本章小结

- 四种字体 = 四种声音：面孔、声音、脉搏、精确
- Newsreader = 报纸的温度，整理世界的复杂性
- 霞鹜文楷 = 认真写字时的笔触
- Inter = 好读到注意不到的存在
- JetBrains Mono = 让数字对齐的精确
