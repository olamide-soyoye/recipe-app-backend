const sinon = require('sinon');
const { expect } = require('chai');
const recipeService = require('../Services/recipeService');
const fileUtils = require('../utils/fileUtils');

const getRecipesFromFile = async () => {
    try {
        const recipes = await fileUtils.readRecipesFromFile();
        return recipes;
    } catch (err) {
        throw new Error('Error reading recipes from file');
    }
};

describe('Recipe Service - editRecipe', () => {
    afterEach(() => {
        sinon.restore();
    });

    let recipes;

    before(async () => {
        recipes = await getRecipesFromFile();
    });

    it('should update an existing recipe and return it', async () => {
        const mockRecipes = [
            { id: 1, title: 'Recipe 1', instructions: '...', ingredients: [], image: null },
            { id: 2, title: 'Recipe 2', instructions: '...', ingredients: [], image: null }
        ];

        const updatedData = {
            title: 'Updated Recipe 1',
            instructions: 'New instructions',
            ingredients: [
                "pasta",
                "tomato sauce"
            ],
            image: "https://res.cloudinary.com/tamss/image/upload/v1724742626/mjjy7vm13iqhct1a8awm.jpg"
        };

        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);

        sinon.stub(fileUtils, 'writeRecipesToFile').resolves();
        const firstRecipeId = recipes[0].id;
        const result = await recipeService.editRecipe(firstRecipeId, updatedData);

        expect(result).to.have.property('id', 1);
        expect(result).to.include(updatedData);
    });

    it('should return null if the recipe to update is not found', async () => {
        const mockRecipes = [
            { id: 1, title: 'Recipe 1', instructions: '...', ingredients: [], image: null }
        ];

        const updatedData = {
            title: 'Updated Recipe'
        };

        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);

        const writeStub = sinon.stub(fileUtils, 'writeRecipesToFile').resolves();

        const result = await recipeService.editRecipe(999, updatedData);

        expect(result).to.be.null;

        expect(writeStub.notCalled).to.be.true;
    });
});
