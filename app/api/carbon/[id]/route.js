import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

// Baseline carbon emissions by product category (kg CO2e)
const CATEGORY_BASELINES = {
  clothing: 10,
  furniture: 25,
  home: 8,
  'personal-care': 5,
  stationery: 3,
  accessories: 6,
  default: 12
};

// Calculate conventional footprint (3x the sustainable footprint as an estimate)
function getConventionalFootprint(sustainableFootprint) {
  return sustainableFootprint * 3;
}

// Calculate carbon savings compared to conventional products
function calculateCarbonSavings(sustainableFootprint, conventionalFootprint) {
  const savings = conventionalFootprint - sustainableFootprint;
  const percentage = (savings / conventionalFootprint) * 100;
  
  return {
    savings: savings.toFixed(2),
    percentage: percentage.toFixed(0)
  };
}

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
    
    // Get carbon footprint (either from database or calculate it)
    const sustainableFootprint = product.carbonFootprint || 
      CATEGORY_BASELINES[product.category] || CATEGORY_BASELINES.default;
      
    // Get conventional product footprint for comparison
    const conventionalFootprint = getConventionalFootprint(sustainableFootprint);
    
    // Calculate carbon savings
    const savings = calculateCarbonSavings(sustainableFootprint, conventionalFootprint);
    
    return NextResponse.json({
      footprint: sustainableFootprint,
      conventionalFootprint,
      savings
    });
  } catch (error) {
    console.error('Error fetching carbon footprint data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 