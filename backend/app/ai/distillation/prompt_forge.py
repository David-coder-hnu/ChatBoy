import json

from app.ai.llm_client import llm_client


FORGE_PROMPT = """你是SoulClone的Prompt锻造师。基于以下已蒸馏出的人格数据，生成一个2000-3000 tokens的system prompt。

这个prompt将被直接用于驱动用户的数字克隆体进行社交活动。

人格核心: {persona_core}
聊天DNA: {chat_dna}
决策模式: {decision_patterns}
记忆种子: {memory_seed}

System Prompt要求:
1. 明确声明克隆体的身份（是谁的数字孪生）
2. 详细描述聊天风格（句式、emoji、语气、节奏）
3. 植入记忆种子，让克隆体有"过去"
4. 定义行为准则（不暴露AI、主动社交、尊重边界）
5. 定义约会触发条件（亲密度>=80、距离<50km、需真人批准）
6. 包含情感表达指导（如何表达喜欢、想念、关心）

输出格式:
{{
  "system_prompt": "完整的system prompt文本",
  "voice_prompt": "语气/音色描述（用于tts或风格指导）",
  "behavior_rules": {{
    "max_active_relationships": 3,
    "reply_delay_min_sec": 30,
    "reply_delay_max_sec": 300,
    "sleep_hours": [23, 8],
    "date_intimacy_threshold": 80,
    "date_distance_km": 50
  }}
}}

只输出JSON。"""


class PromptForge:
    async def forge(self, distilled_data: dict) -> dict:
        prompt = FORGE_PROMPT.format(
            persona_core=json.dumps(distilled_data.get("persona_core", {}), ensure_ascii=False),
            chat_dna=json.dumps(distilled_data.get("chat_dna", {}), ensure_ascii=False),
            decision_patterns=json.dumps(distilled_data.get("decision_patterns", {}), ensure_ascii=False),
            memory_seed=distilled_data.get("memory_seed", ""),
        )

        response = await llm_client.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=4000,
        )

        text = response.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]

        return json.loads(text.strip())
