// Navbar.jsx
import React from 'react';

export function Navbar({ currentPage, setCurrentPage, setThankYouMessage, setProducts }) {
  
  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value.trim();
    console.log('Search Term:', searchTerm); 
  
    try {
      if (!searchTerm) {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        return;
      }
  
      const response = await fetch('http://localhost:3000/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm }),
      });
  
      console.log('Response Status:', response.status);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Filtered Products:', data); 
        setProducts(data);
      } else {
        setProducts([]);
        alert('No products found.'); 
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Ensure the server is running.");
    }
  };

  const goToProducts = async () => {
    setCurrentPage('products');
    setThankYouMessage('');
  
    try {
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Ensure the server is running.");
    }
  };

  const goToCart = () => {
    setCurrentPage('cart');
    setThankYouMessage('');
  };

  return (
    <nav>
      <button className="nav-button" onClick={goToProducts}>Products</button>
      <button className="nav-button" onClick={goToCart}>Cart</button>
      
      {/* Uvjetno prikazivanje forme za pretraživanje */}
      {currentPage === 'products' && (
        <form onSubmit={handleSearch}>
          <input type="text" name="search" placeholder="Search products..." />
          <button type="submit" className="nav-button">Search</button>
        </form>
      )}
    </nav>
  );
}
