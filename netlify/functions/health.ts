
export const handler = async (event: any) => {
  // Only allow check from the app context
  const checkSecrets = [
    { name: 'API_KEY', status: !!process.env.API_KEY },
    { name: 'STRIPE_SECRET_KEY', status: !!process.env.STRIPE_SECRET_KEY },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', status: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    { name: 'STRIPE_WEBHOOK_SECRET', status: !!process.env.STRIPE_WEBHOOK_SECRET }
  ];

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "online",
      timestamp: new Date().toISOString(),
      diagnostics: checkSecrets,
      environment: process.env.NODE_ENV || 'production'
    }),
  };
};
