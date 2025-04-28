from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from . import models, schemas
from typing import cast


def register(db: Session, user: schemas.LoginOrRegisterRequest) -> models.User:
    try:
        db_user = models.User(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username already taken")
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")


def login(db: Session, user: schemas.LoginOrRegisterRequest) -> models.User:
    try:
        db_user = (
            db.query(models.User)
              .filter(models.User.username == user.username)
              .first()
        )
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return db_user


def get_user_by_username(db: Session, username: str) -> models.User | None:
    return db.query(models.User).filter(models.User.username == username).first()


def get_user(db: Session, user_id: int) -> models.User | None:
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(db: Session) -> list[models.User]:
    return db.query(models.User).all()


def get_posts(db: Session, skip: int = 0, limit: int = 100) -> list[models.Post]:
    return (
        db.query(models.Post)
          .options(joinedload(models.Post.author))
          .offset(skip)
          .limit(limit)
          .all()
    )


def create_post(db: Session, post: schemas.PostCreate, user_id: int) -> models.Post:
    db_post = models.Post(**post.model_dump(), author_id=user_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def like_post(db: Session, user_id: int, post_id: int) -> models.Post:
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing = (
        db.query(models.PostLike)
          .filter(
              models.PostLike.user_id == user_id,
              models.PostLike.post_id == post_id
          )
          .first()
    )
    if existing:
        return post

    # record the like
    like = models.PostLike(user_id=user_id, post_id=post_id)
    current_likes = cast(int, post.likes)
    post.likes = current_likes + 1  # type: ignore
    try:
        db.add(like)
        db.commit()
        db.refresh(post)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not register like")

    return post
