   let ingredients = [];
        
        // Sample recipe database (in real app, this would come from your Python backend)
        const sampleRecipes = [
            {
                id: 1,
                name: "Chicken Tomato Rice Bowl",
                description: "A hearty and nutritious bowl combining tender chicken with fresh tomatoes over fluffy rice.",
                ingredients: ["chicken", "tomatoes", "rice", "onion", "garlic", "olive oil"],
                cookTime: "25 mins",
                difficulty: "Easy",
                servings: 4
            },
            {
                id: 2,
                name: "Mediterranean Chicken Salad",
                description: "Fresh and vibrant salad with grilled chicken, tomatoes, and Mediterranean flavors.",
                ingredients: ["chicken", "tomatoes", "lettuce", "cucumber", "feta cheese", "olive oil"],
                cookTime: "15 mins",
                difficulty: "Easy",
                servings: 2
            },
            {
                id: 3,
                name: "Tomato Basil Pasta",
                description: "Classic Italian pasta with fresh tomatoes, basil, and aromatic herbs.",
                ingredients: ["pasta", "tomatoes", "basil", "garlic", "olive oil", "parmesan"],
                cookTime: "20 mins",
                difficulty: "Easy",
                servings: 3
            },
            {
                id: 4,
                name: "Chicken Fried Rice",
                description: "Delicious Asian-style fried rice with tender chicken and vegetables.",
                ingredients: ["chicken", "rice", "eggs", "soy sauce", "vegetables", "garlic"],
                cookTime: "18 mins",
                difficulty: "Medium",
                servings: 4
            },
            {
                id: 5,
                name: "Tomato Soup",
                description: "Creamy and comforting tomato soup perfect for any season.",
                ingredients: ["tomatoes", "onion", "garlic", "cream", "basil", "butter"],
                cookTime: "30 mins",
                difficulty: "Easy",
                servings: 4
            },
            {
                id: 6,
                name: "Chicken Curry",
                description: "Aromatic and flavorful chicken curry with rich spices and tender meat.",
                ingredients: ["chicken", "onion", "garlic", "ginger", "tomatoes", "coconut milk", "spices"],
                cookTime: "40 mins",
                difficulty: "Medium",
                servings: 6
            }
        ];

        function createFloatingParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = particle.style.height = (Math.random() * 10 + 5) + 'px';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                addIngredient();
            }
        }

        function addIngredient() {
            const input = document.getElementById('ingredientInput');
            const ingredient = input.value.trim().toLowerCase();
            
            if (ingredient && !ingredients.includes(ingredient)) {
                ingredients.push(ingredient);
                updateIngredientsDisplay();
                input.value = '';
                updateGetRecipesButton();
            }
        }

        function removeIngredient(ingredient) {
            ingredients = ingredients.filter(item => item !== ingredient);
            updateIngredientsDisplay();
            updateGetRecipesButton();
        }

        function updateIngredientsDisplay() {
            const container = document.getElementById('ingredientsList');
            
            if (ingredients.length === 0) {
                container.innerHTML = '<div style="color: #999; font-style: italic; align-self: center;">Add ingredients to get started...</div>';
                return;
            }

            container.innerHTML = ingredients.map(ingredient => 
                `<div class="ingredient-tag">
                    ${ingredient}
                    <span class="remove" onclick="removeIngredient('${ingredient}')">×</span>
                </div>`
            ).join('');
        }

        function updateGetRecipesButton() {
            const btn = document.getElementById('getRecipesBtn');
            btn.disabled = ingredients.length === 0;
        }

        function calculateMatchScore(recipeIngredients) {
            const matches = recipeIngredients.filter(ingredient => 
                ingredients.some(userIngredient => 
                    ingredient.toLowerCase().includes(userIngredient) || 
                    userIngredient.includes(ingredient.toLowerCase())
                )
            ).length;
            
            return Math.round((matches / recipeIngredients.length) * 100);
        }

        function getRecipes() {
            const loading = document.getElementById('loading');
            const resultsContainer = document.getElementById('recipeResults');
            
            // Show loading
            loading.classList.add('active');
            resultsContainer.innerHTML = '';
            
            // Simulate API call delay
            setTimeout(() => {
                loading.classList.remove('active');
                
                // Filter and score recipes based on ingredients
                const matchedRecipes = sampleRecipes
                    .map(recipe => ({
                        ...recipe,
                        matchScore: calculateMatchScore(recipe.ingredients)
                    }))
                    .filter(recipe => recipe.matchScore > 0)
                    .sort((a, b) => b.matchScore - a.matchScore);

                if (matchedRecipes.length === 0) {
                    resultsContainer.innerHTML = `
                        <div class="empty-state">
                            <div class="icon">😔</div>
                            <p>No recipes found with those ingredients. Try adding more common ingredients!</p>
                        </div>
                    `;
                    return;
                }

                resultsContainer.innerHTML = `
                    <div class="recipe-cards">
                        ${matchedRecipes.map((recipe, index) => `
                            <div class="recipe-card" style="animation-delay: ${index * 0.1}s">
                                <h3>${recipe.name}</h3>
                                <p class="description">${recipe.description}</p>
                                <div class="ingredients">
                                    ${recipe.ingredients.map(ingredient => 
                                        `<span class="ingredient-chip ${ingredients.some(userIngredient => 
                                            ingredient.toLowerCase().includes(userIngredient) || 
                                            userIngredient.includes(ingredient.toLowerCase())
                                        ) ? 'matched' : ''}">${ingredient}</span>`
                                    ).join('')}
                                </div>
                                <div class="stats">
                                    <div>
                                        ⏱️ ${recipe.cookTime} | 
                                        📊 ${recipe.difficulty} | 
                                        👥 ${recipe.servings} servings
                                    </div>
                                    <div class="match-score">${recipe.matchScore}% Match</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Animate cards in
                setTimeout(() => {
                    document.querySelectorAll('.recipe-card').forEach(card => {
                        card.classList.add('visible');
                    });
                }, 100);

            }, 1500);
        }

        // Add some suggested ingredients for easy testing
        function addSuggestedIngredients() {
            const suggestions = ['chicken', 'tomatoes'];
            suggestions.forEach(ingredient => {
                if (!ingredients.includes(ingredient)) {
                    ingredients.push(ingredient);
                }
            });
            updateIngredientsDisplay();
            updateGetRecipesButton();
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            createFloatingParticles();
            
            // Add some sample ingredients after 2 seconds for demo
            setTimeout(() => {
                if (ingredients.length === 0) {
                    addSuggestedIngredients();
                }
            }, 2000);
        });

        // Add enhanced styling for matched ingredients
        const style = document.createElement('style');
        style.textContent = `
            .ingredient-chip.matched {
                background: linear-gradient(45deg, #28a745, #20c997) !important;
                color: white !important;
                font-weight: bold;
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);