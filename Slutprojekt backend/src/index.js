import express from 'express';   
import cors from 'cors';
import { getAllProducts, searchProducts, updateProductQuantity } from './products.js'; 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 

let cart = [];



app.get('/products', async (req, res) => {
  const products = await getAllProducts();
  res.status(200).json(products); 
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
  const product = await getAllProducts().then(products => products.find(p => p.id === parseInt(id)));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const existingProduct = cart.find(item => item.id === id);// Check if product is already in the cart
  if (existingProduct) {
    existingProduct.quantity += 1; 
  } else {
    cart.push({ ...product, quantity: 1 }); // Add new product to cart with quantity 1
  }

  res.status(200).json({ cart });
});


// POST ruta za praznjenje kosarice
app.post('/cart/clear', (req, res) => {
  cart = []; 
  res.status(200).json({ message: 'Cart has been cleared' });
});


// POST ruta za checkout
app.post('/cart/checkout', async (req, res) => {
  const { cart: checkoutCart } = req.body;// Extract checkout cart from request body
  if (!checkoutCart || checkoutCart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  try {

    for (const item of checkoutCart) {
      const existingProduct = await getAllProducts().then(products => products.find(p => p.id === item.id));// Check for each item in the product list
      if (!existingProduct || existingProduct.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product ${item.id}` });
      }
      await updateProductQuantity(item.id, item.quantity);
    }

    cart = []; // Clear cart after successful checkout
    res.status(200).json({ message: 'Thank you for buying' });
  } catch (error) {
    return res.status(500).json({ message: 'Error purchasing product', error });
  }
});


app.listen(PORT, () => {
  console.log('Server running on', PORT);
});
