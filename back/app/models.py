# src/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id       = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)

    posts       = relationship("Post", back_populates="author")
    liked_posts = relationship("PostLike", back_populates="user")

class Post(Base):
    __tablename__ = "posts"
    id         = Column(Integer, primary_key=True, index=True)
    author_id  = Column(Integer, ForeignKey("users.id"), nullable=False)
    content    = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    likes      = Column(Integer, default=0)

    author = relationship("User", back_populates="posts")
    likers = relationship("PostLike", back_populates="post")

class PostLike(Base):
    __tablename__ = "post_likes"
    id       = Column(Integer, primary_key=True, index=True)
    user_id  = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id  = Column(Integer, ForeignKey("posts.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='uq_user_post'),
    )

    user = relationship("User", back_populates="liked_posts")
    post = relationship("Post", back_populates="likers")
