// Visar alla produkter med möjlighet till sortering. Använder komponenten ProductCard för att visa enskilda produkter.

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

export function ProductsPage({ products, setCart, fetchCartState }) {
  const [cart, setLocalCart] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(products); 
  }, [products]);

  
  const handleSort = (order) => {
    const sorted = [...filteredProducts].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
    setFilteredProducts(sorted); 
  }; 

  useEffect(() => {
    
    const initialQuantities = products.reduce((acc, product) => {
      acc[product.id] = product.quantity; 
    }, {});
    setProductQuantities(initialQuantities);
  }, [products]);
  
  
  const updateProductQuantity = (productId, newQuantity) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity, 
    }));
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
