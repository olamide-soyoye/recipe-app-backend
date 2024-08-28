const request = require('supertest');
const express = require('express');
const { getRecipeById } = require('../Controllers/recipeController');
const Recipe = require('../models/recipe');

const app = express();
app.use(express.json());
app.get('/recipes/:id', getRecipeById);

describe('GET /recipes/:id', () => {
    let testRecipeId;

    beforeAll(async () => {
        const recipe = await Recipe.create({
            title: 'Test Recipe 1',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: 'Instructions for Test Recipe 1',
            image: 'test_image_url_1'
        });
        testRecipeId = recipe._id.toString();
    });

    afterAll(async () => {
        // Cleanup: Drop the database and disconnect
        // Uncomment the following lines if your `Recipe` model manages the connection
        // try {
        //     await Recipe.db.connection.db.dropDatabase(); // Drop the database
        // } catch (error) {
        //     console.error('Error during cleanup:', error);
        // } finally {
        //     await Recipe.db.connection.close(); // Close the connection
        // }
    });

    it('should return status code 200 and recipe data when a valid ID is provided', async () => {
        const response = await request(app)
            .get(`/recipes/${testRecipeId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'Data successfully fetched');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id', testRecipeId);
        expect(response.body.data).toHaveProperty('title', 'Test Recipe 1');
        expect(response.body.data).toHaveProperty('ingredients');
        expect(response.body.data).toHaveProperty('instructions');
        expect(response.body.data).toHaveProperty('image');
    });

    it('should return 404 when the recipe with the given ID does not exist', async () => {
        const invalidId = '888c6c9f2f3b2c001f647a1b';
        const response = await request(app)
            .get(`/recipes/${invalidId}`)
            .expect('Content-Type', /json/)
            .expect(404); 
    }); 
});
