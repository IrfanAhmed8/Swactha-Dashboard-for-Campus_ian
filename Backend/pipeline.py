# pipeline.py

import asyncio
import base64
import cv2
import requests

from frame_extractor import frame_generator
from people_counter.people_counter import detect_people
from yoloproject.yoloproject.yolo_detect import detect_garbage
from mail import send_alert_mail
from store_data import save_to_csv
print("People model loaded")


def get_risk_level(count):
    if count > 15:
        return "HIGH"
    elif count >= 10:
        return "MODERATE"
    else:
        return "LOW"
    
def cleanliness_score(people_count, garbage_count,
                        max_people=50,
                        max_garbage=10):
    """
    Calculate cleanliness score for a zone.

    Parameters:
    - people_count : number of people detected
    - garbage_count : number of garbage items detected
    - max_people : expected max people in frame
    - max_garbage : expected max garbage items in frame

    Returns:
    - score (0 to 100)
    - zone label
    - color
    """

    # Normalize values between 0 and 1
    people_norm = min(people_count / max_people, 1)
    garbage_norm = min(garbage_count / max_garbage, 1)

    # Main formula
    score = 100 - (
        70 * garbage_norm +
        30 * (garbage_norm * people_norm)
    )

    # Keep score within range
    score = max(0, min(100, round(score, 2)))

    # 6-color classification
    if score >= 90:
        label = "Very Clean"
        color = "Dark Green"

    elif score >= 75:
        label = "Clean"
        color = "Light Green"

    elif score >= 60:
        label = "Slightly Dirty"
        color = "Yellow"

    elif score >= 45:
        label = "Moderate Risk"
        color = "Orange"

    elif score >= 30:
        label = "Dirty"
        color = "Red"

    else:
        label = "Critical"
        color = "Dark Red"

    return {
        "score": score,
        "label": label,
        "color": color
    }

async def processor(queue):

    while True:

        frame = await queue.get()
        
        people_count, frame = detect_people(frame)
        garbage_count, frame = detect_garbage(frame)

        _, buffer = cv2.imencode(".jpg", frame)
        frame_base64 = base64.b64encode(buffer).decode()
        risk=get_risk_level(people_count)
        cleanliness_data = cleanliness_score(people_count, garbage_count)
        if cleanliness_data["score"]<50:
            send_alert_mail()
            
        payload = {
            "zone": "cctv_zone",

            "people": people_count,
            "garbage": garbage_count,

            "frame": frame_base64,

            "risk": risk,

            "cleanliness_score": cleanliness_data["score"],
            "cleanliness_label": cleanliness_data["label"],
            "cleanliness_color": cleanliness_data["color"],

            # optional but recommended
            "alert": cleanliness_data["score"] < 50
        }
        save_to_csv(payload)
        requests.post("http://localhost:8000/update-zone", json=payload)


async def main():

    queue = asyncio.Queue(maxsize=10)

    producer = asyncio.create_task(frame_generator(queue))
    consumer = asyncio.create_task(processor(queue))

    await asyncio.gather(producer, consumer)


if __name__ == "__main__":
    asyncio.run(main())