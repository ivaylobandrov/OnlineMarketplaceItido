import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
    host: 'Ivaylos-MacBook-Pro.local',
    user: 'root',
    password: 'root',
    database: 'ONLINEMARKETPLACE',
};

// Named export for handling POST requests
export async function POST(req) {
    console.log('SERVER COMPONENT - REGISTER - POST');
    const { username, email, password } = await req.json();

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const connection = await createConnection(dbConfig);

        // Check if the username or email already exists
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length) {
            return new Response(JSON.stringify({ success: false, message: 'Username or email is already taken.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Insert the new user into the database
        await connection.execute('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, passwordHash]);

        return new Response(JSON.stringify({ success: true, message: 'User registered successfully.' }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: 'Internal server error.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}