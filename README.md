# Swachhta Dashboard

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-orange)

## Overview

**Swachhta Dashboard** is an AI-enabled campus cleanliness monitoring system built with a Python backend and a React dashboard. The application uses CCTV video input and YOLOv8-based detection models to monitor one or more campus zones in real time.

The system tracks:

- Garbage/litter objects using a custom YOLOv8 model
- People count using a pretrained YOLOv8n model
- Zone cleanliness score and risk level
- Email alerts when cleanliness falls below threshold
- Live dashboard analytics via WebSockets

## Key Features

- Live campus cleanliness monitoring
- Garbage detection with bounding box overlays
- People counting and crowd risk estimation
- Zone-wise cleanliness scoring
- Real-time WebSocket dashboard updates
- CSV data logging with analytics endpoint
- Export reports to Excel and PDF from the dashboard
- Email notifications for low cleanliness scores

## Architecture & Workflow

```mermaid
flowchart TD
  A[CCTV Feed / Video Source] --> B[Frame Extraction]
  B --> C[People Detection (YOLOv8n)]
  B --> D[Garbage Detection (Custom YOLOv8)]
  C --> E[Risk Level Computation]
  D --> F[Garbage Count]
  E --> G[Cleanliness Score Calculation]
  F --> G
  G --> H[CSV Storage & Analytics]
  G --> I[Alert Service]
  H --> J[FastAPI Analytics Endpoint]
  J --> K[React Dashboard]
  I --> L[Email Notification]
  J --> K
```

## Implementation Summary

### Backend

- `Backend/main.py` - FastAPI server with WebSocket endpoint `/ws/zones` and analytics endpoint `/analytics`
- `Backend/pipeline.py` - asynchronous detection pipeline that reads frames, runs people and garbage detection, calculates scores, logs data, and triggers alerts
- `Backend/frame_extractor.py` - reads frames from `test1.mp4` and sends them into the async pipeline
- `Backend/people_counter/people_counter.py` - uses `ultralytics.YOLO("people_counter/yolov8n.pt")` for person detection with class filter `[0]`
- `Backend/yoloproject/yoloproject/yolo_detect.py` - loads `best (1).pt` and detects garbage items
- `Backend/mail.py` - Gmail SMTP alert sender with hard-coded sender/receiver and app password
- `Backend/store_data.py` - appends zone logs to `Backend/zone_logs.csv`
- `Backend/alert_system.py` - helper alert classification logic (not directly used by `pipeline.py`)

### Frontend

- Built with React + Vite
- UI code under `frontend/src`
- Dashboard overview in `frontend/src/App.jsx`
- Live zone map in `frontend/src/CampusMap.jsx`
- CCTV zone monitoring in `frontend/src/Cctv_zone.jsx`
- State and WebSocket management in `frontend/src/context/ZoneContext.jsx`
- Graphs powered by `recharts`
- Export utilities in `frontend/src/utils/exportReport.js`

### Data Flow

1. `Backend/frame_extractor.py` reads frames from a local video source
2. `Backend/pipeline.py` calls `detect_people()` and `detect_garbage()`
3. Scores and risk labels are computed in `cleanliness_score()`
4. Frame images are encoded and sent to the frontend via WebSocket
5. Zone updates are also posted via `POST /update-zone`
6. The React app renders live metrics and analytics charts

## Cleanliness Score Logic

The score is computed in `Backend/pipeline.py` with the following formula:

```python
people_norm = min(people_count / max_people, 1)
garbage_norm = min(garbage_count / max_garbage, 1)
score = 100 - (70 * garbage_norm + 30 * (garbage_norm * people_norm))
score = max(0, min(100, round(score, 2)))
```

Threshold labels:

- `>= 90` — Very Clean
- `>= 75` — Clean
- `>= 60` — Slightly Dirty
- `>= 45` — Moderate Risk
- `>= 30` — Dirty
- `< 30` — Critical

Risk level is defined by people count in `pipeline.py`:

- `> 15` → HIGH
- `>= 10` → MODERATE
- otherwise → LOW

## Alerting System

- Trigger condition: cleanliness score below `50`
- Email provider: Gmail SMTP (`smtp.gmail.com`, port `587`)
- Template: plain-text alert to campus authorities
- Alert frequency: every time the pipeline processes a frame with a score below threshold

> When cleanliness score drops below 50%, an email notification is automatically sent to the administrator.

## Model Details

### Garbage Detection Model

- Architecture: YOLOv8 custom detector via Ultralytics
- Model file: `Backend/yoloproject/yoloproject/best (1).pt`
- Detection confidence: `0.5`
- Instance visualization: bounding boxes rendered over frames with class and confidence labels

### People Detection Model

- Pretrained YOLOv8n model: `Backend/people_counter/yolov8n.pt`
- Detection confidence: `0.4`
- Class filter: only person class `[0]`
- Counting logic: `len(results[0].boxes)`

## Dataset Information

