import fs from "fs/promises"; 
import path from 'path';  

const productsFilePath = path.join('products.json');


let cart = [];



async function getAllProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');  // Čitanje podataka iz JSON-a
    const products = JSON.parse(data);  // Parsiranje JSON podataka u JavaScript objekte
    return products;
  } catch (error) {
    throw new Error('Failed to read products from file');
  }
}


async function updateProductQuantity(id, purchasedQuantity) {
  const products = await getAllProducts(); 
  const productIndex = products.findIndex((product) => product.id === parseInt(id)); // Pronađi proizvod

  if (productIndex === -1) {
    throw new Error('Product not found');
  }

  if (products[productIndex].quantity < purchasedQuantity) {
    throw new Error('Not enough stock');
  }

  // Ažuriraj količinu proizvoda
  products[productIndex].quantity -= purchasedQuantity; 
  
  // Spremi ažurirani niz proizvoda
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
