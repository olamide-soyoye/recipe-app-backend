const express = require('express');
const router = express.Router();
const recipeController = require('../Controllers/recipeController');
const validationMiddleware = require('../middlewares/validationMiddleware');

/**
 * @openapi
 * /recipes:
 *   get:
 *     summary: Retrieve a list of recipes
 *     description: Get a list of all recipes.
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The recipe ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: The name of the recipe
 *                     example: Spaghetti Bolognese
 *                   ingredients:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of ingredients
 *                     example: ["spaghetti", "ground beef", "tomato sauce"]
 */
router.get('/', recipeController.getRecipes);

/**
 * @openapi
 * /recipes/{id}:
 *   get:
 *     summary: Retrieve a specific recipe by ID
 *     description: Get details of a recipe by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Recipe details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The recipe ID
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the recipe
 *                   example: Spaghetti Bolognese
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of ingredients
 *                   example: ["spaghetti", "ground beef", "tomato sauce"]
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', recipeController.getRecipeById);

/**
 * @openapi
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: Add a new recipe to the collection.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the recipe
 *                 example: Spaghetti Bolognese
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of ingredients
 *                 example: ["spaghetti", "ground beef", "tomato sauce"]
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The newly created recipe ID
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the recipe
 *                   example: Spaghetti Bolognese
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of ingredients
 *                   example: ["spaghetti", "ground beef", "tomato sauce"]
 *       400:
 *         description: Invalid input
 */
router.post('/', validationMiddleware.validateRecipe, recipeController.createRecipe);

/**
 * @openapi
 * /recipes/{id}:
 *   put:
 *     summary: Update an existing recipe
 *     description: Update the details of a recipe by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the recipe
 *                 example: Spaghetti Bolognese
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of ingredients
 *                 example: ["spaghetti", "ground beef", "tomato sauce"]
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The recipe ID
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the recipe
 *                   example: Spaghetti Bolognese
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of ingredients
 *                   example: ["spaghetti", "ground beef", "tomato sauce"]
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Recipe not found
 */
router.put('/:id', validationMiddleware.validateRecipe, recipeController.updateRecipe);

/**
 * @openapi
 * /recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     description: Remove a recipe from the collection by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The recipe ID
 *     responses:
 *       204:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 */
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
