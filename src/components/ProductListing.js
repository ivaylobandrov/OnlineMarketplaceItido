'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/list');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchTerm) {
      // Optionally, display a message when the search term is empty
      setUploadStatus('Please enter a search term.');
      return;
    }

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: { text: searchTerm } }),
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const results = await response.json();

      if (results.length === 0) {
        setUploadStatus('No products found for your search.');
        setProducts([]); // Clear products if no results
      } else {
        setProducts(results); // Set the products state with full objects
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <div>
      <h1>Product Listing</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products"
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {products.map((product) => (
          <li key={product.product_id}>
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Stock Quantity: {product.stock_quantity}</p>
              <Image
                src={
                  `/uploads/products/${product.image_path}`
                    ? product.image_path
                    : '/default-image.png'
                }
                alt={product.name}
                width={200}
                height={200}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductListing;
