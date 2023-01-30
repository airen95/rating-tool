import json
from omegaconf import OmegaConf

from .db_utils import *
from .utils import *
from .constmap import *

config = OmegaConf.load('./config/config.yaml')
auth = json.load(open(config.auth_path, 'r'))
engine = db_engine(auth)
users = load_txt(config.usernames)
print(users)


def is_user_exists(username: str) -> bool:
    if username in users:
        return True
    # write_txt(config.usernames, username)
    return False


def get_unrated_lst(username: str) -> list[tuple[int, str]]:
    lst = []
    query = SQL['unrated'].format(config.source_db)
    res = execute_query_database(engine, query, username = username)
    for i in res:
        sample = {
            'source_id': i[0],
            'promt': i[1],
            'url': i[2]
        }
        lst.append(sample)
    return lst

def get_rated_lst(username: str) -> list[tuple[int, str]]:
    lst = []
    if not is_user_exists(username):
        return lst

    query = SQL['rated'].format(config.source_db, config.rating_db, username)
    res = execute_query_database(engine, query)
    for i in res:
        sample = {
            'source_id': i[0],
            'promt': i[1],
            'url': i[2],
            'rating_id': i[3],
            'rating': i[4],
            'comment': i[5]
        }
        lst.append(sample)
    return lst

def insert_rating(username: str, source_id: int, rating: int, comment: str) -> dict[tuple[str,str]]:
    query = SQL['insert'].format(config.rating_db, source_id, username, rating, comment)
    execute_query_commit(engine, query)
    write_txt(config.usernames, username)
    return {
        "message": "Insert successfully"
    }

def update_rating(rating_id: int, rating: int, comment: str) -> dict[tuple[str,str]]:
    query = SQL['update'].format(config.rating_db)
    print(query)
    execute_query_commit(engine, query, rating = rating, comment = comment, rating_id = rating_id)
    return {
        "message": "Update successfully"
    }
