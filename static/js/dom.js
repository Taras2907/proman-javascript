// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    init: function () {
        localStorage.clear()
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            localStorage.setItem('boards', JSON.stringify(boards));
            dom.loadCards(function(){
                dom.showBoards(function(){
                    dom.showCards()
                });
            });
        });

    },
    showBoards: function (callback) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boards = JSON.parse(localStorage.getItem('boards'));

        for (let board of boards) {
            let newBoard = `
                <section class="board" id="board-${board.id}">
                    <div class="board-header"><span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle" 
                                type="button" 
                                data-toggle="collapse" 
                                data-target="#board-${board.id}-columns" 
                                aria-expanded="false" 
                                aria-controls="board-${board.id}-columns"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    
                    <div class="board-columns collapse" id="board-${board.id}-columns">
                    
                    </div>
                </section>
                `;

                this._appendToElement(document.querySelector('#board-container'), newBoard)
        }

        callback()
    },
    loadCards: function (callback) {
        // retrieves cards and makes showCards called

        const boards = JSON.parse(localStorage.getItem('boards'));

        for (let index=0; index<boards.length; index++) {

            dataHandler.getCardsByBoardId(parseInt(boards[index].id), function(boardCards) {
                boards[index].cards = boardCards;

                if (index === boards.length-1) {
                    localStorage.setItem('boards', JSON.stringify(boards));
                    callback()
                }

            });
        //        dlaczego console.log(JSON.stringify(cards)) nie dziala tutaj - zwraca pusty array

        }
    },
    showCards: function () {
        // shows the cards of a board
        // it adds necessary event listeners also
        let boards = JSON.parse(localStorage.getItem('boards'));



        for (let board of boards) {

            let newCardList = '';
            let inProgressCardList = '';
            let testingCardList = '';
            let doneCardList = '';

            for(let card of board.cards) {
                if (card.status_id === 'new') {
                    newCardList += `
                        <div class="card">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
                        `
                } else if (card.status_id === 'in progress') {
                    inProgressCardList += `
                        <div class="card">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
                        `
                } else if (card.status_id === 'testing') {
                    testingCardList += `
                        <div class="card">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
                        `
                }   else if (card.status_id === 'done') {
                    doneCardList += `
                        <div class="card">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
                        `
                }
            }


            let newCardColumn = `
                <div class="board-column">
                    <div class="board-column-title">New</div>
                    <div class="board-column-content">
                        ${newCardList}
                    </div>
                </div>
            `;

            let inProgressCardColumn = `
                <div class="board-column">
                    <div class="board-column-title">In progress</div>
                    <div class="board-column-content">
                        ${inProgressCardList}
                    </div>
                </div>
            `;

            let testingCardColumn = `
                <div class="board-column">
                    <div class="board-column-title">Testing</div>
                    <div class="board-column-content">
                        ${testingCardList}
                    </div>
                </div>
            `;

            let doneCardColumn = `
                <div class="board-column">
                    <div class="board-column-title">Done</div>
                    <div class="board-column-content">
                        ${doneCardList}
                    </div>
                </div>
            `;
            let columns = newCardColumn + inProgressCardColumn + testingCardColumn + doneCardColumn;

            this._appendToElement(document.querySelector(`#board-${board.id} > .board-columns`), columns)
        }

    },
    // here comes more features
};
