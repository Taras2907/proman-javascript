// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

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
		dom.addBoardEventListener()
		// This function should run once, when the page is loaded.

	},

	loadBoards: function () {
		// retrieves boards and makes showBoards called

		dataHandler.getBoards(function (boards) {
			localStorage.setItem('boards', JSON.stringify(boards));
			dom.loadCards(function () {
				dom.showBoards(function () {
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
			dom.showNewBoard(board)
		}
        dom.addEventListenersToAddCardButton()
		callback()
	},

	loadCards: function (callback) {
		// retrieves cards and makes showCards called

		const boards = JSON.parse(localStorage.getItem('boards'));

		for (let board of boards) {

			dataHandler.getCardsByBoardId(parseInt(board.id), function (boardCards) {

				board.cards = boardCards;

				if (JSON.parse(JSON.stringify(boards)).every(dom.haveCards)) {
					localStorage.setItem('boards', JSON.stringify(boards));
					callback()

				}

				// if (index === boards.length - 1) {
				// 	//sprawdzić czy kazdy boards[index] posiada .cards wtedy wywolac zapisanie
				// 	console.log(JSON.parse(JSON.stringify(boards)));
				// 	localStorage.setItem('boards', JSON.stringify(boards));
				// 	callback()
					// dom.saveBoardOnLocalStorage(boards).then(callback())
				// }

			});
		}
	},

	showCards: function () {
		// shows the cards of a board
		// it adds necessary event listeners also
		let boards = JSON.parse(localStorage.getItem('boards'));
		dom.addEditListenersToBoardHeaders();
		for (let board of boards) {

			let newCardList = '';
			let inProgressCardList = '';
			let testingCardList = '';
			let doneCardList = '';
			for (let card of board.cards) {

				if (card.status_id === 'new') {
					newCardList += `
                        <div class="card" id="${card.id}">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title"><textarea 
                            class="mod-list-card"
                            spellcheck="false"
                            data-cardId="${card.id}">${card.title}
                            </textarea></div>
                        </div>
                        `
				} else if (card.status_id === 'in progress') {
					inProgressCardList += `
                        <div class="card" id="${card.id}">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title"><textarea 
                            class="mod-list-card"
                            spellcheck="false"
                            data-cardId="${card.id}">${card.title}
                            </textarea></div>
                        </div>
                        `
				} else if (card.status_id === 'testing') {
					testingCardList += `
                        <div class="card" id="${card.id}">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title"><textarea 
                            class="mod-list-card"
                            spellcheck="false"
                            data-cardId="${card.id}">${card.title}
                            </textarea></div>
                        </div>
                        `
				} else if (card.status_id === 'done') {
					doneCardList += `
                        <div class="card" id="${card.id}">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">
                            <textarea 
                            class="mod-list-card"
                            spellcheck="false"
                            data-cardId="${card.id}">${card.title}
                            </textarea>
                            </div>
                        </div>
                        `
				}
			}
			let columns = '';
			let listOfGroupedCards = [newCardList, inProgressCardList, testingCardList, testingCardList];
			dataHandler.getBoardStatuses(board.id, listOfGroupedCards, function (statuses) {
				for (let status =0; status<statuses.length; status++){
                    columns += `
                <div class="board-column">
                    <div class="board-column-title">
                    <textarea 
                    class="mod-list-header"
                    spellcheck="false"
                    data-statusId="${statuses[status].id}">${statuses[status].title}
                    </textarea></div>
                    <div class="board-column-content" id="board${board.id}${statuses[status].id}" data-columnboardid='${board.id}'>
                        ${listOfGroupedCards[status]}
                    </div>
                </div>
            `;
                }

                let boardElement = document.querySelector(`[data-boardsid='${board.id}']`);
                boardElement.insertAdjacentHTML('beforeend',columns);
                dom.addEditListenersToCardHeaders();
            }); // call adn apply
        }
    },
    theDragula: function () {
        dragula([document.getElementById('board30'),
                document.getElementById('board31'),
                document.getElementById('board32'),
                document.getElementById('board33')],{
            removeOnSpill:true
        });
        dragula([document.getElementById('board10'),
                document.getElementById('board11'),
                document.getElementById('board12'),
                document.getElementById('board13')],
            {
            removeOnSpill:true
        });
    },
    addEditListenersToBoardHeaders: function () {
        let allBoardHeaders = document.querySelectorAll("[data-boardid]");
        allBoardHeaders.forEach(function (boardHeader) {
            boardHeader.addEventListener('focusout', function () {
            let newTitle = boardHeader.value;
            let boardId = boardHeader.dataset['boardid'];
            dataHandler.changeBoardTitle(boardId, newTitle)
            })
            })
    },
    addEditListenersToStatusHeaders: function () {
        let allStatusHeaders = document.querySelectorAll("[data-statusid]");
        allStatusHeaders.forEach(function (statusHeader) {
            statusHeader.addEventListener('focusout', function () {
                let newTitle = statusHeader.value;
                let statusId = statusHeader.dataset['statusid'];
                dataHandler.changeStatusTitle(statusId, newTitle)
            })
        })
    },
    addEditListenersToCardHeaders: function () {
        let allCardHeaders = document.querySelectorAll("[data-cardid]");
        allCardHeaders.forEach(function (cardHeader) {
            cardHeader.addEventListener('focusout', function () {
                let newTitle = cardHeader.value;
                let cardId = cardHeader.dataset['cardid'];
                console.log(newTitle, cardId);
                dataHandler.changeCardTitle(newTitle, cardId)
            })
        })
    },
    addEventListenersToAddCardButton: function () {
        let allButtons = document.querySelectorAll('[data-addcard]');
        let cardTitle = 'new';
        let statusId = 0;
        allButtons.forEach(function (button) {
            button.addEventListener("click",function(){
                let boardId = button.dataset['addcard'];
                console.log(cardTitle, boardId, statusId);
                dataHandler.createNewCard(cardTitle, boardId, statusId);
                dom.addCard(boardId);
            })

        })
    },
    addCard:function (boardId) {
        let boardElement = document.querySelector(`[data-columnboardid='${boardId}']`);
        boardElement.insertAdjacentHTML('beforeend',
            `<div class="card">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">new</div>
                        </div>`
            );
    }

    // here comes more features
};
