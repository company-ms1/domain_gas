# Business landing page

`/business` is rewritten to `business.html` by Vercel. Legacy `/business.html` and `/business/` redirect to the canonical URL.

Wallet Preparation API is early access, not a live endpoint. The hero illustrates the proposed workflow without publishing a fictional API contract. Existing Energy documentation remains at `/docs.html`.

## Contact form

By request, no lead storage or backend submission is implemented. Native form validation runs before a `mailto:` draft is opened for `lina@gasfree4you.com`. The visitor must send it from their mail application. The draft includes qualification fields, current-page UTM parameters, `/business` as source, and only the referrer's origin. Form data is not persisted.

## Analytics hooks

Events are pushed to the in-memory `window.dataLayer`; no analytics collector is installed and no events are transmitted. Connect a consent-aware analytics integration separately if measurement is required. Events do not contain form data.

- `wallet_prepare_hero_cta`
- `wallet_prepare_api_interest`
- `wallet_prepare_docs_click`
- `business_lead_wallet_prepare`
- `business_lead_volume_pricing`

Lead events from the form have `delivery: email_draft` and `confirmed: false`; they measure intent, not a delivered or qualified lead. The pricing CTA also emits `business_lead_volume_pricing` without those properties. Do not count either as a completed lead submission.

## Stylesheet cache

The stylesheet URL in `business.html` includes the first 12 characters of its SHA-256 hash. Update this version after stylesheet changes. Business assets also use `Cache-Control: public, max-age=0, must-revalidate` on Vercel, so browsers revalidate their cached copy.
