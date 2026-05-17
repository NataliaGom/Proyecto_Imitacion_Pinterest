from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from ..database import get_connection
from ..schemas import PostCreate, PostPatch, PostReplace
from ..utils import get_user_id, pagination_meta, parse_min_date, serialize_post, tags_to_text

router = APIRouter(prefix="/api/posts", tags=["posts"])


def fetch_post_or_404(cur, post_id: int):
    cur.execute("SELECT * FROM posts WHERE id = %s;", (post_id,))
    post = cur.fetchone()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    return post


def ensure_owner(post: dict, current_user: str):
    if post["user_id"] != current_user:
        raise HTTPException(status_code=403, detail="No puedes modificar o eliminar posts creados por otro usuario")


@router.get("")
def list_posts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=48),
    min_date: str | None = None,
    current_user: str = Depends(get_user_id),
):
    min_date_value = parse_min_date(min_date)
    offset = (page - 1) * page_size
    where_sql = "WHERE updated_at > %s" if min_date_value else ""
    params = (min_date_value,) if min_date_value else ()

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT COUNT(*) AS total FROM posts {where_sql};", params)
    total = cur.fetchone()["total"]
    cur.execute(
        f"""
        SELECT * FROM posts
        {where_sql}
        ORDER BY updated_at DESC, created_at DESC
        LIMIT %s OFFSET %s;
        """,
        (*params, page_size, offset),
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return {
        "items": [serialize_post(row, current_user) for row in rows],
        "pagination": pagination_meta(page, page_size, total),
        "min_date": min_date,
    }


@router.get("/{post_id}")
def get_post(post_id: int, current_user: str = Depends(get_user_id)):
    conn = get_connection()
    cur = conn.cursor()
    post = fetch_post_or_404(cur, post_id)
    cur.close()
    conn.close()
    return serialize_post(post, current_user)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate, current_user: str = Depends(get_user_id)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO posts (user_id, title, description, image_url, tags)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING *;
        """,
        (current_user, payload.title, payload.description, str(payload.image_url), tags_to_text(payload.tags)),
    )
    post = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return serialize_post(post, current_user)


@router.patch("/{post_id}")
def patch_post(post_id: int, payload: PostPatch, current_user: str = Depends(get_user_id)):
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(status_code=400, detail="Debes enviar al menos un campo para actualizar")

    conn = get_connection()
    cur = conn.cursor()
    post = fetch_post_or_404(cur, post_id)
    ensure_owner(post, current_user)

    allowed_fields = []
    values = []
    for field, value in updates.items():
        allowed_fields.append(f"{field} = %s")
        if field == "tags":
            values.append(tags_to_text(value))
        elif field == "image_url":
            values.append(str(value))
        else:
            values.append(value)

    values.append(post_id)
    cur.execute(
        f"""
        UPDATE posts
        SET {", ".join(allowed_fields)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING *;
        """,
        tuple(values),
    )
    updated_post = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return serialize_post(updated_post, current_user)


@router.put("/{post_id}")
def replace_post(post_id: int, payload: PostReplace, current_user: str = Depends(get_user_id)):
    conn = get_connection()
    cur = conn.cursor()
    post = fetch_post_or_404(cur, post_id)
    ensure_owner(post, current_user)
    cur.execute(
        """
        UPDATE posts
        SET title = %s,
            description = %s,
            image_url = %s,
            tags = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING *;
        """,
        (payload.title, payload.description, str(payload.image_url), tags_to_text(payload.tags), post_id),
    )
    updated_post = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return serialize_post(updated_post, current_user)


@router.delete("/{post_id}")
def delete_post(post_id: int, response: Response, current_user: str = Depends(get_user_id)):
    conn = get_connection()
    cur = conn.cursor()
    post = fetch_post_or_404(cur, post_id)
    ensure_owner(post, current_user)
    cur.execute("DELETE FROM posts WHERE id = %s;", (post_id,))
    conn.commit()
    cur.close()
    conn.close()
    response.status_code = status.HTTP_200_OK
    return {"message": "Post eliminado correctamente", "id": post_id}
