import cv2
from ultralytics import YOLO

# Load your trained model
model = YOLO("best.pt")

# Open laptop webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Cannot access camera")
    exit()

print("Press 'q' to quit")

while True:

    ret, frame = cap.read()

    if not ret:
        break

    # Run YOLO detection
    results = model(frame)

    # Draw detections on frame
    annotated_frame = results[0].plot()

    # Show output
    cv2.imshow("Garbage Detection", annotated_frame)

    # Quit on pressing q
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()