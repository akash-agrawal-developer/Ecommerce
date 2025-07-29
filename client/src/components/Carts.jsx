import './Carts.css'
import React, { useState,useEffect } from 'react';
import handlePayment from './handlePayment';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Carts({cartItem, setCartItem}){
 
     const navigate = useNavigate();
     
  // for fetching data from cart 
//  useEffect(() => {fetch('http://localhost:5000/cart')
//    .then(res => res.json())
//    .then(data => setCartItem(data))
//    .catch((err) => console.error('error fetching cart : ', err));
//   },[]);





    useEffect(() => {
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
 

    try {
      const res = await fetch("http://localhost:5000/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 👈 Make sure token is not null
        },
      });


      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to fetch cart");
      }

      const data = await res.json();

      setCartItem(data);
    } catch (err) {
      console.error("❌ [Frontend] Error fetching cart:", err);
    }
  };

  fetchCart();
}, []);







    const increment = (itemId) => {
      const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/cart/${itemId}/increment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((updatedItem) => {
        // Update frontend state
        setCartItem(prevItems =>
          prevItems.map(item =>
            item._id === itemId ? { ...item, quantity: updatedItem.quantity } : item
          )
        );
      })
      .catch(err => console.error("Failed to increment:", err));
  };



  const decrement = (itemId) => {
  
     const token = localStorage.getItem("token");
    
    fetch(`http://localhost:5000/cart/${itemId}/decrement`,{
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      })
      .then(res => res.json())
      .then((updatedItem) => {
           setCartItem(prevItems =>prevItems.map(item =>
                       item._id === itemId ? { ...item, quantity: updatedItem.quantity }: item)
    );
      })
      .catch(err => console.error("Failed to decrement:", err));
  };
    
 function filterItem(itemtoremove){
    
    const token = localStorage.getItem("token");

    // Step 1: Remove from backend
     fetch(`http://localhost:5000/cart/${itemtoremove._id}`,{
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
 })
 .then(res => {
    if(!res.ok){
       throw new Error('Failed to delete from Backend');
    }
    // Step 2: Update frontend state
      setCartItem(prevItem => prevItem.filter(item => item._id!== itemtoremove._id));
 })
  .catch((err) => console.error("error deleting item",err));
 }  

  const calculatesubtotal = () => {
    return cartItem.reduce((total,item) => {
        const quantity = item.quantity ?? 1;
        return total + (quantity * item.price);
    },0); 
  }


  const subtotal = calculatesubtotal();
  const tax = 23;
  const amount = (subtotal + tax).toFixed(2);


    const handleLogout = () => {
    // Clear auth token (or user data)
    localStorage.removeItem('token'); // or removeItem('user') if stored
    navigate('/login'); // redirect to login page
  };

    return(
      <div className="mainwrapper">
       <div className="logout">
             <Link to="/order" className='linkorder'>Order</Link>
             <button onClick={handleLogout} className="logbtn">
              Logout
              </button>
       </div>
       <div  className="cart">
        <div className='cartWrapper'>
      {cartItem.length === 0 ? (
        <p className='cartP'>Your cart is empty.</p>
      ) : (
        <ul className="cart-grid">
            <li className='cartheaddetails'>
            <h3>Products</h3>
            <h3>Price</h3>
            <h3>Quantity</h3>
            <h3>Subtotal</h3>
          </li>
          {cartItem.map((item, index) => (
            <li key={index} className="cart-card">
              <img src={item.image} alt={item.title} width='80px' height='80px' />
              <p>{item.title}</p>
              <p>${item.price}</p>
              <div className="qty-control">
                  <button onClick={() => decrement(item._id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increment(item._id)}>+</button>
                </div>
              <p>${(item.quantity*item.price).toFixed(2)}</p>
              <button onClick={() => filterItem(item)} className='removebtn'>Remove</button><br />
            </li>
          ))}
        </ul>
      )}
      </div>
     
     {cartItem.length !== 0 && (
  <div className="bill">
    <div className="billDetail">
      <h2>Order Details</h2>
      <p>Subtotal: $ {(subtotal).toFixed(2)} </p>
      <p>Tax: $23</p><br />
      <p>Total Amount: $ {amount}</p>
      <button onClick={ () => handlePayment({ amount, cartItem, navigate , setCartItem })}>Pay</button>
    </div>
  </div>
)}

</div>
</div>
    );
}

export default Carts

