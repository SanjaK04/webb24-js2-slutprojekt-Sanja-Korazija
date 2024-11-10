import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';

export function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState('products');
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [serverError, setServerError] = useState(false);

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

  const handleSearch = async (searchTerm) => {
    try {
      const response = await fetch('http://localhost:3000/products/aftersearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
  
      const data = await response.json();
  
      // Zadrži stare količine proizvoda i samo ažuriraj listu proizvoda
      setProducts((prevProducts) => {
        return data.map((newProduct) => {
          const existingProduct = prevProducts.find(p => p.id === newProduct.id);
          return existingProduct ? { ...newProduct, quantity: existingProduct.quantity } : newProduct;
        });
      });
  
      setServerError(false);
    } catch (error) {
      console.error('Error searching products:', error);
      setServerError(true);
    }
  };
  
  useEffect(() => {
    fetchCartState();
    fetchProducts();
  }, []);

  const updateProductQuantity = (productId, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  return (
    <div>
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setThankYouMessage={setThankYouMessage} 
        setProducts={setProducts}
        cart={cart}
        handleSearch={handleSearch}  // Dodano za pretragu
        serverError={serverError}
      />

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
          updateProductQuantity={updateProductQuantity}
          cart={cart}
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
