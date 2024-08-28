const request = require('supertest');
const express = require('express');
const { createRecipe } = require('../Controllers/recipeController');
const Recipe = require('../models/recipe');
const multer = require('multer');
const upload = multer();

const app = express();
app.use(express.json());
app.post('/recipes', upload.single('image'), createRecipe);

describe('POST /recipes', () => {
    afterEach(async () => {
        // await Recipe.deleteMany({});
    });

    it('should create a new recipe and return 201 status code', async () => {
        const newRecipe = {
            title: 'New Recipe Title',
            instructions: 'New Recipe Instructions',
            ingredients: ['New Ingredient 1', 'New Ingredient 2'],
            image: null,
        };

        const response = await request(app)
            .post('/recipes')
            .send(newRecipe)
            .expect('Content-Type', /json/)
            .expect(201);
            console.log('Olamide',response)
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'Data successfully inserted');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('title', newRecipe.title);
        expect(response.body.data).toHaveProperty('instructions', newRecipe.instructions);
        expect(response.body.data).toHaveProperty('ingredients');
        // expect(response.body.data).toHaveProperty('image', null); 
    }, 10000);

    it('should return 500 status code if internal server error', async () => {
        const invalidRecipe = {
            title: '', 
            instructions: '',
            ingredients: []
        };

        const response = await request(app)
            .post('/recipes')
            .send(invalidRecipe)
            .expect('Content-Type', /json/)
            .expect(500);

        // expect(response.body.error).toHaveProperty('status', 'failed');
        // expect(response.body.error).toHaveProperty('message');
    },10000); 
});
