//Huvudfilen som hanterar produktlager och kundvagnens status, möjliggör hämtning av produkter, sökning, tillägg till kundvagnen och genomförande av köp.
//Använder rutter för att hämta tillgängliga produkter, söka efter produkter, lägga till och kontrollera kundvagnens status, samt genomföra köp och uppdatera lager.

import path from 'path';
import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import { getAllProducts, searchProducts, updateProductQuantity } from './products.js';

const app = express();
const PORT = 3000;


const productsFilePath = path.join('products.json');  

app.use(cors());
app.use(express.json());

let cart = [];  


app.get('/products', async (req, res) => {
  try {
    const products = await getAllProducts();  

    
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        
        return { ...product, quantity: product.quantity - cartItem.quantity };
      }
      return product;  
    });

    res.status(200).json(updatedProducts);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to fetch products', error: error.message });
  }
});


app.post('/products/search', async (req, res) => {
  const { searchTerm } = req.body;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Please enter a search term' });
  }
  try {
    const filteredProducts = await searchProducts(searchTerm);  
    if (filteredProducts.length === 0) {
      return res.status(404).json({ message: 'No products match the search' });
    }
    res.status(200).json(filteredProducts); 
  } catch (error) {
    res.status(500).json({ message: 'Error searching for products', error: error.message });
  }
});



app.post('/products/aftersearch', async (req, res) => {
  const { searchTerm } = req.body;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Please enter a search term' });
  }

  try {
   
    const filteredProducts = await searchProducts(searchTerm);

    
    const updatedProducts = filteredProducts.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        
        return { ...product, quantity: product.quantity - cartItem.quantity };
      }
      return product; 
    });

    if (updatedProducts.length === 0) {
      return res.status(404).json({ message: 'No products match the search' });
    }

    res.status(200).json(updatedProducts); 
  } catch (error) {
    res.status(500).json({ message: 'Error searching for products', error: error.message });
  }
});


app.post('/cart/add', async (req, res) => {
  const { id, quantity } = req.body;
  console.log(`Adding product ID: ${id} with quantity ${quantity} to cart`);

  const products = await getAllProducts(); 
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingProduct = cart.find(item => item.id === id); 
  if (existingProduct) {
    existingProduct.quantity += quantity; 
  } else {
    cart.push({ ...product, quantity }); 
  }

  
  const updatedCart = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, availableQuantity: product.quantity - item.quantity }; 
  });

  res.status(200).json({ cart: updatedCart });
});


app.get('/cart/state', async (req, res) => {
  try {
    const products = await getAllProducts(); 

    
    const updatedCart = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        return { ...item, availableQuantity: product.quantity };
      }
      return item;
    });

    res.status(200).json({ cart: updatedCart }); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart status', error: error.message });
  }
});


app.post('/cart/clear', async (req, res) => {
  cart = []; 
  try {
    const products = await getAllProducts();  
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2)); 
    res.status(200).json({ message: 'Cart successfully cleared', products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products after clearing cart', error: error.message });
  }
});


app.post('/cart/checkout', async (req, res) => {
  const { cart: checkoutCart } = req.body;
  if (!checkoutCart || checkoutCart.length === 0) {
    return res.status(400).json({ message: 'The cart is empty' });
  }

  try {
    const products = await getAllProducts();  

    
    for (const item of checkoutCart) {
      const existingProduct = products.find(p => p.id === item.id);
      if (!existingProduct || existingProduct.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product ${item.id}` });
      }
     
      await updateProductQuantity(item.id, item.quantity);
    }

   
    cart = [];  

    
    const updatedProducts = await getAllProducts();
    await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2));  

    res.status(200).json({ message: 'Thank you for your purchase!' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing purchase', error });
  }
});


app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
