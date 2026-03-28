import { NextRequest, NextResponse } from 'next/server';

// POST /api/payments/webhook - Stripe webhook handler
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    // In production: verify Stripe webhook signature
    // const event = constructWebhookEvent(body, signature, webhookSecret);
    // if (!event) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });

    const event = JSON.parse(body);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          // Update booking status
          // await supabaseAdmin.from('bookings').update({
          //   status: 'paid',
          //   payment_id: paymentIntent.id,
          //   payment_status: 'paid',
          //   payment_amount: paymentIntent.amount / 100,
          // }).eq('id', bookingId);

          // Send confirmation email
          // await sendEmail({ to: customer.email, type: 'payment_confirmation', booking });

          // Notify admins
          // await sendAdminNotification({ type: 'new_paid_booking', bookingId });

          console.log(`Payment confirmed for booking ${bookingId}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata?.bookingId;
        console.log(`Payment failed for booking ${bookingId}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
