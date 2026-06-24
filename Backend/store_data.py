import csv
import os
from datetime import datetime

CSV_FILE = "zone_logs.csv"

def save_to_csv(payload):

    file_exists = os.path.isfile(CSV_FILE)

    with open(CSV_FILE, mode="a", newline="") as file:

        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "timestamp",
                "zone",
                "people",
                "garbage",
                "risk",
                "cleanliness_score"
            ])

        writer.writerow([
            datetime.now().strftime("%H:%M:%S"),
            payload["zone"],
            payload["people"],
            payload["garbage"],
            payload["risk"],
            payload["cleanliness_score"]
        ])