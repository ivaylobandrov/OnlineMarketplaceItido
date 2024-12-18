'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';

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
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Upload a Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Stock Quantity</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload Product
        </button>
      </form>
      {uploadStatus && (
        <p className="mt-4 text-sm text-gray-700">{uploadStatus}</p>
      )}
    </div>
  );
}