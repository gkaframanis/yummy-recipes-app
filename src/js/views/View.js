import icons from "url:../../img/icons.svg";

export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM. 
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} View instance
     * @author Gregory Kaframanis
     * @todo Finish implementation 
     */
	render(data, render=true) {
		// If there isn't any data or if the data is an array with 0 length.
		if (!data || (Array.isArray(data) && data.length === 0))
		  return this.renderError();
	
		this._data = data;
		const markup = this._generateMarkup();
	
		if (!render) return markup;
	
		this._clear();
		// Where to attach our html markup
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	  }

    update(data) {        
        this._data = data;
        // We will generate the markup without rendering it and compare the new HTML to the current HTML,
        // and then only change text and attributes that have changed from the old version to the new one.
         const newMarkup = this._generateMarkup();

         // Convert the markup string to the a DOM element that lives in the memory and compare with the one in the page.
         // Basically a virtual DOM that we can now use.
         // Convert the node list to array using the Array.from() method.
         const newDOM = document.createRange().createContextualFragment(newMarkup);
         const newElements = Array.from(newDOM.querySelectorAll("*"));
         // The elements that we have at the current DOM.
         const curElements = Array.from(this._parentElement.querySelectorAll("*"));

         newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // Comparing the two elements for each DOM.
            // We need to check if the node contains only text, and that's the one we want to update and change.
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
                curEl.textContent = newEl.textContent;
            }
            // We also want to update the changed attrubutes.
            if(!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
         });
    }

    _clear() {
        this._parentElement.innerHTML = "";
    }

    renderSpinner() {
        const markup = `
          <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };

    renderError(message=this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
    
    renderMessage(message=this._message) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
};