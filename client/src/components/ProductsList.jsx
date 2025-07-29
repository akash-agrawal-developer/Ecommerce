import { Link } from 'react-router-dom';
import products from './data';
import AddToCart from './AddToCart';

function ProductsList({cartItem,setCartItem}) {


  return (
    <div className="product-grid">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <img src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
          <p>${product.price}</p>
          <Link to={`/products/${product.id}`}>View Details</Link><br />
          <button onClick={() => AddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default ProductsList;
