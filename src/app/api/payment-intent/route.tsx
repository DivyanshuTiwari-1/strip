import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { email, priceId } = await req.json();

    // Validate inputs
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!priceId) {
      return NextResponse.json({ 
        error: "Price ID is missing. Check environment variables.", 
        debug: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ? "Price ID exists" : "Price ID missing"
      }, { status: 400 });
    }

    // Ensure the customer exists or create a new one
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data.length
      ? customers.data[0]
      : await stripe.customers.create({ email });

    // Create a subscription with a discounted first month
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId, // The full price for subsequent months
          quantity: 1,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { 
        save_default_payment_method: "on_subscription",
        payment_method_types: ["card"],
      },
      trial_settings: {
        end_behavior: { missing_payment_method: "cancel" },
      },
      expand: ["latest_invoice.payment_intent"],
      // Add first month discount
      add_invoice_items: [
        {
          price_data: {
            currency: 'usd',
            product: process.env.STRIPE_PRODUCT_ID!,
            unit_amount: -1999, // $19.99 discount
          },
          quantity: 1,
        },
      ],
    });

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

    if (!paymentIntent || !paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Failed to create payment intent" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      customerId: customer.id,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
