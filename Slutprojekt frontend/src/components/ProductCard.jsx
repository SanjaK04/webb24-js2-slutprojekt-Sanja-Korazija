import React from 'react';

export function ProductCard({ product, quantity, setCart, updateProductQuantity }) {
  const handleAddToCart = () => {
    if (quantity > 0) {
      // Smanji količinu proizvoda na frontendu
      updateProductQuantity(product.id, quantity - 1);

      // Dodaj proizvod u košaricu na backendu
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
          setCart(result.cart); // Ažurira košaricu
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
      <p>Available: {quantity}</p> {/* Prikazivanje dostupne količine */}
      <button onClick={handleAddToCart} disabled={quantity <= 0}>Buy</button>
    </div>
  );
}
