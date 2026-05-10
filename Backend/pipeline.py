# pipeline.py

import asyncio
import base64
import cv2
import requests

from frame_extractor import frame_generator
from people_counter.people_counter import detect_people
from yoloproject.yoloproject.yolo_detect import detect_garbage

print("People model loaded")


def get_risk_level(count):
    if count > 15:
        return "HIGH"
    elif count >= 10:
        return "MODERATE"
    else:
        return "LOW"

async def processor(queue):

    while True:

        frame = await queue.get()

        people_count, frame = detect_people(frame)
        garbage_count, frame = detect_garbage(frame)

        _, buffer = cv2.imencode(".jpg", frame)
        frame_base64 = base64.b64encode(buffer).decode()
        risk=get_risk_level(people_count)
        payload = {
            "zone": "cctv_zone",
            "people": people_count,
            "garbage": garbage_count,
            "frame": frame_base64,
            "risk": risk,
        }

        requests.post("http://localhost:8000/update-zone", json=payload)


async def main():

    queue = asyncio.Queue(maxsize=10)

    producer = asyncio.create_task(frame_generator(queue))
    consumer = asyncio.create_task(processor(queue))

    await asyncio.gather(producer, consumer)


if __name__ == "__main__":
    asyncio.run(main())