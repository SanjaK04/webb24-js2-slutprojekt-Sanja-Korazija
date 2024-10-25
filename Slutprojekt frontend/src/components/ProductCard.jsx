import React from 'react';

export function ProductCard({ product, setCart }) {
  const addToCart = (product) => {
    if (product.quantity > 0) {   // Check if the product is in stock
      fetch(`http://localhost:3000/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to add product to cart');
          }
          return response.json();
        })
        .then(result => {
           // Update the cart state with the new cart data from the result
          setCart(result.cart);
          alert('Product added to cart!');
        })
        .catch(error => {
          alert(error.message);
        });
    } else {
      alert('Product is out of stock');
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} style={{ maxWidth: '100%', height: 'auto' }} />
      <h3>{product.name}</h3>
      <p>Price: {product.price} SEK</p>
      <p>Available: {product.quantity}</p>
      <button onClick={() => addToCart(product)}>Buy</button>
    </div>
  );
}
