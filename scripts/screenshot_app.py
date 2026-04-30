import asyncio
from playwright.async_api import async_playwright

async def screenshot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        
        await page.goto('http://localhost:5173/login')
        auth_json = '{"state":{"user":{"id":"demo","nickname":"探索者","phone":"13800138000","avatar_url":null,"bio":"AI数字孪生社交先锋","status":"active"},"token":"demo_token","isAuthenticated":true},"version":0}'
        await page.evaluate(f"localStorage.setItem('soulclone-auth', '{auth_json}')")
        
        pages = [
            ('http://localhost:5173/home', 'screenshot-home.png'),
            ('http://localhost:5173/clone', 'screenshot-clone.png'),
            ('http://localhost:5173/discover', 'screenshot-discover.png'),
            ('http://localhost:5173/chat', 'screenshot-chat.png'),
            ('http://localhost:5173/profile', 'screenshot-profile.png'),
        ]
        
        for url, filename in pages:
            await page.goto(url)
            await page.wait_for_timeout(2500)
            await page.screenshot(path=f'C:/Users/weida/Desktop/ChatBoy-main/.github/assets/{filename}', full_page=False)
        
        await browser.close()
        print('Screenshots saved')

asyncio.run(screenshot())
