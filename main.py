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
    user_name = session['user_name']
    return sql_queries.get_user_boards('taras')


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board()


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
