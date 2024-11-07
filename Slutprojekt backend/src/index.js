import path from 'path';
import fs from 'fs/promises'; // Ensure fs is imported for file operations
import express from 'express';   
import cors from 'cors';
import { getAllProducts, searchProducts, updateProductQuantity } from './products.js'; 

const app = express();
const PORT = 3000;

// Define the path to the products file
const productsFilePath = path.join('products.json');  // Putanja do JSON datoteke

app.use(cors());
app.use(express.json()); 

let cart = [];


app.get('/products', async (req, res) => {
  try {
    const products = await getAllProducts();  // Dohvati sve proizvode
    res.status(200).json(products);  // Pošaljemo proizvode kao JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});



app.post('/products/search', async (req, res) => {
  const { searchTerm } = req.body;
  
  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }
  try {
    const filteredProducts = await searchProducts(searchTerm);
    
    if (filteredProducts.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    res.status(200).json(filteredProducts); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to search products', error: error.message });
  }
});


app.post('/cart/add', async (req, res) => {
  const { id } = req.body;
  console.log(`Adding product ID: ${id} to cart`);

  const product = await getAllProducts().then(products => products.find(p => p.id === parseInt(id)));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingProduct = cart.find(item => item.id === id); // Provjera da li je proizvod već u košarici
  if (existingProduct) {
    existingProduct.quantity += 1; // Ako je proizvod u košarici, povećaj količinu
  } else {
    cart.push({ ...product, quantity: 1 }); // Dodaj novi proizvod u košaricu
  }

  console.log(cart);
  res.status(200).json({ cart });
});



app.post('/cart/clear', async (req, res) => {
  cart = [];  // Očisti košaricu
  try {
    const products = await getAllProducts(); // Ponovno dohvatiti sve proizvode
    res.status(200).json({ message: 'Cart cleared successfully', products }); // Pošaljemo sve proizvode
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products after clearing cart', error: error.message });
  }
});


app.post('/cart/checkout', async (req, res) => {
  const { cart: checkoutCart } = req.body;
  if (!checkoutCart || checkoutCart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
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


    // Očisti cart
    cart = [];
    res.status(200).json({ message: 'Thank you for your purchase!' });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing products', error });
  }
});



app.listen(PORT, () => {
  console.log('Server running on', PORT);
});
