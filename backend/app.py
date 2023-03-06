from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()


@app.get("/ping")
async def root():
    return {"message": "pong-2"}

lambda_handler = Mangum(app=app)
