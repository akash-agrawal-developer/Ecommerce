import './home.css';
import products from './data';
import {Link} from 'react-router-dom';
import Carts from './Carts';
import React,{ useState } from 'react';
import AddToCart from './AddToCart';



function Homes({cartItem,setCartItem}){
    



  
    return(
    <div className="home">
        <div className="hero">
              <h1>Welcome to ShopEasy</h1>
               <p>Your one-stop shop for everything!</p>
        </div>
      <h2 className='feature'>Featured Products</h2>
      <div className="product-grid">
        {products.slice(0, 20).map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <Link to={`/products/${product.id}`}>View Details</Link><br /><br />
           <button onClick={() => AddToCart({product,cartItem,setCartItem})}>Add to Cart</button ><br /><br />
          </div>
        ))}
      </div>
      <Link to="/products">
        <button className="view-all-btn">View All Products</button>
      </Link>
      <div className="footer">
         <p>&copy; 2025 ShopEasy. All rights reserved.</p>
      </div>

    </div>
    );
}

export default Homes;