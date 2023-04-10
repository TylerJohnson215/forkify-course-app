import { API_URL } from './config.js';
import { RES_PER_PAGE } from './config.js';
import { getJSON, sendJSON, KEY } from './helpers.js';
import { KEY } from './config.js';

// State contains all the data about the application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
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
    ...(recipe.key && { key: recipe.key }),
  };
};

// This function does not return anything
// Updates state object
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);

    // create new {recipe} and re-format the naming
    state.recipe = createRecipeObject(data);

    // Check that the current recipe has been bookmarked and keeps it set to bookmarked
    // Gives all recipes loaded a bookmark either set to true of false
    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
  } catch (err) {
    console.error(`${err}!`);
    throw err;
  }
};

// This function does not return anything
// It will add search.results to the state object
// Passing through "query" which will be what gets searched
export const loadSearchResults = async function (query) {
  try {
    // Add the query to the state object
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    // Will return new array from object pulling from API url
    // Stored in the state object
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });

    // Resets page when you begin a new search
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}!`);
    throw err;
  }
};

export const getSearchResultsPage = function (pageNumber = state.search.page) {
  state.search.page = pageNumber;

  const start = (pageNumber - 1) * state.search.resultsPerPage; // 0
  const end = pageNumber * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // Update servings of the current recipe
  state.recipe.servings = newServings;
};

// Adds bookmark to localStroage
const persistBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmark.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmark = true;

  persistBookmark();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmark.findIndex(element => element.id === id);
  state.bookmark.splice(index, 1);

  // Mark current recipe as NOT a bookmark
  if (id === state.recipe.id) state.recipe.bookmark = false;

  persistBookmark();
};

// Removes bookmark from localStroage
const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmark = JSON.parse(storage);
};

init();

// This will make an API call to push newRecipe data
export const uploadRecipe = async function (newRecipe) {
  try {
    // Pulls object from user input in submit (newRecipe)
    const ingredients = Object.entries(newRecipe)
      // Checks to make sure that ingredients object is formatted correct and start pulling correct properties
      // Maps properties into a new array
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format.  Please use the correct format.'
          );

        const [quantity, unit, description] = ingArr;

        // Return data for ingredients in an array and replace empty data with 'null'
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Create recipe to format that will match API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);

    // NEED TO FIGURE OUT HOW TO NOT HARD CODE API KEY
    const data = await sendJSON(`${API_URL}?key=1${KEY}`, recipe);

    // Re-formats data sent to API to match data stored in state
    state.recipe = createRecipeObject(data);
    // Adds bookmark to new recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
