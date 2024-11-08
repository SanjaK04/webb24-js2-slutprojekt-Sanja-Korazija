import React, { useEffect } from "react";

export function CartPage({ cart, setCart, setThankYouMessage }) {
  // Dohvati košaricu iz localStorage prilikom učitavanja stranice
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));  // Ako postoji košarica u localStorage, postavi je u state
    }
  }, [setCart]);

  // Funkcija za brisanje košarice
  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:3000/cart/clear', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      setCart([]); 
      localStorage.setItem('cart', JSON.stringify([]));  // Brišemo košaricu iz localStorage
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
      // Ažuriranje količina proizvoda na backendu
      const updatedProducts = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity - item.quantity, // Smanjujemo količinu za broj u košarici
      }));

      await Promise.all(
        updatedProducts.map(product =>
          fetch(`http://localhost:3000/products/${product.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: product.quantity }),
          })
        )
      );

      const response = await fetch('http://localhost:3000/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        throw new Error('Failed to checkout');
      }

      const result = await response.json();
      setThankYouMessage(result.message);
      setCart([]);  // Resetiramo košaricu u aplikaciji
      localStorage.setItem('cart', JSON.stringify([]));  // Brišemo košaricu iz localStorage
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
