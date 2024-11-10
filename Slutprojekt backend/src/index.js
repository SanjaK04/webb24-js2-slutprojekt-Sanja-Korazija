import path from 'path';
import express from 'express';   
import fs from 'fs/promises';
import cors from 'cors';
import { getAllProducts, searchProducts, updateProductQuantity } from './products.js'; 

const app = express();
const PORT = 3000;

// Define the path to the products file
const productsFilePath = path.join('products.json');  // Putanja do JSON datoteke

app.use(cors());
app.use(express.json()); 

let cart = [];  // Košarica se čuva u memoriji dok korisnik ne završi kupovinu

// Ruta za dohvaćanje svih proizvoda s ažuriranim količinama prema stanju u košarici
app.get('/products', async (req, res) => {
  try {
    // Dohvati sve proizvode
    const products = await getAllProducts();

    // Ažuriraj količine proizvoda prema stanju u košarici
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        // Ažuriraj količinu proizvoda prema stanju u košarici
        return { ...product, quantity: product.quantity - cartItem.quantity };
      }
      return product; // Ako proizvod nije u košarici, količina ostaje nepromijenjena
    });

    // Pošaljemo ažurirane proizvode
    res.status(200).json(updatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});


// Ruta za pretragu proizvoda
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



// Ruta za dodavanje proizvoda u košaricu
app.post('/cart/add', async (req, res) => {
  const { id } = req.body;
  console.log(`Adding product ID: ${id} to cart`);

  const product = await getAllProducts().then(products => products.find(p => p.id === parseInt(id)));

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingProduct = cart.find(item => item.id === id);  // Provjera da li je proizvod već u košarici
  if (existingProduct) {
    existingProduct.quantity += 1;  // Ako je proizvod u košarici, povećaj količinu
  } else {
    cart.push({ ...product, quantity: 1 });  // Dodaj novi proizvod u košaricu
  }

  console.log(cart);
  res.status(200).json({ cart });
});

// Ruta za dohvaćanje stanja košarice (proizvodi s količinama iz košarice)
app.get('/cart/state', async (req, res) => {
  try {
    const products = await getAllProducts();  // Dohvati sve proizvode

    // Ažuriraj količine proizvoda prema stanju u košarici
    const updatedCart = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        return { ...item, availableQuantity: product.quantity };
      }
      return item;
    });

    res.status(200).json({ cart: updatedCart });  // Pošaljemo ažuriranu košaricu
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart state', error: error.message });
  }
});

// Ruta za čišćenje košarice
app.post('/cart/clear', async (req, res) => {
  cart = [];  // Očisti košaricu
  try {
    const products = await getAllProducts();  // Ponovno dohvatiti sve proizvode
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));  // Osigurajte da se promjene odražavaju u datoteci
    res.status(200).json({ message: 'Cart cleared successfully', products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products after clearing cart', error: error.message });
  }
});

// Ruta za checkout (kupovinu)
app.post('/cart/checkout', async (req, res) => {
  const { cart: checkoutCart } = req.body;
  if (!checkoutCart || checkoutCart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  try {
    const products = await getAllProducts();  // Dohvati sve proizvode

    // Provjerite dostupnost proizvoda u skladištu
    for (const item of checkoutCart) {
      const existingProduct = products.find(p => p.id === item.id);
      if (!existingProduct || existingProduct.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product ${item.id}` });
      }
      // Ažuriraj količinu proizvoda
      await updateProductQuantity(item.id, item.quantity);
    }

    // Nakon što je checkout uspješan, očisti košaricu
    cart = [];  // Očisti košaricu u memoriji
    res.status(200).json({ message: 'Thank you for your purchase!' });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing products', error });
  }
});

// Pokrenite server
app.listen(PORT, () => {
  console.log('Server running on', PORT);
});
