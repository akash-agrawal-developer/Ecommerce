import './logincss.css';
import React, {useState} from 'react';


function Logins(){

  const [email, setemail] = useState('');
    const [password,setpassword] = useState('');
  
      const handleSubmit = async (e) => {
      e.preventDefault();
  
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    
      const data = await res.json();
  
      if (res.ok){
        localStorage.setItem('token',data.token);
        alert('login successful');
        window.location.href='/carts';
      }
      else{
        alert(data.message);
      }
    }



    return(
   <div className="form-container">
       <h2 className='h2'>Login</h2>
     <form className='form' onSubmit={handleSubmit}>
       <input type="email" placeholder="Email" required onChange={ (e) => setemail(e.target.value)} />
       <input type="password" placeholder="Password" required onChange={ (e) => setpassword(e.target.value)} />
       <button type="submit">Login</button>
     </form>
     <p className="link">Don't have an account? <a href="/signup">Sign up</a></p>
  </div>
    );
}

export default Logins