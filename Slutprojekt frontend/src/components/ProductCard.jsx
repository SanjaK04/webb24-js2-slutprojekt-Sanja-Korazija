//Grundläggande stil för produktkort, inklusive marginaler och padding

import React from 'react';

export function ProductCard({ product, quantity, setCart, updateProductQuantity }) {
  const handleAddToCart = () => {
    if (quantity > 0) {
      
      updateProductQuantity(product.id, quantity - 1);

      
      fetch(`http://localhost:3000/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id, quantity: 1 }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to add product to cart');
          }
          return response.json();
        })
        .then(result => {
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
      <p>Available: {quantity}</p>
      <button onClick={handleAddToCart} disabled={quantity <= 0}>Buy</button>
    </div>
  );
}
