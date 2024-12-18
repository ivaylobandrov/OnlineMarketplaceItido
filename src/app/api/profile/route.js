import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(req) {
  const { currentPassword, newPassword } = await req.json();
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Get the token from the Authorization header

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: 'Token is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    const userId = decoded.id;

    const connection = await createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = rows[0];

    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Incorrect current password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await connection.execute(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?',
      [hashedNewPassword, userId]
    );

    return new Response(
      JSON.stringify({ success: true, message: 'Password updated successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}