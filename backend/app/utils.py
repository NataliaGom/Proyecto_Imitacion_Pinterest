from datetime import datetime
from math import ceil

from fastapi import Header, HTTPException


def get_user_id(x_user_id: str | None = Header(default=None, alias="X-User-Id")):
    if not x_user_id or not x_user_id.strip():
        raise HTTPException(status_code=400, detail="El header X-User-Id es obligatorio")
    return x_user_id.strip()


def tags_to_text(tags: list[str] | None) -> str:
    if not tags:
        return ""
    clean_tags = [tag.strip() for tag in tags if tag and tag.strip()]
    return ",".join(clean_tags)


def text_to_tags(tags: str | None) -> list[str]:
    if not tags:
        return []
    return [tag.strip() for tag in tags.split(",") if tag.strip()]


def serialize_post(row: dict, current_user: str) -> dict:
    return {
        "id": row["id"],
        "user_id": row["user_id"],
        "title": row["title"],
        "description": row.get("description") or "",
        "image_url": row["image_url"],
        "tags": text_to_tags(row.get("tags")),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "can_edit": row["user_id"] == current_user,
    }


def pagination_meta(page: int, page_size: int, total: int) -> dict:
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": ceil(total / page_size) if total else 1,
    }


def parse_min_date(min_date: str | None):
    if not min_date:
        return None
    try:
        parsed_date = datetime.fromisoformat(min_date.replace("Z", "+00:00"))
        return parsed_date.replace(tzinfo=None)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="min_date debe estar en formato ISO 8601") from exc
