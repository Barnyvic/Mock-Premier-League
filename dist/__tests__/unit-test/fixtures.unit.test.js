"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crud_1 = require("../../utils/crud");
jest.mock('express-validator');
jest.mock('../../fixtures/service', () => ({
    createFixture: jest.fn(),
    deleteFixture: jest.fn(),
    findOne: jest.fn(),
    getFixtureByUniqueLink: jest.fn(),
    findAll: jest.fn(),
    editFixture: jest.fn(),
    getFixturesByStatus: jest.fn(),
    searchFixtures: jest.fn()
}));
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
describe('getFixtures', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            query: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 200 status code and JSON data when successful', async () => {
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockNext = jest.fn();
        const mockFn = jest.fn().mockResolvedValue([{ id: 1, name: 'John' }]);
        await (0, crud_1.fetchAll)(mockFn)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            code: 200,
            msg: "Successfully fetched",
            data: [{ id: 1, name: 'John' }],
        });
    });
});
