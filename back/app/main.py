from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.User)
def register(user: schemas.LoginOrRegisterRequest, db: Session = Depends(get_db)):
    return crud.register(db, user)

@app.post("/login", response_model=schemas.User)
def login(req: schemas.LoginOrRegisterRequest, db: Session = Depends(get_db)):
    return crud.login(db, req)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    u = crud.get_user(db, user_id)
    if not u:
        raise HTTPException(404, detail="User not found")
    return u

@app.post("/users/{user_id}/posts/", response_model=schemas.Post)
def create_user_post(user_id: int, post: schemas.PostCreate, db: Session = Depends(get_db)):
    return crud.create_post(db, post, user_id)

@app.get("/posts/", response_model=list[schemas.Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_posts(db, skip, limit)

client = OpenAI(api_key="your api key here")
class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat/")
async def chat_with_gpt(request: ChatRequest):
    return {"reply": "This is a placeholder response."}
    # Replace with your actual OpenAI API call
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": request.prompt}
        ]
    )
    reply = response.choices[0].message.content
    return {"reply": reply}

