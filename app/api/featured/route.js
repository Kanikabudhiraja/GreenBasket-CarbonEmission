import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET() {
  try {
    // Connect to database
    await dbConnect();
    
    // Define the main categories we want to feature
    const categories = ['clothing', 'furniture', 'home', 'stationery', 'personal-care', 'accessories'];
    const featuredProducts = [];
    
    // Try to get one highly-rated product from each category
    for (const category of categories) {
      // Find the highest rated product in this category
      const product = await Product.findOne({ category })
        .sort({ rating: -1 }) // Sort by highest rating
        .limit(1);
      
      if (product) {
        featuredProducts.push(product);
      }
    }
    
    // If we don't have 6 products yet, fill with other highly-rated products
    if (featuredProducts.length < 6) {
      // Get categories that we already have products for
      const existingCategories = featuredProducts.map(p => p.category);
      
      // Get additional products from other categories, sorted by rating
      const additionalProducts = await Product.find({ 
        category: { $nin: existingCategories } 
      })
        .sort({ rating: -1 })
        .limit(6 - featuredProducts.length);
        
      featuredProducts.push(...additionalProducts);
    }
    
    return NextResponse.json({ featuredProducts });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 