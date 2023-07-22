const favDiv = document.getElementById('favorites');

console.log('here it is')
// fetch favorites from local storage 
const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites'));
}

// store favorites in local storage
const setFavorites = (favorites) => {
   localStorage.setItem('favorites', JSON.stringify(favorites));
}

let favorites = getFavorites() == null ? [] : getFavorites();

console.log(favorites);

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
    window.location.href = 'fav.html';
  
};

// Function to fetch meal details by ID
async function fetchMealDetails(mealId) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    return data.meals[0];
}

async function detailsButtonHandler(mealId) {
    if (mealId) {
      const mealDetails = await fetchMealDetails(mealId);
      if (mealDetails) {
        localStorage.setItem('selectedMeal', JSON.stringify(mealDetails));
        window.location.href = 'meal.html';
      }
    }
}

const getFavoritesMeals = async () =>{
  let favoriteMeals = [];
  for(id of favorites){
    let meal = await fetchMealDetails(id);
    favoriteMeals.push(meal);
  }
  return favoriteMeals;
}

async function renderFavorites() {
    if (favorites) {
        favDiv.innerHTML = ``;
      let favMeals = await getFavoritesMeals();
      for (meal of favMeals) {
        let btnName = favorites.includes(meal.idMeal)
          ? "Remove from Favorites"
          : "Add to Favorites";
  
          favDiv.innerHTML += `<div id="${meal.idMeal}" class="card col-md-3 m-1 p-3" style="width: 16rem;">
              <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.idMeal}">
              <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <button  onClick="detailsButtonHandler(${meal.idMeal})" class="btn btn-sm btn-primary mb-2">See Details</button>
                <button onClick="editFavorites(${meal.idMeal})" class="btn btn-sm btn-primary">${btnName}</button>
              </div>
          </div>`;
      }
    } else {
        favDiv.innerHTML = "<p>No suggestions found.</p>";
    }
  }

  renderFavorites();