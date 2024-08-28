const request = require('supertest');
const express = require('express');
const { updateRecipe } = require('../Controllers/recipeController');
const Recipe = require('../models/recipe');

const app = express();
app.use(express.json());
app.put('/recipes/:id', updateRecipe);

describe('PUT /recipes/:id', () => {
    let testRecipeId;

    beforeAll(async () => {
        // Create a test recipe
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
        // try {
        //     await Recipe.db.connection.db.dropDatabase(); // Drop the database
        // } catch (error) {
        //     console.error('Error during cleanup:', error);
        // } finally {
        //     await Recipe.db.connection.close(); // Close the connection
        // }
    });

    it('should return status code 200 and updated recipe data when a valid ID is provided', async () => {
        const updatedData = {
            title: 'Updated Recipe Title',
            ingredients: ['Updated Ingredient 1', 'Updated Ingredient 2'],
            instructions: 'Updated Instructions',
            image: 'updated_image_url'
        };

        const response = await request(app)
            .put(`/recipes/${testRecipeId}`)
            .send(updatedData)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'Data successfully updated');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id', testRecipeId);
        expect(response.body.data).toHaveProperty('title', updatedData.title);
        expect(response.body.data).toHaveProperty('ingredients', updatedData.ingredients);
        expect(response.body.data).toHaveProperty('instructions', updatedData.instructions);
        expect(response.body.data).toHaveProperty('image', updatedData.image);
    },10000);

    it('should return 404 when the recipe with the given ID does not exist', async () => {
        const invalidId = '888c6c9f2f3b2c001f647a1b';
        const response = await request(app)
            .put(`/recipes/${invalidId}`)
            .send({
                title: 'Some Title',
                ingredients: ['Some Ingredient'],
                instructions: 'Some Instructions',
                image: 'some_image_url'
            })
            .expect('Content-Type', /json/)
            .expect(404);

        // expect(response.body).toHaveProperty('status', 'failed');
        // expect(response.body).toHaveProperty('message', 'Recipe not found');
    },10000);
});
