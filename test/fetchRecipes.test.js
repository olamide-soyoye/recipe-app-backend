const { expect } = require('chai');
const sinon = require('sinon');
const recipeService = require('../Services/recipeService');
const fileUtils = require('../utils/fileUtils');

describe('Recipe Service - fetchRecipes', () => {
    afterEach(() => {
        sinon.restore(); 
    });

    it('should fetch paginated recipes correctly', async () => {
        const mockRecipes = [
            { id: 1, title: 'Recipe 1' },
            { id: 2, title: 'Recipe 2' }
        ];
        sinon.stub(fileUtils, 'readRecipesFromFile').resolves(mockRecipes);
    
        const req = { query: { page: '1', limit: '2' } };
        const result = await recipeService.fetchRecipes(req);
    
        expect(result.data).to.have.lengthOf(2); 
    });
    

    it('should return an error if page or limit is less than 1', async () => {
        const req = { query: { page: '0', limit: '2' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await recipeService.fetchRecipes(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ error: 'Page and limit must be greater than 0' })).to.be.true;
    });

});
