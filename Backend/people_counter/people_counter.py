# people_worker.py

from ultralytics import YOLO

model = YOLO("people_counter/yolov8n.pt")


def detect_people(frame):

    results = model(
        frame,
        conf=0.4,
        classes=[0],   # person class
        verbose=False
    )

    # Count detected people
    people_count = len(results[0].boxes)

    # Draw bounding boxes
    annotated_frame = results[0].plot()

    return people_count, annotated_frame