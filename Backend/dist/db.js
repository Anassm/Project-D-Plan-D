"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
const pool = new pg_1.Pool(config_1.dbConfig);
const query = (text, params) => {
    return pool.query(text, params);
};
exports.query = query;
