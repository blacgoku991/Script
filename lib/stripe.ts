import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-03-25.dahlia',
});

// Client-side Stripe
let stripePromise: ReturnType<typeof loadStripe> | null = null;
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');
  }
  return stripePromise;
}

// Create a payment intent
export async function createPaymentIntent(
  amount: number, // in MAD (smallest unit = centimes)
  currency = 'mad',
  metadata: Record<string, string> = {}
): Promise<{ clientSecret: string | null; error: string | null }> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to centimes
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    return { clientSecret: paymentIntent.client_secret, error: null };
  } catch (err) {
    return { clientSecret: null, error: (err as Error).message };
  }
}

// Verify webhook signature
export function constructWebhookEvent(
  body: string,
  signature: string,
  secret: string
): Stripe.Event | null {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return null;
  }
}
