"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var jwtSecret = process.env.JWT_SECRET;
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    console.log("-------------------------------------------------", req.body);
    try {
        const userCheck = yield prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if ((userCheck === null || userCheck === void 0 ? void 0 : userCheck.email) === email) {
            res.status(400).json({ message: "User already registered" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                email: email,
                name: userName,
                password: hashedPassword
            }
        });
        console.log(user);
        // (Optional) Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret);
        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(100).json({ "message": "Try with diffrent credentials" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield prisma.user.findFirst({
            where: { email },
        });
        if (!existingUser || !existingUser.password) {
            res.status(404).json({ message: "User not found or password undefined" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: existingUser.id }, jwtSecret);
        res.cookie("token", token, {
            httpOnly: true,
        }).json({
            message: "Login successful",
            user: {
                id: existingUser.id,
                email: existingUser.email,
                userName: existingUser.name,
            },
        });
        // res.status(200).json();
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.loginUser = loginUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const userCheck = yield prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!userCheck) {
            res.status(400).json({ message: "User Not found with this record" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const updatedUser = yield prisma.user.update({
            where: {
                email: email
            },
            data: {
                name: username,
                password: hashedPassword
            }
        });
        res.status(200).json({ message: "User updated successfully ", user: { username: updatedUser.name } });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ "message": " Incorrect Credentials try with diffrent email" });
    }
});
exports.updateUser = updateUser;
