# src/schemas.py
from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime

class LoginOrRegisterRequest(BaseModel):
    username: str
    password: str

class UserPreview(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str

class PostBase(BaseModel):
    content: str

class PostCreate(PostBase):
    pass

class Post(PostBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    author_id: int
    likes: int
    author: UserPreview

class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    password: str
    posts: List[Post] = []

# Resolve forward references
User.update_forward_refs()