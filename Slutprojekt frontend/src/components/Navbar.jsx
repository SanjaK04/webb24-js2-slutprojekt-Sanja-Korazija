import React, { useState, useEffect } from 'react';

export function Navbar({ currentPage, setCurrentPage, setThankYouMessage, setProducts, cart }) {

  const [cartItemCount, setCartItemCount] = useState(0);

  // Funkcija koja se poziva kad se košarica ažurira
  useEffect(() => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalItems);  // Ažuriraj broj proizvoda u košarici
  }, [cart]); // Ovaj useEffect se poziva svaki put kad se košarica promijeni

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value.trim();
  
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
  
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Update products state with filtered results
      } else {
        setProducts([]); // If no products found, clear the products state
        alert('No products found.');
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products.");
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
      setProducts(data); // Update products state when navigating
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products.");
    }
  };

  const goToCart = () => {
    setCurrentPage('cart');
    setThankYouMessage('');
  };

  return (
    <nav>
      <button className="nav-button" onClick={goToProducts}>Products</button>
      <button className="nav-button" onClick={goToCart}>
        Cart ({cartItemCount > 0 ? cartItemCount : ''}) {/* Prikazuje broj proizvoda u košarici */}
      </button>
      
      {currentPage === 'products' && (
        <form onSubmit={handleSearch}>
          <input type="text" name="search" placeholder="Search products..." />
          <button type="submit" className="nav-button">Search</button>
        </form>
      )}
    </nav>
  );
}
