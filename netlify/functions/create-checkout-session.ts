
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { userId, email } = JSON.parse(event.body);
    
    if (!userId || !email) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing user context" }) };
    }

    // Architect Hardcode Fallback: If env var is missing during dev, use the ID you just created.
    // In production, ensure STRIPE_PRICE_ID is set in Netlify Site Settings.
    const priceId = process.env.STRIPE_PRICE_ID || 'price_1SlKMfHU7ZElqx6z0WAmzD4h';
    const baseUrl = process.env.URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/?upgrade=success`,
      cancel_url: `${baseUrl}/?upgrade=cancel`,
      customer_email: email,
      metadata: { 
          supabaseUserId: userId,
          source: 'crispy_bacon_app' 
      },
      allow_promotion_codes: true,
    });

    return { 
        statusCode: 200, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: session.url }) 
    };
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    return { 
        statusCode: 500, 
        body: JSON.stringify({ error: error.message || "Payment Gateway Error" }) 
    };
  }
};
