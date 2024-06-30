"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.client = new pg_1.Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: 5432,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});
exports.client.connect()
    .then(() => {
    console.log("Connection successful");
})
    .catch((err) => {
    console.log("Unable to connect", err);
});
