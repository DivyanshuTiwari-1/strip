import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });

export async function POST(req: Request) {
  try {
    const { amount, currency } = await req.json();

    // Ensure amount is provided
    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 });
    }

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
