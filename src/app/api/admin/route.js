import { createConnection } from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function PUT(req) {
  const { id } = req.query; // Get product ID from the URL

  try {
    const updatedProduct = await req.json(); // Listen for an updated product in the body

    // Extract product details (you can customize this based on your needs)
    const { name, description, price, stock_quantity } = updatedProduct;

    // Check required fields are present
    if (!name || isNaN(price) || isNaN(stock_quantity)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    const connection = await createConnection(dbConfig);

    // Execute the SQL UPDATE statement
    const updateQuery = `
      UPDATE products 
      SET 
        name = ?, 
        description = ?, 
        price = ?, 
        stock_quantity = ?
      WHERE product_id = ?`;

    const values = [
      name,
      description,
      price,
      stock_quantity,
      id, // Add product_id at the end
    ];

    const [result] = await connection.execute(updateQuery, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    connection.end(); // Close connection

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
