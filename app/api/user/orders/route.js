import { NextResponse } from 'next/server';
import { processedSessions } from '@/app/api/orders/route';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // In a production app, you would verify the user is authenticated
    // For now, we'll just return all orders since we're using in-memory storage
    
    console.log('🔍 Fetching orders for the current user');

    // In a real application, you would fetch orders from a database
    // For now, we'll use the memory cache which stores orders by session ID
    // Convert the processedSessions Map to an array of orders
    const allOrders = Array.from(processedSessions.values());
    
    // Since we don't have proper auth, we'll return all orders for demo purposes
    // In a real app, you would filter by the authenticated user's email
    const userOrders = allOrders;

    if (userOrders.length === 0) {
      console.log('ℹ️ No orders found');
      return NextResponse.json(
        { orders: [] },
        { status: 200 }  // Return 200 with empty array instead of 404
      );
    }

    console.log(`✅ Found ${userOrders.length} orders`);
    return NextResponse.json({ orders: userOrders });
    
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    return NextResponse.json(
      {
        error: 'Error fetching orders',
        details: error.message
      },
      { status: 500 }
    );
  }
} 