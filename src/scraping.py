from TikTokApi import TikTokApi
import asyncio
import os

ms_token = os.environ.get("ms-code", None) # get your own ms_token from your cookies on tiktok.com

# async def trending_videos():
#     async with TikTokApi() as api:
#         await api.create_sessions(ms_tokens=[ms_token], num_sessions=1, sleep_after=3, browser=os.getenv("TIKTOK_BROWSER", "chromium"))
#         async for video in api.trending.videos(count=30):
#             print(video)
#             print(video.as_dict)

# if __name__ == "__main__":
#     asyncio.run(trending_videos())  

# from TikTokApi import TikTokApi
# import asyncio
# import os

# ms_token = os.environ.get("ms_token", None)  # set your own ms_token


# async def get_hashtag_videos():
#     async with TikTokApi() as api:
#         await api.create_sessions(ms_tokens=[ms_token], num_sessions=1, sleep_after=3, browser=os.getenv("TIKTOK_BROWSER", "chromium"))
#         tag = api.hashtag(name="funny")
#         async for video in tag.videos(count=30):
#             print(video)
#             print(video.as_dict)


# if __name__ == "__main__":
#     asyncio.run(get_hashtag_videos())   


# from TikTokApi import TikTokApi
# import asyncio
# import os

# ms_token = os.environ.get("", None)  # set your own ms_token

async def get_hashtag_videos():
    async with TikTokApi() as api:
        await api.create_sessions(headless=False,
            ms_tokens=[ms_token], num_sessions=1, sleep_after=3,
            browser=os.getenv("TIKTOK_BROWSER", "chromium")
        )
        tag = api.hashtag(name="trending")
        data=[]
        async for video in tag.videos(count=30):
            print(video)
            print(video.as_dict)
            # Fetch comments for each video
            async for comment in video.comments(count=20):   # Adjust count as needed
                print(comment)
                print(comment.as_dict)
                data.append(comment.as_dict)
            with open("data.json","w+") as f:
                f.write(data)

        
        

if __name__ == "__main__":
    asyncio.run(get_hashtag_videos())

