from typing import List, Tuple, Any
import pickle

from sqlalchemy.sql import text
from sqlalchemy.engine import Engine
from sqlalchemy import create_engine


def db_engine(auth: dict) -> Engine:
    """
    Create sql engine connect to database

    Returns:
        Engine
    """
    username, password, host, port, dbname = auth['username'], auth['password'], auth['host'], auth['port'], auth['dbname']
    connection_string = f"postgresql://{username}:{password}@{host}:{port}/{dbname}"
    engine = create_engine(connection_string, echo = True)
    return engine


def execute_query_database(engine, query: str, **kwargs) -> List[Tuple[Any]]:
    """
    Query database

    Args:
        query (str): query sentence.
        port (int, optional): tunnel connection port. Defaults to 6677.

    Returns:
        List: queried data
    """

    query = text(query)
    res = engine.execute(query, **kwargs).fetchall()
    engine.dispose()

    return [tuple(i) for i in res]

def execute_query_commit(db_engine, raw_query: str, **kwargs) -> None:
    try:
        raw_query = text(raw_query)
        with db_engine.begin() as conn:
            conn.execute(raw_query, **kwargs)
    except Exception as e:
        print('commit fail')
        return False

