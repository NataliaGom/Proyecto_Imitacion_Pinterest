from psycopg2 import connect
from psycopg2.extras import RealDictCursor

from .config import get_settings


def get_connection():
    settings = get_settings()
    if not settings["database_url"]:
        raise RuntimeError("DATABASE_URL no está configurada")

    return connect(settings["database_url"], cursor_factory=RealDictCursor)


def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(100) NOT NULL,
            title VARCHAR(180) NOT NULL,
            description TEXT,
            image_url TEXT NOT NULL,
            tags TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    cur.execute("CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);")
    conn.commit()
    cur.close()
    conn.close()
