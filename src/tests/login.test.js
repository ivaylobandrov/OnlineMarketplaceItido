import { createConnection } from 'mysql2/promise';
import { POST } from '@/app/api/login/route';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('mysql2/promise');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('API: Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token on successful login', async () => {
    const mockUser = {
      user_id: 1,
      username: 'testuser',
      password_hash: await bcrypt.hash('password123', 10),
      is_admin: 1,
    };

    createConnection.mockResolvedValue({
      execute: jest.fn().mockResolvedValue([[mockUser]]),
    });

    jwt.sign.mockReturnValue('mock_token');

    const response = await POST(
      new Request('http://localhost/api/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    const result = await response.json();

    expect(result).toEqual({ success: true, token: 'mock_token' });
    expect(response.status).toBe(200);
  });

  it('should return 401 for invalid credentials', async () => {
    createConnection.mockResolvedValue({
      execute: jest.fn().mockResolvedValue([[]]),
    });

    const response = await POST(
      new Request('http://localhost/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username: 'invaliduser',
          password: 'wrongpassword',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    const result = await response.json();
    expect(result).toEqual({
      success: false,
      message: 'Invalid username or password',
    });
    expect(response.status).toBe(401);
  });

  it('should return 500 on internal error', async () => {
    createConnection.mockImplementation(() => {
      throw new Error('Connection failed');
    });

    const response = await POST(
      new Request('http://localhost/api/login', {
        method: 'POST',
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    const result = await response.json();
    expect(result).toEqual({
      success: false,
      message: 'Internal server error',
    });
    expect(response.status).toBe(500);
  });
});
