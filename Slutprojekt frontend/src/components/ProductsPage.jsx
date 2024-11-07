import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

export function ProductsPage({ products, setCart }) {
  const [filteredProducts, setFilteredProducts] = useState(products); // U početku filtriraj proizvode s početnim stanjem

  // Kada se products promijene, filtrirani proizvodi će se ažurirati
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSort = (order) => {
    const sorted = [...products].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
    setFilteredProducts(sorted);  // Ažuriraj filtrirane proizvode prema sortiranju
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
            <ProductCard key={product.id} product={product} setCart={setCart} />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

