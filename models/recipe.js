const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true, 
    },
    image: {
        type: String,
        required: false, 
    },
    ingredients: {
        type: [String],
        required: true,
    },
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
