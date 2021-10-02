import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
	_parentElement = document.querySelector(".pagination");

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", function (e) {
			// Check which button was clicked based on the event (e)
			const btn = e.target.closest(".btn--inline");
			// We get the value of the attribute data-goto we added to the buttons.
			// The value is in string format and we convert to a number.
			const goToPage = +btn.dataset.goto;
			handler(goToPage);
		});
	}

	_generateMarkup() {
		const curPage = this._data.page;
		const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

		// Page 1 and there are other pages
		if (curPage === 1 && numPages > 1) {
			return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
		}

		// Last Page
		if (curPage === numPages && numPages > 1) {
			return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>${curPage - 1}</span>
            </button>
            `;
		}
		// Other Page
		if (curPage < numPages) {
			return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>${curPage - 1}</span>
            </button>

            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
		}
		// Page 1 and NO other pages
		return " ";
	}
}

export default new PaginationView();