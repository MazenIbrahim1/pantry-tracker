
async function generateRecipes(pantryItems) {
    const response = await fetch('/api/generateRecipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pantryItems })
    });
  
    if (response.ok) {
      const recipes = await response.json();
      return recipes;
    } else {
      throw new Error('Failed to fetch recipes');
    }
}

export default generateRecipes