import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { query, executeSQLFile } from './db';
import path from 'path';

const app = fastify({ logger: true });

// Execute SQL file on startup
const initializeDatabase = async () => {
  const sqlFilePath = path.join(__dirname, 'sql', 'schema.sql');
  try {
    await executeSQLFile(sqlFilePath);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1); // Exit if database initialization fails
  }
};

// GET /users endpoint
app.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await query('SELECT * FROM users');
    reply.send(result.rows);
  } catch (err) {
    app.log.error(err);
    reply.status(500).send({ error: 'Server error' });
  }
});

// Start the server
const start = async () => {
  await initializeDatabase(); // Initialize the database first
  try {
    await app.listen({ port: 3000 });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();