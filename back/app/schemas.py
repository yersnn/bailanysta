from pydantic import BaseModel, ConfigDict
from typing  import List
from datetime import datetime

class LoginOrRegisterRequest(BaseModel):
    username: str
    password: str

class PostBase(BaseModel):
    content: str

class PostCreate(PostBase):
    pass

# A lightweight user schema for nesting inside Post
class UserPreview(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    password: str      # still exposing password if you really want

class Post(PostBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    author: UserPreview  # use the preview here, no posts field

class UserBase(BaseModel):
    username: str

class User(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    password: str
    posts: List[Post] = []   # full posts, each with a preview author

class ChatRequest(BaseModel):
    model: str = "gpt-3.5-turbo"  # Or "gpt-4"
    messages: list[dict]
    temperature: float = 0.7
    max_tokens: int = 200