from pydantic import BaseModel

class RateSchema(BaseModel):
    source_id: int
    username: str
    rating: int
    comment: str


class UpdateSchema(BaseModel):
    rating_id: int
    rating: int
    comment: str
