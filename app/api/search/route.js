import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse the URL to get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    // Perform text search with MongoDB
    const products = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } } // Add text score for sorting
    )
      .sort({ score: { $meta: "textScore" } }) // Sort by text match relevance
      .limit(limit);
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 