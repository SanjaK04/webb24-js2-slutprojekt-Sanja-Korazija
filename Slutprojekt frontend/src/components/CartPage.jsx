import React from "react";

export function CartPage({ cart, setCart, setThankYouMessage }) {
  
  // Funkcija za brisanje košarice
  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:3000/cart/clear', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      setCart([]); 
      alert('Cart cleared!');
    } catch (error) {
      alert(error.message);
    }
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty.');
      return;
    }
  
    try {
      // Ažuriraj količinu proizvoda na backendu nakon plaćanja
      const updatedProducts = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity - item.quantity, // Ovdje ažuriraj količinu proizvoda u skladu s kupljenim
      }));
  
      // Ažuriraj proizvode na backendu
      await Promise.all(
        updatedProducts.map(product =>
          fetch(`http://localhost:3000/products/${product.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: product.quantity }),
          })
        )
      );
  
      // Nakon uspješnog plaćanja, očisti košaricu i postavi poruku
      const response = await fetch('http://localhost:3000/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to checkout');
      }
  
      const result = await response.json();
      setThankYouMessage(result.message); // Postavi poruku 'Thank you' nakon uspješnog plačanja
      setCart([]); // Očisti košaricu nakon uspješnog plačanja
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p>Name: {item.name}</p>
                <p>Price: {item.price} SEK</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total for this item: {item.price * item.quantity} SEK</p>
              </div>
            </div>
          ))}
          <h3>Total Price: {cart.reduce((total, item) => total + item.price * item.quantity, 0)} SEK</h3>

          <div className="button-container">
            <button className="cart-button" onClick={clearCart}>Clear Cart</button>
            <button className="cart-button" onClick={checkout}>Pay</button>
          </div>
        </div>
      )}
    </div>
  );
}
