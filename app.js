const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const cartList = document.getElementById('cart-list');
const cartCount = document.getElementById('cart-count');
const cartLimitMsg = document.getElementById('cart-limit');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));

let cart = []; // Store cart items

document.addEventListener('DOMContentLoaded', loadInitialMeals);
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', handleMealActions);

function loadInitialMeals() {
  fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then(response => response.json())
    .then(data => renderMeals(data.meals));
}

function getMealList() {
  const searchInputTxt = document.getElementById('search-input').value.trim();
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        renderMeals(data.meals);
      } else {
        mealList.innerHTML = `<div class="col-12 text-center"><p class="text-danger">No meals found!</p></div>`;
      }
    });
}

function renderMeals(meals) {
  let html = "";
  meals.forEach(meal => {
    html += `
      <div class="col-md-4">
        <div class="card meal-item" data-id="${meal.idMeal}">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-body text-center">
            <button class="btn btn-add-to-cart">Add to Cart</button>
            <h5 class="card-title">${meal.strMeal}</h5>
            <a href="#" class="btn btn-primary recipe-btn">Details</a>
          </div>
        </div>
      </div>
    `;
  });
  mealList.innerHTML = html;
}

function handleMealActions(e) {
  e.preventDefault();
  const mealCard = e.target.closest('.meal-item');
  const mealId = mealCard.dataset.id;
  const mealName = mealCard.querySelector('.card-title').textContent;

  if (e.target.classList.contains('btn-add-to-cart')) {
    if (cart.length >= 11) {
      cartLimitMsg.style.display = 'block';
    } else {
      if (!cart.includes(mealId)) {
        cart.push(mealId);
        cartList.innerHTML += `<li class="list-group-item">${mealName}</li>`;
        e.target.textContent = "Already Added";
        e.target.disabled = true;
        cartCount.textContent = cart.length;
        cartLimitMsg.style.display = 'none';
      }
    }
  } else if (e.target.classList.contains('recipe-btn')) {
    fetchMealDetails(mealId);
  }
}

function fetchMealDetails(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      displayMealDetails(meal);
    });
}

function displayMealDetails(meal) {
  const html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category"><strong>Category:</strong> ${meal.strCategory}</p>
    <p class="recipe-area"><strong>Area:</strong> ${meal.strArea}</p>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <img src="${meal.strMealThumb}" class="img-fluid mb-3" alt="${meal.strMeal}">
    <div class="recipe-link text-center">
      <a href="${meal.strYoutube}" target="_blank" class="btn btn-warning">Watch Video</a>
    </div>
  `;
  mealDetailsContent.innerHTML = html;
  recipeModal.show();
}
