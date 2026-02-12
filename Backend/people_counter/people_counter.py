import cv2
import time
from ultralytics import YOLO
#import broadcast function from main ,main is outside this folder so we need to go one step back
import sys
import asyncio
sys.path.append("..")
import requests
import base64
from base64 import b64encode as base64_b64encode
# ---------------- CONFIG ----------------
VIDEO_PATH = "test_video.mp4"
MODEL_PATH = "yolov8n.pt"
CONF_THRESHOLD = 0.4
PROCESS_EVERY_SEC = 1  # seconds
# ---------------------------------------


def get_risk_level(count):
    if count > 15:
        return "HIGH"
    elif count >= 10:
        return "MODERATE"
    else:
        return "LOW"


async def main():
    if not cv2.VideoCapture(VIDEO_PATH).isOpened():
        print("Cannot open video:", VIDEO_PATH)
        return

    model = YOLO(MODEL_PATH)
    print(" Model loaded")

    cap = cv2.VideoCapture(VIDEO_PATH)
    fps = cap.get(cv2.CAP_PROP_FPS)

    frame_interval = int(fps * PROCESS_EVERY_SEC)
    frame_id = 0
    start_time = time.time()

    print("\n Starting video analysis (real-time style)\n")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % frame_interval == 0:
            timestamp = time.time() - start_time

            results = model(
                frame,
                conf=CONF_THRESHOLD,
                classes=[0],
                verbose=False
            )
            #yolo draws box
            annoted_frame = results[0].plot()
            _, buffer = cv2.imencode(".jpg", annoted_frame)
            frame_base64 = base64_b64encode(buffer).decode("utf-8")


            people_count = len(results[0].boxes)
            risk = get_risk_level(people_count)
            zone_payload = {
            "zone": "cctv_zone",          # must match frontend zone name
            "people": people_count,
            "risk": risk,
            "frame": frame_base64,
            "timestamp": round(timestamp, 1)
            }

            requests.post("http://localhost:8000/update-zone", json=zone_payload)

            # print(
            #     f" {timestamp:6.1f}s | "
            #     f"Frame {frame_id:5d} | "
            #     f"People: {people_count:2d} | "
            #     f"Risk: {risk}"
            # )

        frame_id += 1

    cap.release()
    print("\nVideo analysis complete")


if __name__ == "__main__":
    asyncio.run(main())
