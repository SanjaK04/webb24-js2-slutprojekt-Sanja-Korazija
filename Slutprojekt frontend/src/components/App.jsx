import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';

export function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState('products');
  const [thankYouMessage, setThankYouMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);// Update state with fetched products
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Ensure the server is running.");
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
      />

      {thankYouMessage && <h3 className="thank-you-message">{thankYouMessage}</h3>}

      {!thankYouMessage && currentPage === 'products' && (
        <ProductsPage 
          products={products} 
          setCart={setCart} 
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
