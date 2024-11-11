//products.js: Innehåller funktioner för att läsa, 
//söka och uppdatera produkter från JSON-filen (products.json). 


import fs from "fs/promises"; 
import path from 'path';  

const productsFilePath = path.join('products.json');

let cart = [];

async function getAllProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');  
    const products = JSON.parse(data);  
    return products;
  } catch (error) {
    throw new Error('Failed to read products from file');
  }
}


async function updateProductQuantity(id, purchasedQuantity) {
  const products = await getAllProducts(); 
  const productIndex = products.findIndex((product) => product.id === parseInt(id)); 

  if (productIndex === -1) {
    throw new Error('Product not found');
  }

  if (products[productIndex].quantity < purchasedQuantity) {
    throw new Error('Not enough stock');
  }

 
  products[productIndex].quantity -= purchasedQuantity; 
  
  
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2)); 

  return products[productIndex]; 
}



async function buyProduct(id, quantity) {
  const updatedProduct = await updateProductQuantity(id, quantity);  
  return { message: 'Purchase successful' };
}


async function searchProducts(searchTerm) {
  const products = await getAllProducts();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return filteredProducts;
}

export { getAllProducts, updateProductQuantity, searchProducts, buyProduct };
