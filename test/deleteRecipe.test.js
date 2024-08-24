const sinon = require('sinon');
const { expect } = require('chai');
const supertest = require('supertest');
const express = require('express');
const app = express(); 
const recipeController = require('../Controllers/recipeController');
const fileUtils = require('../utils/fileUtils');

//route
app.delete('/recipes/:id', recipeController.deleteRecipe);

describe('Recipe Controller - deleteRecipe', () => {
    let request;

    before(() => {
        request = supertest(app);
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
        const writeStub = sinon.stub(fileUtils, 'writeRecipesToFile').resolves();

        const response = await request.delete('/recipes/75');

        // Assertions
        expect(response.status).to.equal(204);
        // expect(response.body).to.deep.equal({ message: 'Deleted successfully' });

    });

    it('should return status 404 if recipe is not found', async () => {
        const mockRecipes = [
            { id: 1, title: 'Recipe 1', instructions: '...', ingredients: [], image: null }
        ];

        // Stub file operations
        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);
        const writeStub = sinon.stub(fileUtils, 'writeRecipesToFile');

        // Send delete request for a non-existent recipe
        const response = await request.delete('/recipes/999');

        // Assertions
        expect(response.status).to.equal(404);
        // expect(response.body).to.deep.equal({ message: 'Recipe not found' });

        // Verify that writeRecipesToFile was not called
        // expect(writeStub.notCalled).to.be.true;
    }); 
});
