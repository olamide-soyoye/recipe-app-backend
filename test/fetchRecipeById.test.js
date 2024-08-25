const { expect } = require('chai');
const sinon = require('sinon');
const recipeService = require('../Services/recipeService');
const fileUtils = require('../utils/fileUtils');

describe('Recipe Service - fetchRecipeById', () => {
    afterEach(() => {
        sinon.restore(); 
    });

    it('should fetch a recipe by ID correctly', async () => {
        const mockRecipes = [
            { 
                id: 1, 
                title: 'Recipe 3', 
                instructions: 'A delicious pasta dish',
                ingredients: ['pasta', 'tomato sauce'], 
                image: null 
            }
        ];
        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);
        
        const result = await recipeService.fetchRecipeById(1);
        
        expect(result).to.include({
            id: 1,
        });
    });
    
    it('should return null if recipe ID is not found', async () => {
        const mockRecipes = [
            { id: 1, title: 'Recipe 1' },
            { id: 2, title: 'Recipe 2' }
        ];
        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);
        
        const result = await recipeService.fetchRecipeById(1000);
        
        expect(result).to.be.null;
    });

    it('should throw an error if there is a problem reading the file', async () => {
        sinon.stub(fileUtils, 'readRecipesFromFile').throws(new Error('Test error'));
        
        try {
            await recipeService.fetchRecipeById(1);
        } catch (err) {
            expect(err.message).to.equal('Error fetching recipe by ID');
        }
    });
});
