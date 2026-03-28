import { NextRequest, NextResponse } from 'next/server';

// POST /api/payments - Create payment intent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, packageId } = body;

    if (!bookingId || !packageId) {
      return NextResponse.json(
        { success: false, error: 'Missing bookingId or packageId' },
        { status: 400 }
      );
    }

    // Get package price
    const PRICES: Record<string, number> = {
      starter: 1500,
      impact: 2800,
      premium: 4900,
      exclusive: 8900,
    };

    const amount = PRICES[packageId];
    if (!amount) {
      return NextResponse.json({ success: false, error: 'Invalid package' }, { status: 400 });
    }

    // In production: Create Stripe PaymentIntent
    // const { clientSecret, error } = await createPaymentIntent(amount, 'mad', {
    //   bookingId,
    //   packageId,
    // });
    // if (error) throw new Error(error);

    // Simulate client secret for demo
    const clientSecret = `pi_demo_${Date.now()}_secret_demo`;

    // Update booking status to pending_payment
    // await supabaseAdmin.from('bookings').update({ status: 'pending_payment' }).eq('id', bookingId);

    return NextResponse.json({
      success: true,
      data: { clientSecret, amount, currency: 'mad' },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
