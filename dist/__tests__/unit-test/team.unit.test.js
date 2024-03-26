"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../../teams/controller");
const express_validator_1 = require("express-validator");
const service_1 = require("../../teams/service");
const crud_1 = require("../../utils/crud");
jest.mock('express-validator');
jest.mock('../../teams/service', () => ({
    createTeam: jest.fn(),
    deleteTeam: jest.fn(),
    editTeam: jest.fn()
}));
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
describe('createNewTeam', () => {
    let req;
    let res;
    let next;
    const fakeTeamData = {
        name: 'Test Team',
        country: 'Test Country',
        city: 'Test City',
        stadium: 'Test Stadium',
        founded: new Date().toISOString(),
        numberOfTitles: 0
    };
    beforeEach(() => {
        req = { body: {
                name: fakeTeamData.name,
                country: fakeTeamData.country,
                city: fakeTeamData.city,
                stadium: fakeTeamData.stadium,
                founded: fakeTeamData.founded,
                numberOfTitles: fakeTeamData.numberOfTitles
            } };
        res = mockResponse();
        next = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 201 if team is created successfully', async () => {
        express_validator_1.validationResult.mockReturnValue({ isEmpty: () => true });
        const fakeCreatedTeam = {
            _id: 'fakeId',
            ...fakeTeamData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        service_1.createTeam.mockResolvedValue(fakeCreatedTeam);
        await (0, controller_1.createNewTeam)(req, res, next);
        expect(express_validator_1.validationResult).toHaveBeenCalledWith(req);
        expect(service_1.createTeam).toHaveBeenCalledWith(fakeTeamData);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
            code: 201,
            msg: 'team created successfully',
            data: fakeCreatedTeam,
        });
    });
    it('should return 400 if validation fails', async () => {
        express_validator_1.validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'Error message 1' }, { msg: 'Error message 2' }],
        });
        await (0, controller_1.createNewTeam)(req, res, next);
        expect(express_validator_1.validationResult).toHaveBeenCalledWith(req);
        expect(service_1.createTeam).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
    });
});
describe('deleteTeamById', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            params: { id: "validTeamId" },
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should return 400 if team ID is invalid', async () => {
        if (req.params) {
            req.params.id = 'invalidTeamId';
        }
        await (0, controller_1.deleteTeamById)(req, res, next);
        expect(next).toHaveBeenCalledWith({ code: 400, msg: 'Invalid team ID' });
    });
});
describe('updateTeamById', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            params: { id: 'validObjectId' },
            body: { name: 'New Team Name' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });
    it('should handle invalid team ID', async () => {
        if (req.params) {
            req.params.id = 'invalidObjectId';
        }
        await (0, controller_1.updateTeamById)(req, res, next);
        expect(next).toHaveBeenCalledWith({ code: 400, msg: 'Invalid team ID' });
        expect(service_1.editTeam).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
describe('getAllTeams', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
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
