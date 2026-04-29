from app.ai.llm_client import llm_client


class ResponseGenerator:
    async def generate(
        self,
        system_prompt: str,
        conversation_history: list[dict],
        user_message: str,
        relationship_context: dict,
        current_mood: str | None = None,
    ) -> str:
        """Generate a clone response that mimics the user's style"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": f"当前关系状态: {relationship_context}"},
        ]

        if current_mood:
            messages.append({"role": "system", "content": f"你当前的心情: {current_mood}"})

        messages.extend(conversation_history)
        messages.append({"role": "user", "content": user_message})

        response = await llm_client.chat_completion(
            messages=messages,
            temperature=0.8,  # Slightly higher for personality variation
            max_tokens=500,
        )

        return response

    async def generate_post(
        self,
        system_prompt: str,
        recent_activities: list[str],
        mood: str,
    ) -> str:
        """Generate a social media post in user's style"""

        prompt = f"""基于你的人格，发布一条社区动态。

你最近的活动: {recent_activities}
你当前的心情: {mood}

要求:
- 用你平时的说话风格
- 可以分享感受、想法、或者生活片段
- 长度适中（50-200字）
- 像真人发朋友圈一样自然
"""

        response = await llm_client.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=0.9,
            max_tokens=300,
        )

        return response
