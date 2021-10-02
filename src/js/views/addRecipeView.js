import View from "./View.js";

class AddRecipeView extends View {
	_parentElement = document.querySelector(".upload");
    _message = "Recipe was successfully uploaded 😎";

    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle("hidden");
        this._window.classList.toggle("hidden");
    }

    // The controller doesn't need to interfere here
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener("click", () => this.toggleWindow());
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener("click", () => this.toggleWindow());
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", function(e) {
            e.preventDefault();
            // this points to the parentElement | We get an array of Arrays where the 
            // first element of each Array is the field and the second is its value.
            const dataArr = [...new FormData(this)];
            // Convert our dataArr to an object
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }

	_generateMarkup() {
		
	}
}

export default new AddRecipeView();