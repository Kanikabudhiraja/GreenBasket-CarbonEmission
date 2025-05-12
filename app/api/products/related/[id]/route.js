import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request, { params }) {
  try {
    // Connect to database
    await dbConnect();
    
    // Await params before using its properties
    const unwrappedParams = await params;
    const { id } = unwrappedParams;
    const productId = parseInt(id);
    
    // Find the original product to get its category
    const originalProduct = await Product.findOne({ id: productId });
    
    if (!originalProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Find related products from the same category, excluding the original product
    const relatedProducts = await Product.find({ 
      category: originalProduct.category,
      id: { $ne: productId }
    })
      .sort({ rating: -1 }) // Sort by highest rating
      .limit(4); // Limit to 4 related products
    
    return NextResponse.json({ relatedProducts });
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 