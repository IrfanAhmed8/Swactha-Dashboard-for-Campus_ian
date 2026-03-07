# garbage_worker.py

from ultralytics import YOLO

model = YOLO("yoloproject/yoloproject/best.pt")

def detect_garbage(frame):

    results = model(frame, conf=0.5, verbose=False)

    garbage_count = len(results[0].boxes)

    return garbage_count, results[0].plot()