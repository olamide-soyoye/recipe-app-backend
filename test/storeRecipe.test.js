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
            title: 'New Recipe',
            instructions: 'Mix ingredients and cook.',
            ingredients: ['ingredient1', 'ingredient2'],
            image: 'image-url'
        };
    
        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);
    
        sinon.stub(fileUtils, 'writeRecipesToFile').resolves();
    
        const result = await recipeService.storeRecipe(newRecipeData);
    
        expect(result).to.have.property('id').that.is.a('number');
        expect(result).to.include(newRecipeData);
    });
    
    

    it('should handle an error when storing a recipe', async () => {
        const newRecipeData = {
            title: 'New Recipe',
            instructions: 'Mix ingredients and cook.',
            ingredients: ['ingredient1', 'ingredient2'],
            image: 'image-url'
        };

        sinon.stub(fileUtils, 'readRecipesFromFile').throws(new Error('Test error'));

        try {
            await recipeService.storeRecipe(newRecipeData);
        } catch (err) {
            expect(err.message).to.equal('Error storing recipe');
        }
    });
});
