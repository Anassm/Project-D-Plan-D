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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const swagger_1 = __importDefault(require("./plugins/swagger"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
dotenv_1.default.config();
const backendPort = Number(process.env.API_PORT);
const httpsOptions = {
    key: fs_1.default.readFileSync(path_1.default.join(__dirname, 'server.key')),
    cert: fs_1.default.readFileSync(path_1.default.join(__dirname, 'server.cert')),
};
exports.server = (0, fastify_1.default)({
    https: httpsOptions,
});
exports.server.register(cors_1.default, {
    origin: "http://localhost:5173",
    credentials: true,
});
exports.server.register(swagger_1.default);
exports.server.register(authentication_1.default);
exports.server.register(touchpointsRoutes_1.default);
exports.server.register(flightsRoutes_1.flightsRoutes);
const startServer = async () => {
    await exports.server.register(rate_limit_1.default, {
        max: 100,
        timeWindow: "1 minute",
        allowList: ["127.0.0.1"],
        ban: 2,
    });
    try {
        await exports.server.listen({ port: backendPort, host: "0.0.0.0" });
        console.log(`Server listening on port ${backendPort}`);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
startServer(); // <--- roept de async functie aan
