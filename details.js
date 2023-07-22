// Retrieve the selected meal details from localStorage
const selectedMeal = JSON.parse(localStorage.getItem("selectedMeal"));

// Function to render the meal details on the details.html page
function renderMealDetails() {
  const mealDetailsDiv = document.getElementById("mealDetails");
  if (selectedMeal) {
    const detailsHTML = `<div class="row">
    <div class="col-md-6">
      <h1 class="mt-2">${selectedMeal.strMeal}</h1>
      <img src="${selectedMeal.strMealThumb}" class="img-fluid d-block rounded-3 h-50 w-75" alt="${selectedMeal.strMeal}">
      <a href="${selectedMeal.strSource}" target="_blank"  class="btn btn-outline-info mt-3 me-3">Explore more</a>
      <a class="p-2" target="_blank"  href="${selectedMeal.strYoutube}">Watch YouTube video</a>
    </div>
    <div class="col-md-6 container">
      <h3 class="p-2">Instructions</h3>
      <p class="">${selectedMeal.strInstructions}</p>
    </div>
  </div>`;
    mealDetailsDiv.innerHTML = detailsHTML;
  } else {
    mealDetailsDiv.innerHTML = "<p>No meal details found.</p>";
  }
}

// Call the function to render the meal details on the details.html page
renderMealDetails();
