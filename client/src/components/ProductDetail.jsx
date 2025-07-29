import { useParams } from 'react-router-dom';
import products from './data';
import AddToCart from './AddToCart';

function ProductDetail({cartItem,setCartItem}) {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <button onClick={() => AddToCart({product,cartItem,setCartItem})}>Add to Cart</button>
    </div>
  );
}

export default ProductDetail;
