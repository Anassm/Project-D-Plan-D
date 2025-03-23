"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const touchpointsRoutes_1 = require("./routes/touchpointsRoutes");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.server = (0, fastify_1.default)();
const port = 3000;
(0, touchpointsRoutes_1.showRoutes)(exports.server);
exports.server.listen({ port: Number(process.env.API_PORT) }, function (err, address) {
    if (err) {
        exports.server.log.error(err);
        process.exit(1);
    }
    console.log(`Server listening on port ${port}`);
});
