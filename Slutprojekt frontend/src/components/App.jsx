import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';

export function App() {
  const [cart, setCart] = useState([]);  // Cart state
  const [products, setProducts] = useState([]);  // State za proizvode
  const [currentPage, setCurrentPage] = useState('products');
  const [thankYouMessage, setThankYouMessage] = useState('');

  // Fetch products on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products'); // Provjeri URL
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log(data);  // Provjeri u konzoli
        setProducts(data);  // Postavi proizvode u state
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Ensure the server is running.");
      }
    };
  
    fetchProducts();  // Poziv za dohvat proizvoda
  }, []);  // Empty dependency array (ovo se poziva samo pri mount-u komponente)
  
  return (
    <div>
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setThankYouMessage={setThankYouMessage} 
        cart={cart} // Prosleđujemo cart state navbar-u
      />

      {thankYouMessage && <h3 className="thank-you-message">{thankYouMessage}</h3>}

      {!thankYouMessage && currentPage === 'products' && (
        <ProductsPage 
          products={products} 
          setCart={setCart}  // Prosleđujemo setCart da ažuriramo cart
        />
      )}
      
      {!thankYouMessage && currentPage === 'cart' && (
        <CartPage 
          cart={cart} 
          setCart={setCart} 
          setThankYouMessage={setThankYouMessage} 
        />
      )}
    </div>
  );
}
