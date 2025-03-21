import { Pool } from 'pg';
import { dbConfig } from './config';
import fs from 'fs';
import path from 'path';

const pool = new Pool(dbConfig);

// Function to execute SQL from a file
export const executeSQLFile = async (filePath: string) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
};

// Export the query function
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};