The repository provides model weight files but does not include an explicit dataset configuration, annotation files, or a training split. The model artifacts are stored under:

- `Backend/people_counter/yolov8n.pt`
- `Backend/yoloproject/yoloproject/best (1).pt`

No `data.yaml`, `*.yaml`, or dataset manifest was found in the repository, so detailed dataset size, split, and annotation format cannot be verified from available files.

## Performance Metrics

No training or evaluation metrics were found in the repository.
The repository does not contain explicit precision/recall/mAP reports or confusion matrix outputs.

## Dashboard Features

### Campus Monitoring Dashboard

- Live campus status overview
- Overall cleanliness percentage
- Total people and garbage counts
- Dirty zone count
- Cleanest and dirtiest zone indicators
- Excel/PDF export actions

### CCTV Zone Monitoring

- Live camera feed from encoded frames
- Garbage and person detection overlays
- Risk level and cleanliness score display
- Progress bar and status text
- Historical analytics graphs

### Analytics

- Live people and garbage trend chart
- Zone risk visualization
- Backend analytics polling via `/analytics`

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Recharts, Chart.js, jsPDF, xlsx |
| Backend | Python, FastAPI, WebSockets, pandas, requests |
| AI / ML | Ultralytics YOLOv8, OpenCV, YOLOv8n |
| Storage | CSV logging (`Backend/zone_logs.csv`) |
| Deployment | Local Python server + Vite development server |

## Installation Guide

### 1. Clone the repository

```bash
git clone <repo-url>
cd Swactha-Dashboard-for-Campus_ian
```

### 2. Install backend dependencies

Create a Python virtual environment and install packages:

```bash
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn opencv-python ultralytics pandas requests
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start the backend server

From the repository root:

```bash
uvicorn Backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Start the detection pipeline

In a separate terminal from the repository root:

```bash
python Backend/pipeline.py
```

### 6. Start the frontend dashboard

```bash
cd frontend
npm run dev
```

### 7. Open the dashboard

Visit the Vite URL printed in the terminal, typically `http://localhost:5173`.

## Project Structure

```text
Swactha-Dashboard-for-Campus_ian/
├── Backend/
│   ├── alert_system.py
│   ├── frame_extractor.py
│   ├── main.py
│   ├── mail.py
│   ├── pipeline.py
│   ├── store_data.py
│   ├── zone_logs.csv
│   ├── people_counter/
│   │   ├── people_counter.py
│   │   └── yolov8n.pt
│   └── yoloproject/
│       └── yoloproject/
│           ├── best (1).pt
│           ├── best.pt
│           ├── best1.pt
│           ├── best_old.pt
│           ├── test_camera.py
│           ├── yolo_detect.py
│           └── runs/
│               └── detect/
│                   └── predict/
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── CampusMap.jsx
│   │   ├── Cctv_zone.jsx
│   │   ├── LineGraph.jsx
│   │   ├── RiskAnalysis.jsx
│   │   ├── ZoneRiskGraph.jsx
│   │   ├── context/ZoneContext.jsx
│   │   ├── components/AnalyticsGraph.jsx
│   │   ├── style/Cctv_zone.css
│   │   ├── utils/exportReport.js
│   │   └── images/
│   │       ├── graph1.jpeg
│   │       └── graph2.jpg
│   ├── index.html
│   └── vite.config.js
├── package.json
└── README.md
```

## API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/ws/zones` | WebSocket | Real-time zone updates to dashboard clients |
| `/update-zone` | POST | Accepts detector JSON payload and forwards it to connected clients |
| `/analytics` | GET | Returns the latest 50 CSV records as JSON records |

### `/update-zone` Payload Example

```json
{
  "zone": "cctv_zone",
  "people": 5,
  "garbage": 2,
  "frame": "<base64-jpeg>",
  "risk": "LOW",
  "cleanliness_score": 78.22,
  "cleanliness_label": "Clean",
  "cleanliness_color": "Light Green",
  "alert": false
}
```

## Known Limitations

- No dataset split or annotation metadata is included in the repository
- No explicit model performance metrics are present
- `Backend/frame_extractor.py` expects a local `test1.mp4` source file
- `Backend/mail.py` uses hard-coded Gmail credentials and should be secured before production
- `Backend/alert_system.py` is present but not currently wired into the live pipeline

## Future Enhancements

- Add multi-camera support and zone-specific routing
- Store historical data in a database instead of CSV
- Add live heatmaps and map overlays for campus risk
- Build mobile-friendly dashboard views
- Support model retraining and dataset versioning
- Add authentication and admin role management

## Contributors

- Project author: `jafriirfan36@gmail.com` (inferred from backend mail configuration)

## License

No license file was found in the repository. Add an open-source license such as MIT or Apache 2.0 if you intend to publish this project.

## Acknowledgements

- Ultralytics YOLOv8 for object detection support
- FastAPI for realtime WebSocket and analytics APIs
- React + Vite for the frontend dashboard experience
- Recharts for interactive analytics visualization
