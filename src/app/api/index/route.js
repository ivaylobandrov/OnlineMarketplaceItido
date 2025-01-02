import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'https://localhost:9200', // Your Elasticsearch URL
  auth: {
    username: 'elastic', // Your username
    password: '*dcqpfsKo_n_t3Deplq0', // Your password
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificate
  },
});

export async function POST(req, res) {
  const { id, name, description, price, stock_quantity, image_path } =
    await req.json();

  if (!id || !name || !description || !price) {
    return new Response(
      JSON.stringify({ error: 'No product_id, name, description or price!' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const response = await client.index({
      index: 'products', // Make sure to use your actual index name
      id: id,
      body: {
        name: name,
        description: description,
        price: price,
        stock_quantity: stock_quantity,
        image_path: image_path,
      },
    });

    return new Response(JSON.stringify({ result: response.body }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Elasticsearch query failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to index product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
