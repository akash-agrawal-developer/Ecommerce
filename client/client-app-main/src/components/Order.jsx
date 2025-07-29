// src/pages/Order.js
import React, { useEffect, useState } from 'react';
import './Order.css';

function Order() {
  const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/api/orders');
  //       const data = await response.json();
  //       setOrders(data);    
  //     } catch (error) {
  //       console.error('Failed to fetch orders:', error);
  //     }
  //   };

  //   fetchOrders();
  // }, []);


useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔐 Get token from localStorage

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ Attach token here
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error);
    }
  };

  fetchOrders();
}, []);





  return (
    <div className="order-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders placed yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order, index) => (
            <div className="order-card" key={order._id || index}>
              <h3>Order #{order._id?.slice(-6) || index + 1}</h3>
              <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment ID:</strong> {order.paymentId}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div className="order-items">
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.title} x {item.quantity} - ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="order-date">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
