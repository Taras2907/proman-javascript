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
        // This function should run once, when the page is loaded.

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            console.log(boards);
            localStorage.setItem('boards', JSON.stringify(boards));
            dom.loadCards()
            // dom.showBoards(boards);
            // for (let board of boards){
            //     dom.loadCards(board.id)
            // }
        });

    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `
                <section class="board" id="board-${board.id}">
                    <div class="board-header"><span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                    </div>
                </section>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        this._appendToElement(document.querySelector('#boards'), outerHtml);
    },
    loadCards: function () {
        // retrieves cards and makes showCards called

        //PYTANIE
        //dlaczego JSON.stringify zwraca nam pusty slownik jak mamy razem wszystko


        const boards = JSON.parse(localStorage.getItem('boards'));

        let cards = new Array();

        for (let index=0; index<boards.length; index++) {

            dataHandler.getCardsByBoardId(parseInt(boards[index].id), function(boardCards) {
                boards[index].cards = boardCards;

                if (index === boards.length-1) {
                    localStorage.setItem('boards', JSON.stringify(boards))
                }

            });
    //        dlaczego console.log(JSON.stringify(cards)) nie dziala tutaj - zwraca pusty array

    }},
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also

        let newCards = '';
        let inProgressCards = '';
        let testingCards = '';
        let doneCards = '';

        for (let card of cards) {
            if (card.status_id === 0) {
                newCards += `
                    <div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">${card.title}</div>
                    </div>
                `;
            }
        }

        const outerHtml = `
            <div class="board-columns">
                <div class="board-column">
                    <div class="board-column-title">New</div>
                    <div class="board-column-content">
                        ${newCards}
                    </div>
                </div>    
            </div>    
        `;

        return outerHtml
        // let newCardsColumn = `
        //     <div class="board-column">
        //         <div class="board-column-title">New</div>
        //         <div class="board-column-content">
        //             ${newCards}
        //         </div>
        //     </div>
        // `;

        // const boardColumns = `
        //     <div class="board-columns">
        //         ${newCardsColumn}
        //     </div>
        // `;
        //
    },
    theDragula: function () { // listOfDivsWithData as an argument //listOfDivsWithData == [document.getDocumentById(right), .....]
        dragula([
            document.getElementById("left"),
            document.getElementById("right"),
            document.getElementById("middle")
        ], {
            removeOnSpill: true
        });
    }
    // here comes more features
};
