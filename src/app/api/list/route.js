import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function GET(req, res) {
  try {
    const connection = await createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM products');

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query failed:', error);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
}
