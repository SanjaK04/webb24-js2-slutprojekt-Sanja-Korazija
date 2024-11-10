import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

export function ProductsPage({ products, setCart, cart, fetchCartState }) {
  const [productQuantities, setProductQuantities] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Ažuriramo filteredProducts svaki put kada se products promijeni
  useEffect(() => {
    setFilteredProducts(products); // Update filtered products whenever the original products list changes
  }, [products]);

  // Ažuriraj količine proizvoda prema stanju u košarici
  useEffect(() => {
    const initialQuantities = products.reduce((acc, product) => {
      // Ako postoji proizvod u košarici, smanjiti količinu proizvoda na temelju toga
      const cartItem = cart.find(item => item.id === product.id);
      acc[product.id] = cartItem ? product.quantity - cartItem.quantity : product.quantity;
      return acc;
    }, {});
    
    setProductQuantities(initialQuantities);  // Set product quantities when cart or products change
  }, [products, cart]);  // Re-run when products or cart changes

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
        {/* Koristite filteredProducts umjesto products */}
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={productQuantities[product.id] || 0} // Prosljeđivanje količine u ProductCard
            setCart={setCart}
          />
        ))}
      </div>
    </div>
  );
}
