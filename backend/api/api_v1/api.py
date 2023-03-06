from fastapi import APIRouter

from .endpoints import ping

router = APIRouter()
router.include_router(ping.router, prefix="/ping", tags=["Ping"])
