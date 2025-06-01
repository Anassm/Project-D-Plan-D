"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const touchpointsRoutes_1 = __importDefault(require("./routes/touchpointsRoutes"));
const flightsRoutes_1 = require("./routes/flightsRoutes");
const dotenv_1 = __importDefault(require("dotenv"));
const authentication_1 = __importDefault(require("./plugins/authentication"));
dotenv_1.default.config();
const backendPort = Number(process.env.API_PORT);
exports.server = (0, fastify_1.default)();
exports.server.register(cors_1.default, {
    origin: "http://localhost:5173",
    credentials: true,
});
exports.server.register(authentication_1.default);
exports.server.register(touchpointsRoutes_1.default);
exports.server.register(flightsRoutes_1.flightsRoutes);
exports.server.listen({ port: backendPort }, function (err, address) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening on port ${backendPort}`);
});
