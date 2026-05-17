from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class PostBase(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    description: Optional[str] = ""
    image_url: HttpUrl
    tags: list[str] = Field(default_factory=list)


class PostCreate(PostBase):
    pass


class PostReplace(PostBase):
    pass


class PostPatch(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=180)
    description: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    tags: Optional[list[str]] = None


class PostOut(BaseModel):
    id: int
    user_id: str
    title: str
    description: str | None
    image_url: str
    tags: list[str]
    created_at: datetime
    updated_at: datetime
    can_edit: bool
