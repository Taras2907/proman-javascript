from psycopg2 import sql
import database_common


@database_common.connection_handler
def get_users_password(cursor, user_name):
    cursor.execute('''SELECT password FROM USERS WHERE username = %(user_name)s''',
                         {'user_name': user_name})
    hashed_user_password = cursor.fetchall()
    return 'User doesnt exist'if hashed_user_password == [] else hashed_user_password['password']


@database_common.connection_handler
def user_is_in_database(cursor, user_name):
    cursor.execute('''SELECT password FROM USERS WHERE username = %(user_name)s''',
                   {'user_name': user_name})
    user = cursor.fetchall()
    return True if user != [] else False


@database_common.connection_handler
def write_user_name_password_to_database(cursor, username, hashed_password):
    user_id = generate_id('users')
    cursor.execute('''INSERT INTO USERS (id, username, password) VALUES (%(user_id)s, %(username)s, %(hashed_password)s)''',
                   {'user_id':user_id, 'usernam':username, 'hashed_password': hashed_password})


@database_common.connection_handler
def generate_id(cursor, database_table):
    sql_select = sql.SQL("SELECT MAX(id) FROM {}").format(
        sql.Identifier(database_table)
    )
    cursor.execute(sql_select)
    new_id = cursor.fetchall()
    return 'The table is emty there is no rows yet' if new_id == [] else new_id['id']
