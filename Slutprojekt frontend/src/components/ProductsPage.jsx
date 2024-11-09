import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

export function ProductsPage({ products, setCart, fetchCartState }) {
  const [cart, setLocalCart] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  useEffect(() => {
    setFilteredProducts(products); // Update filtered products whenever the original products list changes
  }, [products]);

  // Funkcija za sortiranje proizvoda po cijeni
  const handleSort = (order) => {
    const sorted = [...filteredProducts].sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
    setFilteredProducts(sorted); // Ažurira filtrirane proizvode sa sortiranim rezultatima
  }; 

  useEffect(() => {
    // Početne količine proizvoda se postavljaju na temelju podataka iz products
    const initialQuantities = products.reduce((acc, product) => {
      acc[product.id] = product.quantity; // Postavljanje početnih količina
      return acc;
    }, {});
    setProductQuantities(initialQuantities);
  }, [products]);

  // Funkcija za ažuriranje količine proizvoda
  const updateProductQuantity = (productId, newQuantity) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity, // Ažuriranje količine proizvoda
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
        {/* Koristite filteredProducts umjesto products */}
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={productQuantities[product.id] || 0} // Prosljeđivanje količine u ProductCard
            setCart={setCart}
            updateProductQuantity={updateProductQuantity} // Prosljeđivanje funkcije za ažuriranje količine
          />
        ))}
      </div>
    </div>
  );
}
