import React, { useEffect, useState } from 'react'; 
import { ProductCard } from './ProductCard';

export function ProductsPage({ products, setCart }) {
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(products); // Update filtered products whenever the original products list changes
  }, [products]);

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
    {filteredProducts.length > 0 ? (
      filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} setCart={setCart} />
      ))
    ) : (
      <p>No products available.</p>
    )}
  </div>
</div>
)}