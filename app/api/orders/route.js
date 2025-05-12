import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { format, addDays } from 'date-fns';

// Simple in-memory cache to prevent duplicate order processing
// In a production app, this would use a database
export const processedSessions = new Map();

export async function GET(request) {
  try {
    // Get the session_id query parameter
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching order details for session:', sessionId);

    // Check if this session has already been processed
    if (processedSessions.has(sessionId)) {
      console.log('⚠️ Session already processed, returning cached order');
      return NextResponse.json({ order: processedSessions.get(sessionId) });
    }

    try {
      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer', 'payment_intent']
      });

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      // Ensure line_items data exists
      if (!session.line_items || !session.line_items.data || session.line_items.data.length === 0) {
        console.error('❌ Missing line items data in session');
        return NextResponse.json(
          { error: 'Missing order line items' },
          { status: 500 }
        );
      }

      // Extract relevant information
      const orderItems = session.line_items.data.map(item => ({
        name: item.description || 'Product',
        quantity: item.quantity || 1,
        price: item.amount_total || 0
      }));

      // Format address from session data - directly access shipping_details without expanding
      const shippingAddress = session.shipping_details?.address || {};
      const addressFormatted = {
        street: shippingAddress.line1 || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        zip: shippingAddress.postal_code || '',
        country: shippingAddress.country || ''
      };

      // Generate a more unique order ID using the session ID as part of it
      const orderIdSuffix = sessionId.substring(sessionId.length - 8);
      const orderId = `ORD-${orderIdSuffix}-${Date.now().toString().slice(-5)}`;

      // Create the order object
      const order = {
        id: orderId,
        sessionId: session.id,
        date: new Date(),
        estimatedDelivery: addDays(new Date(), 7),
        items: orderItems,
        total: session.amount_total || 0,
        currency: session.currency || 'inr',
        shippingMethod: "Standard Delivery (Free)",
        paymentMethod: "Credit Card (Stripe)",
        customerName: session.customer_details?.name || "Customer",
        customerEmail: session.customer_details?.email || session.customer_email || "customer@example.com",
        shippingAddress: addressFormatted,
        paymentStatus: session.payment_status || 'unknown'
      };

      // Store in our memory cache to prevent duplicates
      processedSessions.set(sessionId, order);

      console.log('✅ Order details retrieved successfully:', orderId);
      return NextResponse.json({ order });
    } catch (stripeError) {
      console.error('❌ Stripe API error:', stripeError);
      
      // Special handling for common Stripe errors
      if (stripeError.code === 'resource_missing') {
        return NextResponse.json(
          { error: 'Session does not exist or has expired' },
          { status: 404 }
        );
      }
      
      throw stripeError; // Re-throw to be caught by outer handler
    }
  } catch (error) {
    console.error('❌ Error fetching order details:', error);
    return NextResponse.json(
      {
        error: 'Error fetching order details',
        details: error.message,
        type: error.type || 'unknown'
      },
      { status: 500 }
    );
  }
} 