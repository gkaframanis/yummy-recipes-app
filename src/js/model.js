/* Module where we write our entire model
   We are going to have a big state object which will contain a model
   for recipe, search and bookmarks.
   Data from the API ==> https://forkify-api.herokuapp.com/v2
*/

import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
	recipe: {},
	search: {
		query: "",
		results: [],
		resultsPerPage: RES_PER_PAGE,
		page: 1,
	},
    bookmarks: [],
};

const createRecipeObject = function(data) {
	// Reformating the recipe object we get back as response.
	const { recipe } = data.data;
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		// The && operator short circuits
		// If recipe.key is true, the object {key: recipe.key} is returned and we spread it, so we get key: recipe.key
		// If recipe.key is true, nothing is returned from the spread operator.
		...(recipe.key && {key: recipe.key}),
	};
}

// It changes the recipe.
export const loadRecipe = async function (id) {
	try {
		const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
		state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false;

	} catch (err) {
		// Rethrowing the error to catch it at the controller.
		throw err;
	}
};

export const loadSearchResults = async function (query) {
	try {
		state.search.query = query;

		const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
		state.search.results = data.data.recipes.map(rec => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && {key: rec.key}),
			};
		});
		state.search.page = 1;
	} catch (err) {
		// Rethrowing the error to catch it at the controller.
		throw err;
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;

	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;

	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach(ing => {
		// newQt = oldQt * newServings / oldServings
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
	});

	state.recipe.servings = newServings;
};

// Local Storage : Load bookmarks from local storage and store bookmarks to local storage.
const persistBookmarks = function() {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function(recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark | Setting a new property to this recipe object.
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};


export const deleteBookmark = function(id) {
    
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);
    
    // // Mark current recipe as NOT bookmarked.
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const init = function() {
    const storage = localStorage.getItem("bookmarks");

    if (storage) state.bookmarks = JSON.parse(storage);
};


init();

// To clear the bookmarks during development.
const clearBookmarks = function() {
    localStorage.clear("bookmarks");
};

export const uploadRecipe = async function(newRecipe) {
	// We have to transform the form data so they match the data we get from the API.
	try{
		// Convert the object we get as argument to an Array.
		const ingredients = Object.entries(newRecipe)
			// We get only the Arrays that the first igredient starts with ingredient and it's not empty
			.filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
			// We remove the whitespace and we split the ingredients to quantity, unit and description.
			.map(ing => {
				// ing is an array of 2 elements.
				// const ingArr = ing[1].replaceAll(" ", "").split(",");
				const ingArr = ing[1].split(",").map(el => el.trim());
				// Check the format of the ingredients the user passes to the form.
				if(ingArr.length !== 3) throw new Error("Wrong ingredient format! Please use the correct format :)");

				const [quantity, unit, description] = ingArr;
				// Convert the quantity from a string to a number.
				return {quantity: quantity ? +quantity: null, unit, description};
			});
			
			// The recipe object is what we want to send to the API.
			const recipe = {
				title: newRecipe.title,
				source_url: newRecipe.sourceUrl,
				image_url: newRecipe.image,
				publisher: newRecipe.publisher,
				cooking_time: +newRecipe.cookingTime,
				servings: +newRecipe.servings,
				ingredients,
			};

			const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
			state.recipe = createRecipeObject(data);
			addBookmark(state.recipe);

	} catch (err) {
		// rethrowing the error to catch it to the controller.
		throw err;
	}


}