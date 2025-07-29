import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className='navh1'>ShopEasy</h1>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/carts">Cart</Link>
    </nav>
  );
}

export default Navbar;
