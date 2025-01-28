'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Check if the user is an admin
    if (!user || !user.is_admin) {
      window.location.href = '/'; // Redirect if not an admin
      return;
    }

    const fetchProducts = async () => {
      const response = await fetch('/api/list'); // API endpoint to fetch products
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, [user]);

  const handleUpdateProduct = async (product_id, updatedProduct) => {
    console.log('UPDATED PRODUCT: ', updatedProduct);
    console.log('PRODUCT ID: ', product_id);
    await fetch(`/api/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...updatedProduct, product_id }), // Sending updated product details
    });
    // Optionally, refresh the products list or update the state
    // Consider updating the products state directly for better UX
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === product_id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Product Name</th>
            <th className="text-left">Description</th>
            <th className="text-left">Price</th>
            <th className="text-left">Current Quantity</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>
                <input
                  type="text"
                  defaultValue={product.name}
                  onBlur={(e) =>
                    handleUpdateProduct(product.product_id, {
                      name: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={product.description}
                  onBlur={(e) =>
                    handleUpdateProduct(product.product_id, {
                      description: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  defaultValue={product.price}
                  onBlur={(e) =>
                    handleUpdateProduct(product.product_id, {
                      price: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  defaultValue={product.stock_quantity}
                  onBlur={(e) =>
                    handleUpdateProduct(product.product_id, {
                      stock_quantity: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td>
                <button
                  onClick={() =>
                    handleUpdateProduct(product.product_id, {
                      stock_quantity: 0,
                    })
                  } // Example; reset stock
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
