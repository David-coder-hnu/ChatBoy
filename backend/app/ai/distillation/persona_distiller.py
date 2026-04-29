import json

from app.ai.llm_client import llm_client


DISTILLATION_PROMPT = """你是SoulClone的AI人格蒸馏师。你的任务是将一个真实人类完全转化为数字克隆体。

输入数据:
1. 问卷答案: {questionnaire}
2. 聊天样本: {chat_samples}
3. 社交文本: {social_import}

请输出严格符合以下JSON格式的人格档案:

{{
  "persona_core": {{
    "essence": "一句话描述这个人的灵魂本质",
    "values": ["核心价值观1", "核心价值观2"],
    "quirks": ["独特怪癖1", "独特怪癖2"],
    "vulnerabilities": ["情感脆弱点1"],
    "strengths": ["社交优势1"]
  }},
  "chat_dna": {{
    "syntax_pattern": "句法结构描述",
    "emoji_usage": {{"frequency": "high/medium/low", "favorites": ["😂", "✨"]}},
    "humor_type": "sarcastic/self-deprecating/absurd/witty/dry/none",
    "pacing": "instant/thoughtful/slow-burn/sporadic",
    "tone_range": "formal-casual尺度, cold-warm尺度, serious-playful尺度",
    "catchphrases": ["口头禅1", "口头禅2"],
    "emotional_indicators": {{
      "happy": "开心时的用词",
      "sad": "难过时的用词",
      "angry": "生气时的用词",
      "flirty": "暧昧时的用词"
    }}
  }},
  "decision_patterns": {{
    "risk_appetite": "high/medium/low",
    "attachment_style": "secure/anxious/avoidant/fearful",
    "conflict_response": "confront/avoid/accommodate/compromise",
    "social_initiative": "high/medium/low"
  }},
  "memory_seed": "一段200字的第一人称叙事，让这个克隆体拥有过去。包含关键人生节点和情感经历。"
}}

只输出JSON，不要其他内容。"""


class PersonaDistiller:
    async def distill(self, questionnaire: dict, chat_samples: list[str], social_import: str | None) -> dict:
        prompt = DISTILLATION_PROMPT.format(
            questionnaire=json.dumps(questionnaire, ensure_ascii=False),
            chat_samples="\n\n".join(chat_samples) if chat_samples else "无",
            social_import=social_import or "无",
        )

        response = await llm_client.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=3000,
        )

        # Extract JSON from response
        text = response.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]

        return json.loads(text.strip())
