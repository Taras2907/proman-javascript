import { dom } from "./dom.js";

// This function is to initialize the application
function init() {
    dom.theDragula();
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();

}

init();
