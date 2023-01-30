import os

CONFIG = {
    'HOST': os.getenv('HOST', default='0.0.0.0'),
    'PORT': int(os.getenv('PORT', default=8000))
}

SQL = {
    'unrated': "select g.source_id, g.prompt, g.image_url\
            from {} g\
            where g.source_id not in (select r.source_id from rating r where r.user_id = :username)",\
#     'full':  "select g.source_id, g.prompt, g.image_url\
#             from {} g",\
    'rated': "select gs.source_id, gs.prompt, gs.image_url, r.rating_id, r.rating, r.comment\
            from {} gs\
            left outer join {} r on gs.source_id = r.source_id\
            where r.user_id = \'{}\'",\
    'insert': "insert into {} (source_id, user_id, rating, comment) values ({}, \'{}\', {}, \'{}\')",\
    'update': "update {}\
            set rating = :rating,\
                comment = :comment\
            where rating_id = :rating_id"
}