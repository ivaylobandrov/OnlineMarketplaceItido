'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import Link from 'next/link';

const ProductListing = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [cart, setCart] = useState([]);

  useEffect(() => {
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

  const handleDelete = async (product_id) => {
    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ product_id: product_id }),
      });

      if (!response.ok) {
        throw new Error('Delete request failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchTerm) {
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

  const addToCartHandler = (product) => {
    const existingProduct = cart.find(
      (item) => item.product_id === product.product_id
    );
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    dispatch(addToCart(product));
    setUploadStatus(`${product.name} added to cart.`);
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <Link href="/cart">Go to Cart</Link>
      </div>
      <form
        onSubmit={handleSearch}
        className="mb-4 flex items-center space-x-2"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products"
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Search
        </button>
      </form>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <li
            key={product.product_id}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <div className="flex flex-col items-center">
              <Image
                src={
                  `/uploads/products/${product.image_path}`
                    ? product.image_path
                    : '/default-image.png'
                }
                alt={product.name}
                width={200}
                height={200}
                className="mb-4 rounded"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-xl font-bold my-2">Price: ${product.price}</p>
              <p className="text-gray-600">
                Stock Quantity: {product.stock_quantity}
              </p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleDelete(product.product_id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
                <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">
                  See details
                </button>
                <button
                  onClick={() => addToCartHandler(product)}
                  className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductListing;
