const searchInput = document.getElementById("searchInput");
const suggestionsDiv = document.getElementById("suggestions");
const searchBtn = document.getElementById("search-btn");
const searchResultsDiv = document.getElementById("search-results");
const mealDetailsDiv = document.getElementById("meal-details");

// Function to fetch meal suggestions from the API
async function fetchMealSuggestions(searchTerm) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
  );
  const data = await response.json();
  return data.meals;
}


// fetch favorites from local storage
const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites"));
};

// store favorites in local storage
const setFavorites = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

let favorites = getFavorites() == null ? [] : getFavorites();
// Function to update suggestions on the frontend
async function updateSuggestions() {
  const searchTerm = searchInput.value;
  if (searchTerm.trim() === "") {
    suggestionsDiv.innerHTML = "";
    return;
  }

  const meals = await fetchMealSuggestions(searchTerm);
  if (meals) {
    const suggestionsHTML = meals
      .map((meal) => `<p data-meal-id="${meal.idMeal}">${meal.strMeal}</p>`)
      .join("");
    suggestionsDiv.innerHTML = suggestionsHTML;
  } else {
    suggestionsDiv.innerHTML = "<p>No suggestions found.</p>";
  }
}

const editFavorites = (id) => {
  if (favorites.includes(id)) {
    const newFav = favorites.filter((item) => {
      return item != id;
    });
    favorites = newFav;
    setFavorites(favorites);
    alert("Removed from favorites.");
  } else {
    favorites.push(id);
    setFavorites(favorites);
    alert("Added to favorites.");
  }
};

// Function to fetch meal details by ID
async function fetchMealDetails(mealId) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const data = await response.json();
  return data.meals[0];
}

// Function to handle click on meal suggestion and open details page
async function handleMealClick(event) {
  const mealId = event.target.getAttribute("data-meal-id");
  if (mealId) {
    const mealDetails = await fetchMealDetails(mealId);
    if (mealDetails) {
      localStorage.setItem("selectedMeal", JSON.stringify(mealDetails));
      window.location.href = "meal.html";
    }
  }
}

async function detailsButtonHandler(mealId) {
  if (mealId) {
    const mealDetails = await fetchMealDetails(mealId);
    if (mealDetails) {
      localStorage.setItem("selectedMeal", JSON.stringify(mealDetails));
      window.location.href = "meal.html";
    }
  }
}

// function to get all results from search input

async function getSearchResults() {
  const searchTerm = searchInput.value;
  const meals = await fetchMealSuggestions(searchTerm);
  searchInput.value = "";
  suggestionsDiv.innerHTML = "";

  if (meals) {
    searchResultsDiv.innerHTML = ``;
    for (meal of meals) {
      let btnName = favorites.includes(parseInt(meal.idMeal))
        ? "Remove from Favorites"
        : "Add to Favorites";

      searchResultsDiv.innerHTML += `<div id="${meal.idMeal}" class="card col-md-3 p-3 m-3" style="width: 14rem;">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.idMeal}">
            <div class="card-body">
              <h5 class="card-title">${meal.strMeal}</h5>
              <button onClick="detailsButtonHandler(${meal.idMeal})" class="btn btn-sm btn-primary mb-2">See Details</button>
              <button onClick="editFavorites(${meal.idMeal})" class="btn btn-sm btn-primary">${btnName}</button>
            </div>
        </div>`;
    }
  } else {
    searchResultsDiv.innerHTML = "<p>No suggestions found.</p>";
  }
}

searchBtn.addEventListener("click", getSearchResults);

// Add event listener to searchInput for live updates
searchInput.addEventListener("input", updateSuggestions);

suggestionsDiv.addEventListener("click", handleMealClick);
