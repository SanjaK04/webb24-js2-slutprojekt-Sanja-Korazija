import React from 'react';

export function Navbar({ currentPage, setCurrentPage, setThankYouMessage, setProducts, cart }) {
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0); // Zbroji količinu svih proizvoda u košarici
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value.trim();  // Dobij pretragu iz inputa
    console.log('Search Term:', searchTerm);
  
    try {
      if (!searchTerm) {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);  // Ažuriraj proizvode s originalnim podacima
      } else {
        const response = await fetch('http://localhost:3000/products/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchTerm })
        });
  
        if (!response.ok) {
          throw new Error('No products found');
        }
        const data = await response.json();
        setProducts(data);  // Ažuriraj proizvode s filtriranim rezultatima
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
      setProducts(data); // Update products state with original order from backend
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
      <button className="nav-button" onClick={goToCart}>
        Cart ({getCartItemCount() > 0 ? getCartItemCount() : ''})
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
