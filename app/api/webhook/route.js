import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { headers } from 'next/headers';

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const sig = headersList.get('stripe-signature');

    let event;

    try {
      if (!sig || !endpointSecret) {
        console.log('⚠️ Webhook signature verification not configured');
        event = await stripe.webhooks.constructEvent(body, sig, endpointSecret || 'whsec_test');
      } else {
        event = await stripe.webhooks.constructEvent(body, sig, endpointSecret);
      }
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    console.log(`Event type: ${event.type}`);
    
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object;
        // Save an order in your database
        await handleCheckoutSessionCompleted(checkoutSession);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Handle successful payment intent
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Process completed checkout session
async function handleCheckoutSessionCompleted(session) {
  // Here you would typically:
  // 1. Get the customer details
  // 2. Get the line items
  // 3. Create an order in your database
  // 4. Send email confirmation
  
  try {
    // Retrieve the session with line items
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer'],
    });

    const lineItems = expandedSession.line_items;
    const customerEmail = expandedSession.customer_details.email;
    const customerName = expandedSession.customer_details.name;
    const shippingDetails = expandedSession.shipping_details;
    
    console.log(`Order processed for ${customerName} (${customerEmail})`);
    console.log('Items:', lineItems.data.map(item => item.description));
    console.log('Shipping to:', shippingDetails?.address);
    
    // Here you would save order details to your database
  } catch (error) {
    console.error('Error processing checkout session:', error);
  }
} 