import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function DELETE(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const { product_id } = await req.json();

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: 'Token is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const connection = await createConnection(dbConfig);
    await connection.execute('DELETE FROM products WHERE product_id = ?', [
      product_id,
    ]);

    const [rows] = await connection.execute('SELECT * FROM products');
    connection.end();

    return new Response(JSON.stringify(rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
