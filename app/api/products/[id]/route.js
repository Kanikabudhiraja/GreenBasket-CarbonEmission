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
    
    // Find product by ID
    const product = await Product.findOne({ id: productId });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 