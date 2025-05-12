import Stripe from 'stripe';
import 'server-only';

// Check for missing API key and provide better error handling
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error('⚠️ WARNING: Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe with proper error handling
const stripe = new Stripe(
  STRIPE_SECRET_KEY || 'sk_test_placeholder', // Fallback prevents crashes but won't work for API calls
  {
    apiVersion: '2023-10-16', // Use the latest API version
    appInfo: {
      name: 'GreenBasket', 
      version: '0.1.0'
    },
  }
);

export { stripe };

// List of product items with prices
export const productPrices = {
  // These are sample price IDs - replace with your actual Stripe price IDs
  standard: 'price_1OsiCfSHNjX02NReVRv7CxSd',
  premium: 'price_1OsiDTSHNjX02NReKlB77whR',
};

// Create Checkout Session with better error handling
export const createCheckoutSession = async ({
  line_items,
  customer_email,
  success_url,
  cancel_url,
  coupon,
}) => {
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    throw new Error('Invalid or missing Stripe API key. Check your environment variables.');
  }

  try {
    // Log the creation attempt
    console.log('🔷 Creating Stripe checkout session with:', {
      items_count: line_items.length,
      success_url,
      has_coupon: !!coupon,
    });

    // Create checkout session with line items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      customer_email,
      mode: 'payment',
      success_url,
      cancel_url,
      allow_promotion_codes: !coupon, // Don't allow promo codes if we're using a specific coupon
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['IN'], // India only
      },
      ...(coupon && { discounts: [{ coupon }] }),
    });

    console.log('✅ Checkout session created successfully:', session.id);
    return { sessionId: session.id };
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // Provide more detailed error information for debugging
    const errorDetails = {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      detail: error.detail,
    };
    
    console.error('Error details:', JSON.stringify(errorDetails, null, 2));
    
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};

// Create a coupon (this would be used in an admin panel or setup script)
export const createCoupon = async (couponId, percentOff) => {
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    throw new Error('Invalid or missing Stripe API key. Check your environment variables.');
  }

  try {
    const coupon = await stripe.coupons.create({
      id: couponId,
      percent_off: percentOff,
      duration: 'once',
    });
    return coupon;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw new Error('Failed to create coupon');
  }
}; 