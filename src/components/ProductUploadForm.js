'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from '@/components/NavBar';

export default function ProductUploadForm() {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image: null,
  });

  const [uploadStatus, setUploadStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Add the user_id from Redux store to the form data
    if (user?.id) {
      data.append('user_id', user.id); // Make sure the `user_id` is set
    } else {
      setUploadStatus('User not logged in or user ID is missing.');
      return;
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        // Now, index the product in Elasticsearch
        const indexResponse = await fetch('/api/index', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: result.product_id, // Assuming result.productId contains the new product ID
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock_quantity: formData.stock_quantity,
            image_path: `/uploads/products/${formData.image.name}`,
          }),
        });

        // Check if the indexing was successful
        const indexResult = await indexResponse.json();
        if (indexResult.result) {
          setUploadStatus('Product indexed successfully in Elasticsearch!');
        } else {
          setUploadStatus(
            'Product uploaded, but failed to index in Elasticsearch.'
          );
        }

        setUploadStatus('Product uploaded successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          stock_quantity: '',
          user_id: '',
          image: null,
        });
      } else {
        setUploadStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error uploading product:', error);
      setUploadStatus('Error uploading product.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
            Upload a Product
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full"
            >
              Upload Product
            </button>
          </form>
          {uploadStatus && (
            <p className="mt-4 text-sm text-gray-700 text-center">
              {uploadStatus}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
