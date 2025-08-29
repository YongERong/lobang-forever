import asyncio
import os
import json
import logging

import aiofiles
from dotenv import load_dotenv
from TikTokApi import TikTokApi

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
ms_token = os.getenv("TIKTOK_MSTOKEN")
n = 30  # Batch size, adjust as required


async def trending_videos():
    async with aiofiles.open("data4.jsonl", "a+") as f:
        async with TikTokApi(logging_level=logging.DEBUG) as api:
            await api.create_sessions(
                ms_tokens=[ms_token],
                num_sessions=1,
                sleep_after=3,
                browser=os.getenv("TIKTOK_BROWSER", "chromium"),
                timeout=10800000,  # 3 hours, can set longer as required
                headless=False,
            )
            async for video in api.trending.videos(count=n):
                comments = []
                async for comment in video.comments(count=30):  # adjust as required
                    comments.append(comment.as_dict)
                video_data = video.as_dict
                video_data["comments"] = comments
                logging.info("Adding Video...")
                await f.write(json.dumps(video_data) + "\n")


if __name__ == "__main__":
    while True:
        asyncio.run(trending_videos())
