/**
 * Loom Auth Worker — Cloudflare Worker
 * 
 * Handles the Microsoft → Xbox Live → XSTS → Minecraft auth chain server-side.
 * The browser sends the Microsoft auth code + PKCE verifier, and this worker
 * returns the verified Minecraft username + UUID.
 * 
 * Deploy via Cloudflare Dashboard:
 *   1. Go to Workers & Pages → Create Worker
 *   2. Paste this code
 *   3. Deploy
 *   4. (Optional) Add a custom route: loommc.com/api/*
 */

const ALLOWED_ORIGINS = [
  'https://loommc.com',
  'https://www.loommc.com',
  'http://localhost:5173',
  'http://localhost:3000',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }

    try {
      const { code, verifier, redirect_uri, client_id } = await request.json();

      if (!code || !verifier || !redirect_uri || !client_id) {
        return new Response(JSON.stringify({ error: 'Missing required fields: code, verifier, redirect_uri, client_id' }), {
          status: 400,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        });
      }

      // Step 1: Exchange auth code for Microsoft access token
      // Microsoft requires SPA apps to send an Origin header (AADSTS90023)
      const tokenResp = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://loommc.com',
        },
        body: new URLSearchParams({
          client_id,
          code,
          redirect_uri,
          grant_type: 'authorization_code',
          code_verifier: verifier,
        }),
      });
      const tokens = await tokenResp.json();
      if (!tokens.access_token) {
        return new Response(JSON.stringify({ error: 'Microsoft token exchange failed', details: tokens }), {
          status: 401,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        });
      }

      // Step 2: Xbox Live authentication
      const xblResp = await fetch('https://user.auth.xboxlive.com/user/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          Properties: {
            AuthMethod: 'RPS',
            SiteName: 'user.auth.xboxlive.com',
            RpsTicket: `d=${tokens.access_token}`,
          },
          RelyingParty: 'http://auth.xboxlive.com',
          TokenType: 'JWT',
        }),
      });
      const xbl = await xblResp.json();
      if (!xbl.Token) {
        return new Response(JSON.stringify({ error: 'Xbox Live auth failed', details: xbl }), {
          status: 401,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        });
      }
      const userHash = xbl.DisplayClaims?.xui?.[0]?.uhs;

      // Step 3: XSTS authorization
      const xstsResp = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          Properties: { SandboxId: 'RETAIL', UserTokens: [xbl.Token] },
          RelyingParty: 'rp://api.minecraftservices.com/',
          TokenType: 'JWT',
        }),
      });
      const xsts = await xstsResp.json();
      if (!xsts.Token) {
        return new Response(JSON.stringify({ error: 'XSTS auth failed', details: xsts }), {
          status: 401,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        });
      }

      // Step 4: Minecraft authentication
      const mcResp = await fetch('https://api.minecraftservices.com/authentication/login_with_xbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityToken: `XBL3.0 x=${userHash};${xsts.Token}`,
        }),
      });
      const mc = await mcResp.json();
      if (!mc.access_token) {
        return new Response(JSON.stringify({ error: 'Minecraft auth failed', details: mc }), {
          status: 401,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        });
      }

      // Step 5: Get Minecraft profile
      const profileResp = await fetch('https://api.minecraftservices.com/minecraft/profile', {
        headers: { Authorization: `Bearer ${mc.access_token}` },
      });
      const profile = await profileResp.json();

      if (!profile.id || !profile.name) {
        return new Response(JSON.stringify({ error: 'No Minecraft profile found. Does this account own Minecraft Java Edition?' }), {
          status: 404,
          headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
        });
      }

      // Return verified identity
      return new Response(JSON.stringify({
        username: profile.name,
        uuid: profile.id,
      }), {
        status: 200,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal error', message: err.message }), {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
      });
    }
  },
};
