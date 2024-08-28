const request = require('supertest');
const express = require('express');
const { deleteRecipe } = require('../Controllers/recipeController');
const Recipe = require('../models/recipe'); 

const app = express();
app.use(express.json());
app.delete('/recipes/:id', deleteRecipe);

describe('DELETE /recipes/:id', () => {
    let testRecipeId;

    beforeAll(async () => {
        const recipe = await Recipe.create({
            title: 'Test Recipe for Deletion',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: 'Instructions for deletion test',
            image: 'test_image_url'
        });
        testRecipeId = recipe._id.toString();
    });

    afterAll(async () => {
        // try {
        //     await Recipe.db.connection.db.dropDatabase(); // Drop the database
        // } catch (error) {
        //     console.error('Error during cleanup:', error);
        // } finally {
        //     await Recipe.db.connection.close(); // Close the connection
        // }
    });

    it('should return 204 status code and delete the recipe when a valid ID is provided', async () => {
        await request(app)
            .delete(`/recipes/${testRecipeId}`)
            .expect('Content-Type', /json/)
            .expect(204);
    },10000);

    it('should return 400 status code for an invalid ID', async () => {
        const invalidId = 'invalid_id';
        const response = await request(app)
            .delete(`/recipes/${invalidId}`)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body.error).toHaveProperty('status', 'failed');
        expect(response.body.error).toHaveProperty('message', 'Invalid recipe ID');
    },10000); 
});
