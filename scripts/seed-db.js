import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from '../lib/db.js';
import mongoose from 'mongoose';

// Create __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the Product model
let Product;
try {
  // Try to import using ES modules syntax
  const { default: ProductModel } = await import('../lib/models/Product.js');
  Product = ProductModel;
} catch (error) {
  console.error('Error importing Product model:', error);
  process.exit(1);
}

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await dbConnect();
    console.log('Connected to MongoDB');
    
    // Read the products JSON file
    const productsFilePath = path.join(__dirname, '../lib/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    
    // Clear existing products collection
    console.log('Clearing existing products collection...');
    await Product.deleteMany({});
    
    // Insert products
    console.log(`Seeding ${productsData.length} products...`);
    await Product.insertMany(productsData);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedDatabase(); 