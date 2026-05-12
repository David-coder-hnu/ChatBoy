# 第19章 · 声音系统——界面的灵魂

## 零音频文件

SoulClone 没有任何 `.mp3`、`.wav`、`.ogg` 文件。8 种品牌音效全部通过 **Web Audio API** 从零合成。

为什么？
1. **零加载时间**——不需要下载音频文件
2. **一致的音色**——所有音效共享相同的合成参数基线
3. **品牌清晰度**——不是"听起来像某个库里的音效"，是"这就是 SoulClone 的声音"

---

## 8 种品牌音效

### 页面转场 `page-transition`
柔和噪声扫频。不是"咔嚓"——是一个软过渡，像翻书页时的轻微沙沙声。

### 发送消息 `send-message`
523Hz 清脆弹拨。一个短促而明亮的音符——"你的话已经发出去了"。

### 接收消息 `receive-message`
659+784Hz 水晶钟声。两个音符组成的小和弦——比发送音更温暖、更有回响。"有人在回应你"。

### 匹配成功 `match`
523+659+784Hz 魔法闪烁。三音和弦加上闪烁效果——"你们之间有什么事情开始了"。

### 上线 `toggle-on`
300→600Hz 能量扫频。从低到高的频率上升——"你的孪生从休眠中醒来了"。

### 意识交接 `handover`
上升合唱和声。多层和声从低到高渐强——"这是仪式性的时刻，不是普通按钮"。

### 新通知 `notification`
880+1109Hz 柔和铃响。高频但低音量——有提醒但不打扰。

### 错误 `error`
150Hz 柔和闷响。低频——不是"你做错了"的尖叫，是"这事没成"的提示。低频比高频更不让人焦虑。

---

## 如何使用

```typescript
import { playSound, initAudioContext } from '@/lib/sound'

// 在用户第一次交互时初始化 AudioContext
// （满足浏览器自动播放策略）
initAudioContext()

// 任何地方触发音效
playSound('send-message')
playSound('match')
```

`initAudioContext()` 必须在用户第一次交互（点击、触摸、按键）时调用。这是浏览器的限制——不允许页面在没有人交互的情况下播放声音。SoulClone 在第一次点击/触摸时初始化，之后所有音效正常触发。

---

## 声音映射表

| 用户动作 | 触发的音效 |
|---------|-----------|
| 点击发送按钮 | `send-message` |
| 收到新消息 | `receive-message` |
| 匹配成功弹窗 | `match` |
| 点击在线/离线切换 | `toggle-on` |
| 点击下线（交接仪式开始） | `handover` |
| 新通知到达 | `notification` |
| 操作失败 | `error` |
| 页面路由切换 | `page-transition` |

---

## 声音纪律

- 声音默认开启，通过 `localStorage` key `soulclone-sound-enabled` 关闭
- 用户可以在设置中关闭声音——不是在代码里写死
- 音频错误是非致命的——永远用 try/catch 包裹，永远不阻塞 UI
- AudioContext 在第一次用户交互时初始化

```typescript
// sound.ts 中的安全调用模式
export function playSound(name: SoundName) {
  try {
    if (localStorage.getItem('soulclone-sound-enabled') === 'false') return
    // ... 合成并播放
  } catch {
    // 音频错误不影响 UI
  }
}
```

---

## 本章小结

- 8 种品牌音效，Web Audio API 从零合成
- 零音频文件 → 零加载时间
- 每个关键交互都有声音反馈
- 音色设计有语义意图——低频柔和、高频明亮、和弦温暖
- 可关闭，错误非致命
