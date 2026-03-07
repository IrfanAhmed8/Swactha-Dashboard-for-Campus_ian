# frame_stream.py
import cv2
import time
import asyncio

VIDEO_PATH = "test_video.mp4"
FRAME_INTERVAL = 5  # seconds

async def frame_generator(queue):

    cap = cv2.VideoCapture(VIDEO_PATH)

    if not cap.isOpened():
        print("Cannot open video")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * FRAME_INTERVAL)

    frame_id = 0

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        if frame_id % frame_interval == 0:
            await queue.put(frame)

        frame_id += 1

    cap.release()