# Villagading

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-yznmvwzd)

## Edge Function Deploy Guide

Use this whenever you change any file in `supabase/functions/*`.

### 1. Install and login

```bash
npm i -g supabase
supabase login
```

### 2. Link your project

```bash
supabase link --project-ref qbjyjkeflhkepprtlfiq
```

### 3. Set function secrets (server-side only)

Do not put these values in frontend env files.

```bash
supabase secrets set MIDTRANS_SERVER_KEY="YOUR_MIDTRANS_SERVER_KEY"
supabase secrets set MIDTRANS_IS_PRODUCTION="false"
supabase secrets set BOOKING_ICAL_VILLA_1="YOUR_BOOKING_COM_ICAL_URL_1"
supabase secrets set BOOKING_ICAL_VILLA_2="YOUR_BOOKING_COM_ICAL_URL_2"
supabase secrets set RESEND_API_KEY="YOUR_RESEND_API_KEY"
supabase secrets set RESEND_FROM_EMAIL="Bookings <noreply@yourdomain.com>"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are reserved in Supabase Edge Functions and should not be added with `supabase secrets set`.

### 4. Deploy edge functions

```bash
supabase functions deploy booking-calendar
supabase functions deploy booking-create
supabase functions deploy booking-ical-export
supabase functions deploy midtrans-create-transaction
supabase functions deploy midtrans-webhook
```

### 5. Run database migrations

```bash
supabase db push
```

### 6. Configure Midtrans webhook URL

Set webhook notification URL in Midtrans dashboard to:

```text
https://qbjyjkeflhkepprtlfiq.functions.supabase.co/midtrans-webhook
```

### Booking.com iCal export

Use these URLs inside Booking.com as your property calendar import feeds:

```text
https://qbjyjkeflhkepprtlfiq.functions.supabase.co/booking-ical-export?villa=1
https://qbjyjkeflhkepprtlfiq.functions.supabase.co/booking-ical-export?villa=2
```

If you are using Booking.com's native iCal feed URLs instead of your own export endpoint, use these current source URLs in the calendar sync setup:

```text
https://ical.booking.com/v1/export?t=66d29787-db32-498b-b999-f62d75754d97
https://ical.booking.com/v1/export?t=46241f52-e8eb-4d8f-ba4d-333ce2352c86
```

These exports are generated from your website bookings, so once a guest books on your site, Booking.com can import the updated calendar and block those dates.

### Email confirmations

The payment webhook sends a confirmation email through Resend after Midtrans marks a booking as paid. Add a verified sender and make sure these secrets are set:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Then redeploy the webhook:

```bash
supabase functions deploy midtrans-webhook
```

## Security Rules

- Frontend only uses anon key.
- Service role key is only used inside edge functions.
- Never commit service role key to Git.
- Booking references and prices are generated and validated by `booking-create`; the browser cannot choose the amount charged.
- Guest booking rows are protected by RLS and are only readable by authorized administrators.

## Admin Dashboard

The same build serves the public site on `villagading.com` and the protected dashboard on `admin.villagading.com`. For local development, open `http://localhost:5173/?admin=1`.

### 1. Deploy the database security migration and booking function

```bash
supabase db push
supabase functions deploy booking-create
```

### 2. Create the first administrator

In Supabase Dashboard, create the user under **Authentication > Users**. Do not add public sign-up to the website. Then run this once in the SQL Editor, replacing the email:

```sql
insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('owner@example.com')
on conflict (user_id) do nothing;
```

The admin page uses Supabase email/password authentication, and database RLS independently verifies membership in `admin_users` for every bookings or pricing query.

### 3. Host `admin.villagading.com`

GitHub Pages does not support using both an apex domain and a custom subdomain on one Pages site (except `www`). Choose one of these deployments:

- **DomaiNesia hosting/cPanel:** create `admin.villagading.com` with its own document root, run `npm run build`, and upload the contents of `dist` to that document root. Ensure AutoSSL is active.
- **A second GitHub Pages repository:** deploy the same `dist` artifact from a separate repository, set that repository's Pages custom domain to `admin.villagading.com`, then enable HTTPS. In MyDomaiNesia **Domains > villagading.com > DNS Management**, add `CNAME` host `admin` pointing directly to `perfixell.github.io` (not to `villagading.com`).

Do not create a wildcard DNS record. Verify the domain in the GitHub account before adding the DNS record to reduce subdomain-takeover risk.

## Cloudflare Security

The Cloudflare zone is configured with:

- proxied GitHub Pages records for `villagading.com`, `www`, and `admin`;
- DNS-only mail records so SMTP/IMAP traffic is not sent through Cloudflare's web proxy;
- Full (strict) origin TLS, minimum TLS 1.2, TLS 1.3, and Always Use HTTPS;
- Cloudflare's Managed Free WAF ruleset;
- response security headers including CSP, clickjacking protection, MIME sniffing protection, a restrictive Permissions Policy, and a strict referrer policy.

HSTS is intentionally disabled until the Cloudflare zone is active and HTTPS has been verified on every hostname. Enabling it prematurely can make the domain inaccessible.

### Activate Cloudflare at DomaiNesia

In MyDomaiNesia, replace the current authoritative nameservers with the two assigned by Cloudflare:

```text
fish.ns.cloudflare.com
matias.ns.cloudflare.com
```

Do not modify the GitHub Pages A/CNAME records during this change. After Cloudflare reports the zone as Active, verify the public site, admin site, and mail service before enabling HSTS.

### Enable Turnstile booking protection

The booking form and `booking-create` function support Cloudflare Turnstile with mandatory server-side verification. To activate it:

1. Create a **Managed** Turnstile widget in Cloudflare named `Villa Gading Booking`.
2. Allow only `villagading.com` and `www.villagading.com` as production hostnames.
3. Add the public site key to the `villa-gading` GitHub repository as an Actions variable named `VITE_TURNSTILE_SITE_KEY`.
4. Add the private secret key in Supabase Dashboard under **Edge Functions > Secrets** as `TURNSTILE_SECRET_KEY`.
5. Re-run the public GitHub Pages deployment and redeploy `booking-create`.

Never put the Turnstile secret in GitHub source, a Vite variable, or browser code. Turnstile enforcement turns on automatically when the server secret is present.

### Booking abuse controls

- Turnstile tokens are verified for the `booking` action and accepted only from the production hostnames.
- Tokens are single-use and validated before database work.
- Stay length is limited to 30 nights and bookings to 730 days in advance.
- Request bodies are limited to 16 KB.
- Unpaid bookings expire after 30 minutes so they cannot hold inventory indefinitely.

## GitHub Pages Custom Domain

This project is built with root-relative asset paths for a custom domain.

Use these DNS records in Domainesia:

- Apex domain `villagading.com`: four `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
- `www.villagading.com`: a `CNAME` to `villagading.com`.

Then in GitHub Pages settings, set the custom domain to `villagading.com` and enable HTTPS after DNS finishes propagating.
