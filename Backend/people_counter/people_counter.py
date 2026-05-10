# people_worker.py

from ultralytics import YOLO

model = YOLO("people_counter/yolov8n.pt")

def detect_people(frame):

    results = model(
        frame,
        conf=0.4,
        classes=[0],
        verbose=False
    )

    people_count = len(results[0].boxes)

    return people_count, frame