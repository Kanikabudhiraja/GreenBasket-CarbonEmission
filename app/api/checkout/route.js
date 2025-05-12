import { NextResponse } from 'next/server';
import { stripe, createCheckoutSession } from '@/lib/stripe-server';
import { getToken } from 'next-auth/jwt';

export async function POST(request) {
  try {
    console.log('🔶 Checkout API route called');
    
    const { items, couponCode } = await request.json();
    
    // Get token for user information
    const token = await getToken({ req: request });
    
    console.log('👤 User token:', token?.email || 'No user token');
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ Invalid items in request');
      return NextResponse.json(
        { error: 'Invalid request, items are required' },
        { status: 400 }
      );
    }

    console.log('🛒 Processing checkout for', items.length, 'items');
    
    // Format line items for Stripe
    const line_items = items.map(item => {
      // Create a product data object with required name field
      const productData = {
        name: item.name || 'Product',
      };
      
      // Only add description if it's non-empty
      if (item.description && item.description.trim() !== '') {
        productData.description = item.description;
      }
      
      // Only add images if they are valid URLs
      if (item.images?.length) {
        const validImage = validateImageUrl(item.images[0]);
        if (validImage) {
          productData.images = [validImage];
        }
      }
      
      return {
        price_data: {
          currency: 'inr',
          product_data: productData,
          unit_amount: Math.round(item.price * 100), // Convert to rupees to paise
        },
        quantity: item.quantity || 1,
      };
    });

    // Define properly formatted absolute URLs for success and cancel
    // Make sure the base URL matches your deployed environment
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const success_url = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${baseUrl}/cart`;
    
    console.log('🔗 Using URLs:', { success_url, cancel_url });
    
    // Handle coupon logic
    let coupon = null;
    if (couponCode === 'discount1') {
      console.log('🏷️ Applying discount1 coupon');
      
      try {
        // Check if coupon exists
        const existingCoupon = await stripe.coupons.retrieve('discount1');
        console.log('✅ Found existing coupon:', existingCoupon.id);
        coupon = existingCoupon.id;
      } catch (error) {
        // Create the coupon if it doesn't exist
        if (error.code === 'resource_missing') {
          console.log('🆕 Creating new discount1 coupon');
          
          const discountAmount = calculateDiscountAmount(items);
          console.log('💰 Calculated discount amount:', discountAmount);
          
          try {
            const newCoupon = await stripe.coupons.create({
              id: 'discount1',
              amount_off: discountAmount,
              currency: 'inr',
              duration: 'once',
              name: 'Discount to ₹1',
            });
            
            console.log('✅ Created new coupon:', newCoupon.id);
            coupon = newCoupon.id;
          } catch (couponError) {
            console.error('❌ Failed to create coupon:', couponError);
          }
        } else {
          console.error('❌ Error retrieving coupon:', error);
        }
      }
    }

    // Use the createCheckoutSession function from stripe-server.js
    const { sessionId } = await createCheckoutSession({
      line_items,
      customer_email: token?.email,
      success_url,
      cancel_url,
      coupon,
    });
    
    console.log('✅ Checkout session created:', sessionId);

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('❌ Checkout session error:', error);
    
    // Return more detailed error information in development
    return NextResponse.json(
      { 
        error: 'Error creating checkout session', 
        details: error.message,
        type: error.type || 'unknown'
      },
      { status: 500 }
    );
  }
}

// Validate and format image URL
function validateImageUrl(url) {
  if (!url) return null;
  
  try {
    // Check if it's already an absolute URL with http/https
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Return valid URL if it's well-formed
      new URL(url); // This will throw if URL is invalid
      return url;
    }
    
    // For relative URLs, don't attempt to use them
    console.log('⚠️ Skipping relative image URL:', url);
    return null;
  } catch (error) {
    console.log('⚠️ Invalid image URL:', url);
    return null;
  }
}

// Calculate discount amount to make the total price ₹1
function calculateDiscountAmount(items) {
  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.price * (item.quantity || 1));
  }, 0);
  
  // Calculate amount to discount (total - 1)
  // The min ensures we don't have negative discounts
  return Math.max(Math.round((totalAmount - 1) * 100), 0);
} 