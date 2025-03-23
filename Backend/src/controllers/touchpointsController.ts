import {Pool} from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projectd',
    password: 'aardappel',
    port: 5432,
});

export async function getAllDataFromTable(table: string, amount: number = 0) : Promise<any>
{
    const client = await pool.connect();
    try
    {
        if (amount == 0)
        {
            const res = await client.query(`SELECT * FROM ${table}`);
            return res.rows;
        }
        const res = await client.query(`SELECT * FROM ${table} LIMIT ${amount}`);
        return res.rows;
    }
    catch (err)
    {
        console.log(err);
        throw err;
    }
    finally
    {
        client.release();
    }
}