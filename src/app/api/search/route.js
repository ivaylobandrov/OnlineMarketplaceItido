import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: '*dcqpfsKo_n_t3Deplq0',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query || !query.text) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await client.search({
      index: 'products',
      body: {
        query: {
          match: { name: query.text }, // Assuming you want to search by product name
        },
      },
    });

    // Check hits
    const hits = response.hits.hits;
    if (hits.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(hits.map((hit) => hit._source)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Elasticsearch query failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to perform search' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
