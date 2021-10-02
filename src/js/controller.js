// The controller acts like a bridge between the models and the views

// Import everything from the model
import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
// Importing instances of views
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

// For older browsers support | Polyfilling everything
import "core-js/stable";
// For older browsers support | Polyfilling async - await
import "regenerator-runtime/runtime";

// This comes from parcel.
if (module.hot) {
	module.hot.accept();
}

// Making an API request
const controlRecipes = async () => {
	try {
		// Getting the hash | location is the entire url
		const id = window.location.hash.slice(1); // id plus the # symbol, so we need to remove it using slice.

		// Guard clause in case there is not a hash in the url.
		if (!id) return;

		// Adding the spinner
		recipeView.renderSpinner();

		// 0) Update results view to mark selected search result.
		resultsView.update(model.getSearchResultsPage());

		// 1) Updating Bookmarks View
	
        bookmarksView.update(model.state.bookmarks);
		
		// 2) Loading the Recipe
		await model.loadRecipe(id);
		
		// 3) Rendering the recipe
		recipeView.render(model.state.recipe);

	} catch (err) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();
		// 1) Getting the user's search query.
		const query = searchView.getQuery();
		if (!query) return;

		// 2) Load search results
		// We only manipulate the state
		await model.loadSearchResults(query);

		// 3) Render the results.
		// For all the results
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		// 4) Render initial pagination buttons
		paginationView.render(model.state.search);
	} catch (err) {
		resultsView.renderError();
	}
};

// The controller that is executed when one of the pagination buttons is clicked.
const controlPagination = function (goToPage) {
	// 1) Render NEW Results
	resultsView.render(model.getSearchResultsPage(goToPage));

	// 2) Render the NEW pagination buttons
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	// Update the recipe servings (in state)
	model.updateServings(newServings);

	// Update the recipeView
	// We will change only text and attributes in the DOM, without having to rerender the entire view.
	recipeView.update(model.state.recipe);
};

const controlBookmark = function() {
    // Add or remove a bookmark
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    // Update recipeView
    recipeView.update(model.state.recipe);

    // Render the bookmarks
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
	try {
		// Show loading spinner
		addRecipeView.renderSpinner();

		// Upload the new recipe data | the model.uploadRecipe returns a promise.
		await model.uploadRecipe(newRecipe);

		// Render recipe
		recipeView.render(model.state.recipe);

		// Success Messsage
		addRecipeView.renderMessage();

		// Render the bookmark view
		bookmarksView.render(model.state.bookmarks);

		// Change ID in Url
		// pushState takes state, title and the url as arguments.
		window.history.pushState(null, "", `${model.state.recipe.id}`);

		// Close form window
		setTimeout(function() {
			addRecipeView.toggleWindow()
		}, MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		addRecipeView.renderError(err.message);
	}
}

const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerBookmark(controlBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
