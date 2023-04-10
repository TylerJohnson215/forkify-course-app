import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // Locate recipe from ID
    const id = window.location.hash.slice(1);

    // Guard clause
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. Loading recipe by calling function from model folder
    // Need to run loadRecipe to update {state} ... which holds info needed to create recipe on web page
    await model.loadRecipe(id);

    // 2. Rendering recipe
    // Pass data from model.loadRecipe(id) through recipeView function imoorted from recipeView file
    // render method stores data inside of this.data in recipeView file
    recipeView.render(model.state.recipe);

    // Update bookmark list to mark show that current recipe is bookmarked
    bookmarkView.update(model.state.bookmark);

    // Redndering error from recipeView file
    // If model.js file pulls error (loadRecipe) and cannot find ID, error message displayed to user
    // No argument here, set to default in the recipeView file
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Get search query
    // Sets query to items being searched from DOM
    const query = searchView.getQuery();

    // guard clause
    if (!query) return;

    // Pass query through the search from API
    // Load search results
    await model.loadSearchResults(query);

    // Render returned reults from search
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage(1));

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

controlRecipes();
controlSearchResults();

// controlPagnation function passes handler through to direct which page to turn to in search results buttons
// pagnationView.addHandlerClick.goToPage holds directions for changing the page
const controlPagination = function (goToPage) {
  // Render new reults from search
  // goToPage gets set as current page after the button gets clicked
  // goToPage updates pageNumber in the getSearchResultsPage function
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new Pagination buttons
  // Updated pageNumber allows to render new buttons since you're now on a new page of results
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// Adds a bookmark to a recipe in recipe view
// Sets model.state.recipe.bookmark to true
const controlAddBookmark = function () {
  // Sets model.state.recipe.bookmark to false before the bookmark button is clicked
  if (!model.state.recipe.bookmark) {
    model.addBookmark(model.state.recipe);
  }
  // Sets model.state.recipe.bookmark to true once bookmark is clicked
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // Fills in icon once recipe is bookmarked
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmark);
};

// Loads bookmarks into page
const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show user loading spinner
    addRecipeView.renderSpinner();
    // Upload newRecipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderSuccess();

    // Render the bookmark view
    bookmarkView.render(model.state.bookmark);

    // Update ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// init initializes the controlRecipes and controlSearchResults function to load page data

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  // controlServings will fire once buttons are clicked to update servings and render new recipe amounts
  recipeView.addHandlerUpdateServings(controlServings);
  // controlAddBookmark will sets bookmark to true in recipe array after button is clicked
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  // initializes controlPagnation button changes search results pages up or down pending which button pressed
  paginationView.addHandlerClick(controlPagination);
  // controlAddRecipe will upload data from submit on webpage
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
