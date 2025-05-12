import { NextResponse } from 'next/server';
import { processedSessions } from '@/app/api/orders/route';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`🔍 Looking up order with ID: ${id}`);
    
    // Convert the processedSessions Map to an array of orders
    const allOrders = Array.from(processedSessions.values());
    
    // Find the order with the matching ID
    const order = allOrders.find(order => order.id === id);
    
    if (!order) {
      console.log(`❌ Order with ID ${id} not found`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Found order with ID: ${id}`);
    return NextResponse.json({ order });
    
  } catch (error) {
    console.error('❌ Error fetching order details:', error);
    return NextResponse.json(
      {
        error: 'Error fetching order details',
        details: error.message
      },
      { status: 500 }
    );
  }
} 