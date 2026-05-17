from fastapi import APIRouter, Depends, HTTPException, Query
import httpx

from ..config import get_settings
from ..utils import get_user_id

router = APIRouter(prefix="/api/discovery", tags=["discovery"])


@router.get("")
async def list_discovery_photos(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=12, ge=1, le=30),
    current_user: str = Depends(get_user_id),
):
    settings = get_settings()
    access_key = settings["unsplash_access_key"]
    if not access_key:
        raise HTTPException(status_code=503, detail="UNSPLASH_ACCESS_KEY no está configurada")

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            "https://api.unsplash.com/photos",
            params={"page": page, "per_page": per_page},
            headers={"Authorization": f"Client-ID {access_key}", "Accept-Version": "v1"},
        )

    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail="No fue posible obtener fotos de Unsplash")

    photos = response.json()
    items = []
    for photo in photos:
        author = photo.get("user") or {}
        urls = photo.get("urls") or {}
        items.append(
            {
                "external_id": photo.get("id"),
                "title": photo.get("alt_description") or photo.get("description") or f"Foto de {author.get('name', 'Unsplash')}",
                "image_url": urls.get("regular"),
                "thumb_url": urls.get("small"),
                "author_name": author.get("name"),
                "author_url": author.get("links", {}).get("html"),
                "width": photo.get("width"),
                "height": photo.get("height"),
                "color": photo.get("color"),
                "source": "unsplash",
            }
        )

    return {"items": items, "source": "unsplash", "page": page, "per_page": per_page, "requested_by": current_user}
