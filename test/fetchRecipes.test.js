const request = require('supertest');
const express = require('express');
const { expect } = require('chai');
const sinon = require('sinon');
const { getRecipes } = require('../Controllers/recipeController'); 
const recipeService = require('../Services/recipeService');

const app = express();
app.use(express.json());
app.get('/recipes', getRecipes);

describe('GET /recipes', function() {
    let fetchRecipesStub;

    beforeEach(function() {
        fetchRecipesStub = sinon.stub(recipeService, 'fetchRecipes');
    });

    afterEach(function() {
        fetchRecipesStub.restore();
    });

    it('should return paginated recipe data successfully', async function() {
        fetchRecipesStub.resolves({
            data: [{ id: 1, name: 'Recipe 1' }],
            pagination: { page: 1, limit: 10, total: 1 }
        });

        const response = await request(app).get('/recipes').query({ page: 1, limit: 10 });
        expect(response.status).to.equal(200);
    });

    it('should handle page and limit validation errors', async function() {
        const response = await request(app).get('/recipes').query({ page: 0, limit: 10 });
        expect(response.status).to.equal(400);
    }); 
});