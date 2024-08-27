const { expect } = require('chai');
const sinon = require('sinon');
const recipeService = require('../Services/recipeService');
const fileUtils = require('../utils/fileUtils');

describe('Recipe Service - storeRecipe', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should store a new recipe and return it', async () => {
        const mockRecipes = [
            { id: 21, title: 'Recipe 1', instructions: '...', ingredients: [], image: null },
            { id: 22, title: 'Recipe 2', instructions: '...', ingredients: [], image: null }
        ];
    
        const newRecipeData = {
            title: 'Grilled Basil Chicken',
            instructions: 'Place chicken breasts in a shallow dish; orange quote icon do not rinse raw poultry. Cover with marinade. Cover dish. Refrigerate about 1 hour, turning occasionally. orange quote icon Wash dish after touching raw poultry.',
            ingredients: ['2 tbsp olive oil', '1 garlic clove, minced'],
            image: 'https://res.cloudinary.com/tamss/image/upload/v1724690862/bleotma2aul27klejhdp.jpg'
        };
    
        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);
    
        sinon.stub(fileUtils, 'writeRecipesToFile').resolves();
    
        const result = await recipeService.storeRecipe(newRecipeData);
    
        expect(result).to.have.property('id').that.is.a('number');
        expect(result).to.include(newRecipeData);
    });
    
    

    it('should handle an error when storing a recipe', async () => {
        const newRecipeData = {
            title: 'Moroccan Chicken with Ehh-plant-Zucchini Ragout',
            instructions: 'Add leg quarters to pan, skin-side down. orange quote icon Wash hands with soap and water after handling uncooked chicken. Brown chicken, turning once, 8 to 10 minutes per side. Remove chicken to plate and drain off all but 2 tablespoons oil. Add eggplant to hot pan and cook, stirring, 5 minutes. Add remaining tablespoon olive oil, along with zucchini, onion and garlic. Cook 5 minutes, stirring occasionally',
            ingredients: ['3 tbsp olive oil, divided', '1 tsp salt, divided','1 tsp freshly ground black pepper, divided'],
            image: 'https://res.cloudinary.com/tamss/image/upload/v1724742626/mjjy7vm13iqhct1a8awm.jpg'
        };

        sinon.stub(fileUtils, 'readRecipesFromFile').throws(new Error('Test error'));

        try {
            await recipeService.storeRecipe(newRecipeData);
        } catch (err) {
            expect(err.message).to.equal('Error storing recipe');
        }
    });
});
