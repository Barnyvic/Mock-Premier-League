"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../../utils/helper");
const varibales_1 = __importDefault(require("../../config/varibales"));
jest.mock("argon2");
jest.mock("jsonwebtoken");
describe("hashPassword", () => {
    it("should hash the password using argon2", async () => {
        const password = "password123";
        const hashedPassword = "hashedPassword123";
        argon2_1.default.hash.mockResolvedValue(hashedPassword);
        const result = await (0, helper_1.hashPassword)(password);
        expect(argon2_1.default.hash).toHaveBeenCalledWith(password);
        expect(result).toBe(hashedPassword);
    });
});
describe("comparePassword", () => {
    it("should compare the plain text password with the hashed password", async () => {
        const hashedPassword = "hashedPassword123";
        const password2 = "password123";
        const match = true;
        argon2_1.default.verify.mockResolvedValue(match);
        const result = await (0, helper_1.comparePassword)(hashedPassword, password2);
        expect(argon2_1.default.verify).toHaveBeenCalledWith(hashedPassword, password2);
        expect(result).toBe(match);
    });
});
describe("createToken", () => {
    it('should generate a JWT token with the given user ID and return it', async () => {
        const id = "12345";
        const token = await (0, helper_1.createToken)(id);
        const decoded = jsonwebtoken_1.default.verify(token, varibales_1.default.jwtSecret);
        expect(decoded).toBe(decoded);
    });
});
describe("accessToken", () => {
    it('should return the decoded payload of a valid JWT when given a valid token', () => {
        const token = 'valid_token';
        const expectedPayload = { id: 'user_id' };
        const jwtVerifyMock = jest.spyOn(jsonwebtoken_1.default, 'verify').mockReturnValue(expectedPayload);
        const result = (0, helper_1.verifyToken)(token);
        expect(jwtVerifyMock).toHaveBeenCalledWith(token, varibales_1.default.jwtSecret);
        expect(result).toEqual(expectedPayload);
        jwtVerifyMock.mockRestore();
    });
});
