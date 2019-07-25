from psycopg2 import sql
import database_common


@database_common.connection_handler
def get_card_order(cursor):
    # generates position for new card
    cursor.execute('''SELECT id, card_order FROM card ORDER BY card_order DESC LIMIT 1''')
    card = cursor.fetchall()
    return card[0]['card_order'] + 1


@database_common.connection_handler
def get_user_id(cursor, user_name):
    cursor.execute('''SELECT id FROM USERS WHERE name = %(user_name)s''',
                         {'user_name': user_name})
    user_id = cursor.fetchall()
    return 'There is no such user' if user_id == [] else user_id[0]['id']


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


@database_common.connection_handler
def change_board_title(cursor, new_title, the_id):
    cursor.execute('''UPDATE BOARD SET title = %(new_title)s WHERE id= %(the_id)s''',
                   {'new_title':new_title, 'the_id':the_id})


@database_common.connection_handler
def change_card_title(cursor, new_title, the_id):
    cursor.execute('''UPDATE card SET title = %(new_title)s WHERE id= %(the_id)s''',
                   {'new_title':new_title, 'the_id':the_id})


@database_common.connection_handler
def create_the_new_board(cursor, title, private, user_name):
    the_id = generate_id('board')
    user_id = get_user_id(user_name)
    cursor.execute('''INSERT INTO board (id, title, private, user_id) 
                                    VALUES (%(the_id)s, %(title)s, %(private)s, %(user_id)s)''',
                   {'the_id':the_id, 'title':title, 'private':private, 'user_id':user_id})


@database_common.connection_handler
def create_the_new_card(cursor, board_id, title, status_id, card_order):
    the_id = generate_id('card')
    cursor.execute('''INSERT INTO CARD (id, board_id, title, status_id, card_order) VALUES 
                                        (%(the_id)s, %(board_id)s, %(title)s, %(status_id)s, %(card_order)s)''',
                   {'the_id':the_id, 'board_id':board_id, 'title':title, 'status_id':status_id, 'card_order':card_order})


@database_common.connection_handler
def get_user_boards(cursor, user_name):
    id_user = get_user_id(user_name)
    cursor.execute('''SELECT * FROM board WHERE user_id = %(id_user)s''',
                   {'id_user': id_user})
    user_boards = cursor.fetchall()
    return 'You dont have any boards' if user_boards ==[] else user_boards


@database_common.connection_handler
def get_boards(cursor):
    cursor.execute('''SELECT * FROM board WHERE private = False''')
    boards = cursor.fetchall()
    return 'You dont have any boards' if boards ==[] else boards


@database_common.connection_handler
def get_board_cards(cursor, id_board):
    cursor.execute('''SELECT c.id, board_id, c.title, card_order, s.title as status_id FROM card AS c
    JOIN status AS s ON status_id = s.id
    WHERE board_id = %(id_board)s''',
                   {'id_board': id_board})
    board_cards = cursor.fetchall()
    return 'This board doesnt have any cards' if board_cards ==[] else board_cards


@database_common.connection_handler
def get_the_board(cursor, id_board):
    cursor.execute('''SELECT * FROM board WHERE id = %(id_board)s''',
                   {'id_board': id_board})
    the_board = cursor.fetchall()
    return 'There is no such board' if the_board == [] else the_board


@database_common.connection_handler
def get_the_statuses(cursor):
    cursor.execute('''SELECT * FROM status''')
    the_statuses = cursor.fetchall()
    return 'There is no statuses yet' if the_statuses == [] else the_statuses


@database_common.connection_handler
def get_the_board_statuses(cursor, board_id):
    cursor.execute('''SELECT * FROM status ''')
    the_statuses = cursor.fetchall()
    return 'There is no statuses yet' if the_statuses == [] else the_statuses


@database_common.connection_handler
def get_the_status(cursor, id_status):
    cursor.execute('''SELECT * FROM status WHERE id = %(id_status)s''',
                   {'id_status': id_status})
    the_status = cursor.fetchall()
    return 'There is no such status' if the_status == [] else the_status


@database_common.connection_handler
def get_the_card(cursor, id_card):
    cursor.execute('''SELECT * FROM card INNER JOIN status ON card.status_id = status.id WHERE card.id = %(id_card)s''',
                   {'id_card': id_card})
    the_card = cursor.fetchall()
    return 'There is no such status' if the_card == [] else the_card


@database_common.connection_handler
def update_card_status(cursor, id_board, card_id, new_status_id):
    cursor.execute('''UPDATE card SET status_id = %(new_status_id)s 
    WHERE board_id = %(id_board)s AND id = %(card_id)s''',
                   {'new_status_id':new_status_id, 'id_board':id_board, 'card_id':card_id})


@database_common.connection_handler
def update_card_position(cursor, id_board, card_id, new_order):
    cursor.execute('''UPDATE card SET card_order = %(new_order)s 
    WHERE board_id = %(id_board)s AND id = %(card_id)s''',
        {'new_order': new_order, 'id_board': id_board, 'card_id': card_id})


@database_common.connection_handler
def change_the_title_of_status(cursor, status_id, new_title):
    cursor.execute('''UPDATE status SET title = %(new_title)s WHERE id = %(status_id)s''',
                   {'new_title':new_title, 'status_id':status_id})


@database_common.connection_handler
def change_the_title_of_board(cursor, board_id, new_title):
    cursor.execute('''UPDATE board SET title = %(new_title)s WHERE id = %(board_id)s''',
                   {'new_title':new_title, 'board_id':board_id})

