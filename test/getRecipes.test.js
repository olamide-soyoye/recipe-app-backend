const request = require('supertest');
const express = require('express');
const { getRecipes } = require('../Controllers/recipeController');
const Recipe = require('../models/recipe'); 

const app = express();
app.use(express.json());
app.get('/recipes', getRecipes);

describe('GET /recipes', () => {
    beforeAll(async () => {
        await seedTestData();
    });

    it('should return status code 200 and paginated recipes data', async () => {
        const response = await request(app)
            .get('/recipes?page=1&limit=5')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'Paginated data successfully fetched');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);

        const recipe = response.body.data[0];
        expect(recipe).toHaveProperty('_id');
        expect(recipe).toHaveProperty('title');
        expect(recipe).toHaveProperty('ingredients');
        expect(recipe).toHaveProperty('instructions');
        expect(recipe).toHaveProperty('image');
    });

    it('should return 400 for invalid page or limit', async () => {
        const response1 = await request(app)
            .get('/recipes?page=-1&limit=5')
            .expect('Content-Type', /json/)
            .expect(400);
        
        expect(response1.body.error).toHaveProperty('status', 'failed');
        expect(response1.body.error).toHaveProperty('message', 'Page and limit must be greater than 0');


        const response2 = await request(app)
            .get('/recipes?page=1&limit=-5')
            .expect('Content-Type', /json/)
            .expect(400);
        
        expect(response2.body.error).toHaveProperty('status', 'failed');
        expect(response2.body.error).toHaveProperty('message', 'Page and limit must be greater than 0');

    }); 
});

async function seedTestData() {
    await Recipe.create([
        {
            title: 'Test Recipe 1',
            ingredients: ['Ingredient 1', 'Ingredient 2'],
            instructions: 'Instructions for Test Recipe 1',
            image: 'test_image_url_1'
        },
    ]);
}
