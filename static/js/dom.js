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

		callback()
	},

	loadCards: function (callback) {
		// retrieves cards and makes showCards called

		const boards = JSON.parse(localStorage.getItem('boards'));

		for (let index = 0; index < boards.length; index++) {

			dataHandler.getCardsByBoardId(parseInt(boards[index].id), function (boardCards) {

				boards[index].cards = boardCards;

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
                            <div class="card-title">${card.title}</div>
                        </div>
                        `
				} else if (card.status_id === 'in progress') {
					inProgressCardList += `
                        <div class="card" id="${card.id}">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
                        `
				} else if (card.status_id === 'testing') {
					testingCardList += `
                        <div class="card" id="${card.id}">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
                        `
				} else if (card.status_id === 'done') {
					doneCardList += `
                        <div class="card" id="${card.id}">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
                        `
				}
			}
			let columns = '';
			let listOfGroupedCards = [newCardList, inProgressCardList, testingCardList, testingCardList];
			dataHandler.getBoardStatuses(board.id, listOfGroupedCards, function (statuses) {
				for (let status = 0; status < statuses.length; status++) {
					let newCardColumn = `
                <div class="board-column">
                    <div class="board-column-title">
                    <textarea class="mod-list-header" data-statusId="${statuses[status].id}">${statuses[status].title}</textarea></div>
                    <div class="board-column-content">
                        ${listOfGroupedCards[status]}
                    </div>
                </div>
            `;
					columns += newCardColumn;
				}

				let boardElement = document.querySelector(`[data-boardsid='${board.id}']`);
				boardElement.insertAdjacentHTML('beforeend', columns);
				//dom.addEditListenersToStatusHeaders();
			}); // call adn apply


		}

	},

	theDragula: function () { // listOfDivsWithData as an argument //listOfDivsWithData == [document.getDocumentById(right), .....]
		dragula([
			document.getElementById("1"),
			document.getElementById("3"),
			document.getElementById("4")
		], {
			removeOnSpill: true
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

	addBoard: function () {
		let board = {
			boardId: 5,
			title: 'New board',
			loggedUser: 'kornel',
			isPrivate: false,
		};

		dataHandler.createNewBoard(board);

		dom.showNewBoard(board)

	},

	addBoardEventListener: function () {
		document.getElementById('add-board-btn').addEventListener('click', dom.addBoard)
	},

	showNewBoard: function (board) {
		let newBoard = `
			<section class="board" id="board-${board.id}">
				<div class="board-header">
				<span class="board-title">
				<textarea class="mod-list-name" data-boardId="${board.id}">${board.title}</textarea>
				</span>
					<button class="board-add">Add Card</button>
					<button class="board-toggle" 
							type="button" 
							data-toggle="collapse" 
							data-target="#board-${board.id}-columns" 
							aria-expanded="false" 
							aria-controls="board-${board.id}-columns"><i class="fas fa-chevron-down"></i></button>
				</div>
				
				<div class="board-columns collapse" id="board-${board.id}-columns" data-boardsId ="${board.id}">
				
				</div>
			</section>
			`;

		this._appendToElement(document.querySelector('#board-container'), newBoard)
	},

	saveBoardOnLocalStorage: function (boards) {
		return new Promise((resolve, reject) => {
			localStorage.setItem('boards', JSON.stringify(boards))
		})
	},

	haveCards: function hasCards(element, index, array) {
		if (element.cards) {
			return true
		} else {
			return false
		}
	}

	// here comes more features
};
