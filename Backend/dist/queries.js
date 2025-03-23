"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDataFromTable = getAllDataFromTable;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projectd',
    password: 'aardappel',
    port: 5432,
});
async function getAllDataFromTable(table) {
    const client = await pool.connect();
    try {
        const res = await client.query(`SELECT * FROM ${table}`);
        return res.rows;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
    finally {
        client.release();
    }
}
