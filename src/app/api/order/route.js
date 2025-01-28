import { createConnection } from 'mysql2/promise';
import { sendEmail } from '@/utils/sendEmail';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  const { items } = await req.json();

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: 'Token is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Create the database connection
    const connection = await createConnection(dbConfig);

    // Start a transaction to ensure all quantities are updated
    await connection.beginTransaction();

    for (const item of items) {
      const product_id = item.product_id;
      // The SQL query to reduce the quantity of the product by 1
      const [rows] = await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - 1 WHERE product_id = ?',
        [product_id]
      );

      if (rows.affectedRows === 0) {
        console.log(`Product with ID ${product_id} not found`);
      }

      const [updatedProduct] = await connection.query(
        'SELECT p.name, u.email FROM products p JOIN users u ON p.user_id = u.user_id WHERE p.product_id = ?',
        [product_id]
      );

      if (updatedProduct[0] && updatedProduct[0].stock_quantity === 0) {
        const { name, email } = updatedProduct[0];
        await sendEmail(
          email,
          'Product Out of Stock Notification',
          `Your product "${name}" is now out of stock.`
        );
      } else {
        console.log(
          `Product with ID ${product_id} not found or already at zero stock.`
        );
      }
    }

    // Commit the transaction
    await connection.commit();

    return new Response(
      JSON.stringify({ success: true, message: 'Stock updated successfully' }),
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
