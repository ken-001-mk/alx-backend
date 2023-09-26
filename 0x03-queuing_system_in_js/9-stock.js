const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const port = 1245;

const client = redis.createClient(); // Assumes Redis is running locally

// Promisify Redis methods
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Sample product data
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

// Function to get an item by its ID
function getItemById(itemId) {
  return listProducts.find((product) => product.itemId === itemId);
}

// Express middleware for parsing JSON requests
app.use(express.json());

// Route to get the list of all available products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Function to reserve stock by item ID
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

// Function to get the current reserved stock by item ID
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(`item.${itemId}`);
  return parseInt(reservedStock) || 0;
}

// Route to get product details and current stock by item ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }

  const currentQuantity = await getCurrentReservedStockById(itemId);

  res.json({ ...product, currentQuantity });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }

  const currentQuantity = await getCurrentReservedStockById(itemId);

  if (currentQuantity <= 0) {
    res.json({ status: 'Not enough stock available', itemId });
  } else {
    await reserveStockById(itemId, currentQuantity - 1);
    res.json({ status: 'Reservation confirmed', itemId });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
