from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()


@app.get("/ping")
async def root():
    return {"message": "pong"}

lambda_handler = Mangum(app=app)
