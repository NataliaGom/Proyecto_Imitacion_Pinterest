import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


@lru_cache
def get_settings():
    return {
        "database_url": os.getenv("DATABASE_URL", ""),
        "unsplash_access_key": os.getenv("UNSPLASH_ACCESS_KEY", ""),
        "frontend_origin": os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
    }
