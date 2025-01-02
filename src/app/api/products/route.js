import { createConnection } from 'mysql2/promise';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const stock_quantity = parseInt(formData.get('stock_quantity'), 10);
    const user_id = parseInt(formData.get('user_id'), 10); // Ensure user_id is passed
    const image = formData.get('image'); // File object

    if (!name || !price || !stock_quantity || !user_id || !image) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle file upload
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    await mkdir(uploadDir, { recursive: true });

    const fileName = image.name;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, Buffer.from(await image.arrayBuffer()));

    // Save product details in the database
    const connection = await createConnection(dbConfig);
    const [result] = await connection.execute(
      `INSERT INTO products (user_id, name, description, price, stock_quantity, image_path) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        name,
        description,
        price,
        stock_quantity,
        `/uploads/products/${fileName}`,
      ]
    );

    connection.end();

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      product_id: result.insertId,
    });
  } catch (error) {
    console.error('Error uploading product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
