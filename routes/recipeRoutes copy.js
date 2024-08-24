const express = require('express');
const router = express.Router();
const recipeController = require('../Controllers/recipeController');
const validationMiddleware = require('../middlewares/validationMiddleware');

// Routes
router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);
router.post('/', validationMiddleware.validateRecipe, recipeController.createRecipe);
router.put('/:id', validationMiddleware.validateRecipe, recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
