import axios from 'axios';


const handlePayment = async ({ amount, cartItem, navigate, setCartItem }) => {

  try {
    // Step 1: Create order from backend
    const order = await axios.post('http://localhost:5000/api/payment/create-order', {
      amount,
    });

    // Step 2: Setup Razorpay options
    const options = {
      key: 'rzp_test_VCS4f4cNdcSMFt', // Razorpay Key ID (not secret)
      amount: order.data.amount,
      currency: order.data.currency,
      name: 'Durgesh E-Commerce Store',
      description: 'Purchase from store',
      order_id: order.data.id,
      handler: async function (response) {
        // Step 3: Call backend to verify payment
        try {
          const verifyRes = await axios.post('http://localhost:5000/api/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyRes.data.status === 'success') {
            alert('✅ Payment verified and successful!');
            console.log('Verified Payment:', verifyRes.data);
            // TODO: Save order/cart info to DB here if needed
               


              try{
                const token = localStorage.getItem('token');
                console.log("🔐 Sending token to save order:", token);

                const orderRes = await fetch('http://localhost:5000/api/orders',{
                  method: 'POST',
                  headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                     items: cartItem,
                    totalAmount: amount,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,

                  }),
                });

                const savedOrder = await orderRes.json();

                  if (orderRes.ok) {
                          console.log('Order saved:', savedOrder);
                          // Optional: Clear cart
                          localStorage.removeItem('cart'); 
                          setCartItem([]);
                          navigate('/order');
                    } else {
                       alert('❌ Failed to save order');
                   }
                  } catch (err) {
                   console.error('Order save error:', err);
                   alert('❌ Could not save order to database');
               }
           }
         else {
            alert('❌ Payment verification failed');
          }
        } catch (err) {
          console.error("Verification error", err);
          alert("Error verifying payment.");
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment initiation failed:", error);
    alert("Failed to initiate payment.");
  }
};


export default handlePayment;