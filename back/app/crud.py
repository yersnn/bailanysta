from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import joinedload

def register(db: Session, user: schemas.LoginOrRegisterRequest):
    print(user)
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

def login(db: Session, user: schemas.LoginOrRegisterRequest):
    try:
        db_user = (
            db
            .query(models.User)
            .filter(models.User.username == user.username)
            .first()
        )
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return db_user



def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session):
    return db.query(models.User).all()

def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Post)
          .options(joinedload(models.Post.author))
          .offset(skip)
          .limit(limit)
          .all()
    )

def create_post(db: Session, post: schemas.PostCreate, user_id: int):
    db_post = models.Post(**post.model_dump(), author_id=user_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post