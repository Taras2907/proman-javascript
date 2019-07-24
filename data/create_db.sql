DROP TABLE IF EXISTS card;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS board;
DROP TABLE IF EXISTS users;


CREATE TABLE card (
    id       INTEGER PRIMARY KEY NOT NULL,
    board_id INTEGER,
    title    VARCHAR(200)        NOT NULL,
    status_id INTEGER,
    card_order INTEGER NOT NULL
);


CREATE TABLE status (
    id   SERIAL PRIMARY KEY NOT NULL,
    title    VARCHAR(200)        NOT NULL
);


CREATE TABLE board (
    id        INTEGER PRIMARY KEY NOT NULL,
    title    VARCHAR(200)        NOT NULL,
    private BOOLEAN,
    user_id INTEGER
);




CREATE TABLE users (
    id            INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE board_status (
    board_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL
);


ALTER TABLE ONLY board
    ADD CONSTRAINT fk_board_user_id FOREIGN KEY (user_id) REFERENCES users(id);


ALTER TABLE ONLY card
    ADD CONSTRAINT fk_card_board_id FOREIGN KEY (board_id) REFERENCES board(id);


ALTER TABLE ONLY card
    ADD CONSTRAINT fk_card_status_id FOREIGN KEY (status_id) REFERENCES status(id);
