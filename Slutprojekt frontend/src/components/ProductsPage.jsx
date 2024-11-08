import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

export function ProductsPage({ products, setCart }) {
  const [cart, setLocalCart] = useState([]);  
  const [productQuantities, setProductQuantities] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  useEffect(() => {
    if (products && products.length > 0) {
      // Početne količine proizvoda sa servera
      const initialQuantities = products.reduce((acc, product) => {
        acc[product.id] = product.quantity; // Postavljanje početne količine
        return acc;
      }, {});
      setProductQuantities(initialQuantities);
    }
    setFilteredProducts(products); 
  }, [products]);

  useEffect(() => {
    // Pohranjivanje količina proizvoda u localStorage svaki put kad se promijene
    localStorage.setItem('productQuantities', JSON.stringify(productQuantities));
  }, [productQuantities]);

  const updateProductQuantity = (productId, newQuantity) => {
    const updatedQuantities = { ...productQuantities, [productId]: newQuantity };
    setProductQuantities(updatedQuantities);
  };

  const clearCart = () => {
    // Očisti košaricu
    setLocalCart([]);
    localStorage.setItem('cart', JSON.stringify([]));

    // Vrati količine proizvoda na početne vrijednosti
    const initialQuantities = products.reduce((acc, product) => {
      acc[product.id] = product.quantity;
      return acc;
    }, {});
    setProductQuantities(initialQuantities); // Resetiraj količine na početne vrijednosti
  };

  const handlePayment = () => {
    // Pretpostavljamo da je plaćanje uspješno i da dobivamo nove količine od backend-a
    fetch('http://localhost:3000/cart/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart }),
    })
      .then(response => response.json())
      .then(data => {
        // Ažuriranje proizvoda prema novim količinama koje dolaze sa servera
        if (data.products) {
          const updatedQuantities = data.products.reduce((acc, product) => {
            acc[product.id] = product.quantity;
            return acc;
          }, {});
          setProductQuantities(updatedQuantities); // Ažuriraj količine sa servera
          setLocalCart([]); // Očisti košaricu nakon uspješne kupovine
          localStorage.setItem('cart', JSON.stringify([])); // Očisti košaricu u localStorage
          alert("Purchase successful! Thank you for your order.");
        } else {
          throw new Error("Invalid response from backend.");
        }
      })
      .catch(error => {
        alert("An error occurred during payment: " + error.message);
      });
  };

  // Funkcija za sortiranje proizvoda po cijeni
  const handleSort = (order) => {
    const sorted = [...filteredProducts].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
    setFilteredProducts(sorted); // Ažurira filtrirane proizvode sa sortiranim rezultatima
  };

  return (
    <div>
      <h2>Products</h2>
      <div>
        <select onChange={(e) => handleSort(e.target.value)}>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              quantity={productQuantities[product.id] || 0}
              setCart={setCart} 
              updateProductQuantity={updateProductQuantity} 
            />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>

      <button onClick={clearCart}>Clear Cart</button>
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
}
