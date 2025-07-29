import { useState } from 'react'
import Homes from './components/Homes.jsx';
import ProductsList from './components/ProductsList.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'; 
import Navbar from './components/navbar.jsx';
import Carts from './components/Carts.jsx';
import Order from './components/Order.jsx';
import Logins from './components/Logins.jsx';
import Signup from './components/Signup.jsx';

const isLoggedIn = localStorage.getItem('token');

function App() {
    const [cartItem,setCartItem] = useState([]);

  return(
    <BrowserRouter>
    <Navbar />
       <Routes>
          <Route path='/' element={<Homes cartItem={cartItem} setCartItem={setCartItem} />} />
          <Route path='/products' element={<ProductsList cartItem={cartItem} setCartItem={setCartItem} />} />
          <Route path="/products/:id" element={<ProductDetail cartItem={cartItem} setCartItem={setCartItem} />} />
          <Route path="/carts" element={isLoggedIn ? <Carts cartItem={cartItem} setCartItem={setCartItem} /> : <Navigate to="/login" />} />
          <Route path="/order" element={<Order cartItem={cartItem} setCartItem={setCartItem} />} />
          <Route path='/login' element={<Logins />} />
          <Route path='/signup' element={<Signup />} />
       </Routes>
    </BrowserRouter>
    
  );
}

export default App
