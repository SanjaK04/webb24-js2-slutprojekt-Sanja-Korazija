import React, { useState, useEffect } from 'react';

export function Navbar({ currentPage, setCurrentPage, setThankYouMessage, setProducts, cart, setCart }) {
  const [cartItemCount, setCartItemCount] = useState(0);

  // Prati promjene u `cart` i ažuriraj `cartItemCount`
  useEffect(() => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalItems);
  }, [cart]); // Reagira na promjene u košarici

  // Funkcija za ažuriranje stanja košarice
  const fetchCartState = async () => {
    try {
      const response = await fetch('http://localhost:3000/cart/state');
      if (!response.ok) {
        throw new Error('Failed to fetch cart state');
      }
      const data = await response.json();
      setCart(data.cart);
    } catch (error) {
      console.error('Error fetching cart state:', error);
    }
  };

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
        setProducts(data);
      } else {
        const result = await response.json();
        alert(result.message || 'Error occurred during search');
      }
    } catch (error) {
      alert("Failed to load products.");
    }
  };

  const goToProducts = async () => {
    setCurrentPage('products');
    setThankYouMessage('');
    await fetchCartState(); // Osiguraj da se stanje košarice ažurira kada se ide na proizvode

    try {
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
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
        Cart ({cartItemCount > 0 ? cartItemCount : ''})
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
