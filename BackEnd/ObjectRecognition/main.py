from typing import Optional

from fastapi import FastAPI

import cars_detection
import predict

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/countcars")
def read_item(image_url: str):
    return cars_detection.countCars(image_url)

@app.post("/detectsign")
def read_item(image_url: str):
    return predict.predictTrafficSign(image_url)