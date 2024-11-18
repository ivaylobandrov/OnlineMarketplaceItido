import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dbConfig = {
  host: 'Ivaylos-MacBook-Pro.local',
  user: 'root',
  password: 'root',
  database: 'ONLINEMARKETPLACE',
};

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    const connection = await createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      const user = rows[0];

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (isValidPassword) {
        const token = jwt.sign({ id: user.user_id }, 'your_secret_key', {
          expiresIn: '1h',
        });
        return new Response(JSON.stringify({ success: true, token }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid username or password',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
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
