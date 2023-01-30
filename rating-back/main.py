from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.utils.app_schema import *
from src.utils.rating import *
app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/rating_ui/{username}")
async def list_to_rate(username):
    res = get_unrated_lst(username = username)
    return { "data": res, "pagination": { "page": 1, "limit": 1000 } }

@app.get("/rated_ui/{username}")
async def list_to_rate(username):
    res = get_rated_lst(username)
    return { "data": res, "pagination": { "page": 1, "limit": 1000 } }

@app.post("/saving_ui/")
async def save_ui(body: RateSchema):
    username = body.username
    source_id = body.source_id
    rating = body.rating
    comment = body.comment
    # print(username, source_id, rating, comment)
    res = insert_rating(username, source_id, rating, comment)
    return res

@app.put("/updating_ui/")
async def update_ui(body: UpdateSchema):
    rating_id = body.rating_id
    rating = body.rating
    comment = body.comment
    res = update_rating(rating_id, rating, comment)
    return res