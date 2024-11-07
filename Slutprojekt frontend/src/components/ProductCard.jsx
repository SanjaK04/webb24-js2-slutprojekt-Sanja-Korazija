import React, { useState } from 'react';

export function ProductCard({ product, setCart }) {
  const [localQuantity, setLocalQuantity] = useState(product.quantity); // Koristi state za prikaz količine

  const addToCart = (product) => {
    if (localQuantity > 0) {
      const updatedProduct = { ...product, quantity: localQuantity - 1 };
      setLocalQuantity(updatedProduct.quantity); // Smanji količinu na frontend-u

      setCart(prevCart => {
        const existingProduct = prevCart.find(item => item.id === product.id);
        
        if (existingProduct) {
          return prevCart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }  // Povećaj količinu
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }]; // Dodaj novi proizvod
        }
      });
    }
  };

  
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name}/>
      <h3>{product.name}</h3>
      <p>Price: {product.price} SEK</p>
      <p>Available: {localQuantity}</p>
      <button onClick={() => addToCart(product)} disabled={localQuantity <= 0}>Buy</button>
    </div>
  );
}
