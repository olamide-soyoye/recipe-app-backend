const sinon = require('sinon');
const { expect } = require('chai');
const supertest = require('supertest');
const express = require('express');
const app = express(); 
const recipeController = require('../Controllers/recipeController');
const fileUtils = require('../utils/fileUtils');

const getRecipesFromFile = async () => {
    try {
        const recipes = await fileUtils.readRecipesFromFile();
        return recipes;
    } catch (err) {
        throw new Error('Error reading recipes from file');
    }
};

app.delete('/recipes/:id', recipeController.deleteRecipe);

describe('Recipe Controller - deleteRecipe', () => { 
    let request, recipes;

    before(async () => {
        request = supertest(app);
        recipes = await getRecipesFromFile();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete an existing recipe and return status 204', async () => {
        const mockRecipes = [
            { id: 1, title: 'Recipe 1', instructions: '...', ingredients: [], image: null },
            { id: 2, title: 'Recipe 2', instructions: '...', ingredients: [], image: null }
        ];

        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);
        sinon.stub(fileUtils, 'writeRecipesToFile').resolves();

        const lastRecipeId = recipes[recipes.length - 1].id;
        const response = await request.delete(`/recipes/${lastRecipeId}`);
        
        expect(response.status).to.equal(204);

    });

    it('should return status 404 if recipe is not found', async () => {
        const mockRecipes = [
            { id: 1, title: 'Recipe 1', instructions: '...', ingredients: [], image: null }
        ];

        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);
        sinon.stub(fileUtils, 'writeRecipesToFile');

        const response = await request.delete('/recipes/999');

        expect(response.status).to.equal(404); 
    }); 
});
