import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';

export function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState('products');
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [serverError, setServerError] = useState(false);  // Dodan state za server error

  const fetchCartState = async () => {
    try {
      const response = await fetch('http://localhost:3000/cart/state');
      if (!response.ok) {
        throw new Error('Failed to fetch cart state');
      }
      const data = await response.json();
      setCart(data.cart);
      setServerError(false);
    } catch (error) {
      console.error('Error fetching cart state:', error);
      setServerError(true);
    }
  };

  useEffect(() => {
    fetchCartState();

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setServerError(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setServerError(true);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setThankYouMessage={setThankYouMessage} 
        setProducts={setProducts}
        cart={cart}
        serverError={serverError} // Prosljeđujemo serverError u Navbar
      />

      {/* Prikazivanje samo jedne poruke o grešci */}
      {serverError && (
        <h3 className="error-message">
          The server is currently unavailable. Please try again later.
        </h3>
      )}

      {thankYouMessage && <h3 className="thank-you-message">{thankYouMessage}</h3>}

      {!thankYouMessage && currentPage === 'products' && !serverError && (
        <ProductsPage 
          products={products} 
          setCart={setCart} 
          fetchCartState={fetchCartState} 
        />
      )}
      {!thankYouMessage && currentPage === 'cart' && !serverError && (
        <CartPage 
          cart={cart} 
          setCart={setCart} 
          setThankYouMessage={setThankYouMessage} 
        />
      )}
    </div>
  );
}
