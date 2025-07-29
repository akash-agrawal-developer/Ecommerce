

function AddToCart({product,cartItem,setCartItem }) {
      const token = localStorage.getItem("token");
  // First update the backend
  fetch('http://localhost:5000/cart', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ product }),
  })
    .then(res => res.json())
    .then(() => {
      // Then update the frontend state
      setCartItem(prevItems => {
        const exists = prevItems.find(item => item._id === product._id);
        
        if (exists) {
          return prevItems.map(item =>
            item._id === product._id
              ? { ...item, quantity: (item.quantity ?? 1) + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    })
    .catch(err => {
      console.error("Failed to add to cart:", err);
    }); 
}

export default AddToCart