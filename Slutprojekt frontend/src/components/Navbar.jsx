//Möjliggör navigering mellan sidor (produkter och kundvagn). Implementerar produkt-sökning.

import React, { useState, useEffect } from 'react';

export function Navbar({ currentPage, setCurrentPage, setThankYouMessage, setProducts, cart, disabled }) {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchCartState = async () => {
      try {
        const response = await fetch('http://localhost:3000/cart/state');
        if (response.ok) {
          const data = await response.json();
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
  }, [cart]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value.trim();

    if (!searchTerm) {
      alert("Please enter a search term");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/products/aftersearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm }),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data); 
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
      setProducts(data);
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
      <button 
        className="nav-button" 
        onClick={goToProducts} 
        disabled={disabled}
      >
        Products
      </button>
      <button 
        className="nav-button" 
        onClick={goToCart} 
        disabled={disabled}
      >
        Cart ({cartItemCount > 0 ? cartItemCount : ''})
      </button>

      {currentPage === 'products' && (
        <form onSubmit={handleSearch}>
          <input type="text" name="search" placeholder="Search products..." disabled={disabled} />
          <button type="submit" className="nav-button" disabled={disabled}>Search</button>
        </form>
      )}
    </nav>
  );
}
