import React, { useState, useEffect } from 'react';

export function Navbar({ currentPage, setCurrentPage, setThankYouMessage, setProducts, cart }) {

  const [cartItemCount, setCartItemCount] = useState(0);

  // Funkcija koja se poziva kad se košarica ažurira
  useEffect(() => {
    // Dohvati stanje košarice i ažurirane količine
    const fetchCartState = async () => {
      try {
        const response = await fetch('http://localhost:3000/cart/state');
        if (response.ok) {
          const data = await response.json();
          // Računanje ukupnog broja proizvoda u košarici
          const totalItems = data.cart.reduce((total, item) => total + item.quantity, 0);
          setCartItemCount(totalItems);
        } else {
          alert('Failed to fetch cart state.');
        }
      } catch (error) {
        alert('Error fetching cart state.');
      }
    };

    fetchCartState();
  }, [cart]); // Ažuriraj svaki put kad se košarica promijeni

  
  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value.trim();
  
    if (!searchTerm) {
      alert("Please enter a search term");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/products/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Filtered products from search:', data);  // Logiranje rezultata pretrage
        setProducts(data); // Postavljanje filtriranih proizvoda na frontend
      } else {
        const result = await response.json();
        alert(result.message || 'Error occurred during search');
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
      setProducts(data); // Ažuriraj state sa svim proizvodima
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
