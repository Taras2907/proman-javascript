from flask import Flask, render_template, url_for,request, session, redirect
from util import json_response
from password_hash_verify import *
import sql_queries

import data_handler

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    return sql_queries.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return sql_queries.get_board_cards(board_id)


@app.route("/get-board/<int:board_id>'")
@json_response
def get_board(board_id):
    return sql_queries.get_the_board(board_id)


@app.route("/get-statuses")
@json_response
def get_statuses():
    return sql_queries.get_the_statuses()


@app.route("/get-status<int:id_status>")
@json_response
def get_status(id_status):
    return sql_queries.get_the_status(id_status)


@app.route("/get-card<int:id_card>")
@json_response
def get_the_card(id_card):
    return sql_queries.get_the_card(id_card)


@app.route("/create-new-board/<board_title>")
@json_response
def create_new_bord(board_title):
    return sql_queries.create_the_new_board(board_title)


@app.route("/create-new-card/<card_title>/<board_id>/<status_id>")
@json_response
def create_new_card(card_title, board_id, status_id):
    card_position = sql_queries.get_card_order()
    return sql_queries.create_the_new_card(board_id, card_title, status_id, card_position)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form['user_name']
        user_password = sql_queries.get_users_password(username)
        plain_password = request.form['password']
        if verify_password(plain_password, user_password):
            session['user_name']= username
            session['password'] = hash_password(request.form['password'])
            session['logged_in'] = True
            user_logged_in = True
            return render_template('index.html', user_logged_in=user_logged_in, username=username)
        else:
            incorrect_password_or_login = 'Incorrect password or login'
            return render_template('login.html', incorrect_password_or_login=incorrect_password_or_login)
    return render_template('login.html')


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route('/registration', methods=['GET', 'POST'])
def registration():
    if request.method == "POST":
        user_name = request.form['user_name']
        is_in_database = sql_queries.user_is_in_database(user_name)
        hashed_password = hash_password(request.form['password'])
        if is_in_database:
            user_name_already_exists = 'user_name_exists'
            return render_template('registration.html', user_name_already_exists=user_name_already_exists)
        else:
            sql_queries.write_user_name_password_to_database(user_name, hashed_password)
            return render_template('login.html')
    return render_template('registration.html')


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
