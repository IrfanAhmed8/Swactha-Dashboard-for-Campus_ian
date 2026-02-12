from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients = []

@app.websocket("/ws/zones")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print(" WebSocket client connected")
    clients.append(websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        print(" WebSocket client disconnected")
        clients.remove(websocket)


@app.post("/update-zone")
async def update_zone(data: dict):
    #only print zone and risk for now, can print more later
    print(f" Received from detector: Zone={data['zone']}, Risk={data['risk']}, People={data['people']}")
   

    for client in clients:
        await client.send_json(data)

    return {"status": "ok"}
