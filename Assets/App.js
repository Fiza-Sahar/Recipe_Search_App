document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.querySelector('.searchBox');
    const searchBtn = document.querySelector('.searchBtn');
    const recipeContainer = document.querySelector('.recipe-container');

    const fetchRecipes = async (query) => {
        recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = "";

        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `;

            const button = document.createElement('button');
            button.textContent = "View Recipe";
            button.addEventListener('click', async () => {
                await showRecipeDetails(meal.idMeal);
            });

            recipeDiv.appendChild(button);
            recipeContainer.appendChild(recipeDiv);
        });
    };

    const showRecipeDetails = async (mealId) => {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const response = await data.json();
        const meal = response.meals[0];

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}">
                <p>Category: ${meal.strCategory}</p>
                <p>Area: ${meal.strArea}</p>
                <h3>Ingredients:</h3>
                <ul>
                    ${getIngredientsList(meal)}
                </ul>
                <p>Instructions: ${meal.strInstructions}</p>
            </div>
        `;

        if (meal.strYoutube) {
            const youtubeButton = document.createElement('a');
            youtubeButton.classList.add('youtube-button');
            youtubeButton.href = meal.strYoutube;
            youtubeButton.target = '_blank';
            youtubeButton.rel = 'noopener noreferrer';
            youtubeButton.textContent = 'Watch on YouTube';
            modal.querySelector('.modal-content').appendChild(youtubeButton);
        }

        document.body.appendChild(modal);

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', closeModal);

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    };

    const getIngredientsList = (meal) => {
        let ingredientsList = "";
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredientsList += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
            }
        }
        return ingredientsList;
    };

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const searchInput = searchBox.value.trim();
        fetchRecipes(searchInput);
    });
});
