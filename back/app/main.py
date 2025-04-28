from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient
from pydantic import BaseModel
import os


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




class ChatRequest(BaseModel):
    text: str
class ChatResponse(BaseModel):
    text: str

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
if not HF_API_TOKEN:
    raise RuntimeError("Please set the HF_API_TOKEN environment variable")

client = InferenceClient(
    provider="hyperbolic",
    api_key=HF_API_TOKEN,
)

@app.post("/chat/", response_model=ChatResponse)
def chat(request: ChatRequest):
    completion = client.chat.completions.create(
        model="deepseek-ai/DeepSeek-V3-0324",
        messages=[
            {
                "role": "user",
                "content": request.text
            }
        ],
        max_tokens=512,
    )

    return ChatResponse(text=completion.choices[0].message['content'])

@app.post("/posts/{post_id}/like", response_model=schemas.Post)
def like_post_endpoint(
    user_id: int,
    post_id: int,
    db: Session = Depends(get_db),
):
    return crud.like_post(db, user_id, post_id)
