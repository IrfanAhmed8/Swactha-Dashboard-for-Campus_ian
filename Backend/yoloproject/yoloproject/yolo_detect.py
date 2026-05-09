from ultralytics import YOLO
import cv2

model = YOLO("yoloproject/yoloproject/best.pt")

def detect_garbage(frame):

    results = model(frame, conf=0.5, verbose=False)

    garbage_count = 0

    for box in results[0].boxes:

        garbage_count += 1

        # Bounding box coordinates
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        # Confidence
        conf = float(box.conf[0])

        # Class ID
        class_id = int(box.cls[0])

        # Class name from model
        class_name = model.names[class_id]

        # Final label
        label = f"{class_name} {conf:.2f}"

        # Draw rectangle
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)

        # Draw label
        cv2.putText(
            frame,
            label,
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 0, 255),
            2
        )

    return garbage_count, frame