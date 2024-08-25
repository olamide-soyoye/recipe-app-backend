const express = require('express');
const router = express.Router();
const recipeController = require('../Controllers/recipeController');
const upload = require('../config/multer'); 
const { validateRecipe, checkValidation } = require('../middlewares/validationMiddleware');

router.get('/', 
    recipeController.getRecipes
);

router.get('/:id', 
    recipeController.getRecipeById
);

router.post('/', 
    upload.single('image'), 
    validateRecipe,
    checkValidation,
    recipeController.createRecipe
); 

router.put(
    '/:id', 
    upload.single('image'), 
    validateRecipe,
    checkValidation,
    recipeController.updateRecipe
);

router.delete('/:id', 
    recipeController.deleteRecipe
);

module.exports = router;
