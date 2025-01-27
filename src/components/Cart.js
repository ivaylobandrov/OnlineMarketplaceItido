'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '@/store/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item));
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.product_id}>
              <div>
                <h3>{item.name}</h3>
                <p>Description: {item.description}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <img
                  src={item.image_path}
                  alt={item.name}
                  width={100}
                  height={100}
                />
                <button onClick={() => handleRemoveItem(item)}>
                  Remove Item
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
