
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const handler = async (event: any) => {
  console.log("--------------------------------");
  console.log("[Stripe Webhook] INCOMING SIGNAL");
  console.log("--------------------------------");

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // 1. Debug Environment (Do not log values, just presence)
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  // Robust check for Supabase URL (checks all common variations)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.VITE_SUPABASE_DATABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecret) console.error("MISSING: STRIPE_SECRET_KEY");
  if (!webhookSecret) console.error("MISSING: STRIPE_WEBHOOK_SECRET (Check Netlify Env Vars)");
  if (!supabaseUrl) console.error("MISSING: SUPABASE_URL / SUPABASE_DATABASE_URL");
  if (!supabaseServiceKey) console.error("MISSING: SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeSecret || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Server Misconfiguration: Missing Secrets" }) 
    };
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2023-10-16' as any,
  });

  const supabase = createClient(
    supabaseUrl.trim(),
    supabaseServiceKey.trim()
  );

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  // 2. Verify Signature
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
    console.log(`[Stripe Webhook] Signature Verified. Event: ${stripeEvent.type}`);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature Verification Failed: ${err.message}`);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // 3. Process Event
  try {
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      
      // Fallbacks for finding user ID
      const userId = session.metadata?.supabaseUserId;
      const userEmail = session.customer_email || session.metadata?.email;

      console.log(`[Stripe Webhook] Processing Upgrade for User: ${userId} (${userEmail})`);

      if (userId) {
        // Atomic Upgrade
        const { error, data } = await supabase
          .from('profiles')
          .update({ 
            is_pro: true, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId)
          .select();

        if (error) {
            console.error(`[Stripe Webhook] DB Update Failed: ${error.message}`);
            throw error;
        }
        
        console.log(`[Stripe Webhook] SUCCESS. User ${userId} is now Pro.`);
        console.log(`[Stripe Webhook] DB Response:`, data);
      } else {
          console.warn("[Stripe Webhook] SKIP: No Supabase User ID in metadata.");
      }
    } else {
        console.log(`[Stripe Webhook] Ignored event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error: any) {
    console.error("[Stripe Webhook] Processing Error:", error);
    return { statusCode: 500, body: `Internal Server Error: ${error.message}` };
  }
};
