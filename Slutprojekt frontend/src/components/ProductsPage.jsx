import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

export function ProductsPage({ products, setCart }) {
  const [cart, setLocalCart] = useState([]);  
  const [productQuantities, setProductQuantities] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  useEffect(() => {
    if (products && products.length > 0) {
      const storedQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
      const quantities = products.reduce((acc, product) => {
        acc[product.id] = storedQuantities[product.id] || product.quantity;
        return acc;
      }, {});
      setProductQuantities(quantities);
    }
    setFilteredProducts(products); 
    
  }, [products]);

  const updateProductQuantity = (productId, newQuantity) => {
    const updatedQuantities = { ...productQuantities, [productId]: newQuantity };
    setProductQuantities(updatedQuantities);
  };

  const clearCart = () => {
    setLocalCart([]);
    localStorage.setItem('cart', JSON.stringify([]));

    const resetQuantities = products.reduce((acc, product) => {
      acc[product.id] = product.quantity;
      return acc;
    }, {});
    setProductQuantities(resetQuantities); // Resetira količine nakon pražnjenja
  };

  

  // Function to handle sorting of products based on price
  const handleSort = (order) => {
    const sorted = [...filteredProducts].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
    setFilteredProducts(sorted);// Update filtered products with sorted results
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
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            quantity={productQuantities[product.id] || 0}
            setCart={setCart} 
            updateProductQuantity={updateProductQuantity} 
          />
        ))}
      </div>
  </div>
  );
}
  
        