import fs from "fs/promises"; 
import path from 'path';  

const productsFilePath = path.join('products.json');


let cart = [];



async function getAllProducts() {
  const data = await fs.readFile(productsFilePath, 'utf-8');
  const products = JSON.parse(data);
  return products;
}


async function updateProductQuantity(id, purchasedQuantity) {
  const products = await getAllProducts(); 
  const productIndex = products.findIndex((product) => product.id === parseInt(id)); // Find the index of the product

  if (productIndex === -1) {
    throw new Error('Product not found');
  }

// Check if there is enough stock available
  if (products[productIndex].quantity < purchasedQuantity) {
    throw new Error('Not enough stock');
  }

// Update the product quantity
  products[productIndex].quantity -= purchasedQuantity; 
  
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

  return products[productIndex]; 
}


async function buyProduct(id, quantity) {
  const updatedProduct = await updateProductQuantity(id, quantity);  // Call the update function
  return { message: 'Purchase successful' };
}


async function searchProducts(searchTerm) {
  const products = await getAllProducts();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())// Filter products by name
  );
  return filteredProducts;
}

export { getAllProducts, updateProductQuantity, searchProducts, buyProduct };
