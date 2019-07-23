from psycopg2 import sql
import database_common


@database_common.connection_handler
def get_users_password(cursor, user_name):
    cursor.execute('''SELECT password FROM USERS WHERE name = %(user_name)s''',
                         {'user_name': user_name})
    hashed_user_password = cursor.fetchall()
    return 'User doesnt exist'if hashed_user_password == [] else hashed_user_password[0]['password']


@database_common.connection_handler
def user_is_in_database(cursor, user_name):
    cursor.execute('''SELECT password FROM USERS WHERE name = %(user_name)s''',
                   {'user_name': user_name})
    user = cursor.fetchall()
    return False if user == [] else True


@database_common.connection_handler
def generate_id(cursor, database_table):
    sql_select = sql.SQL("SELECT MAX(id) FROM {}").format(
        sql.Identifier(database_table)
    )
    cursor.execute(sql_select)
    new_id = cursor.fetchall()
    return 1 if new_id[0]['max'] is None else new_id[0]['max'] + 1 # example [{'max': None}]


@database_common.connection_handler
def write_user_name_password_to_database(cursor, username, hashed_password):
    user_id = generate_id('users')
    cursor.execute('''INSERT INTO USERS (id, name, password) VALUES (%(user_id)s, %(username)s, %(hashed_password)s)''',
                   {'user_id':user_id, 'username':username, 'hashed_password': hashed_password})
