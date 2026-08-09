# Send contact form submissions to the n8n webhook

## What changes

The contact form currently fakes a 700ms delay and shows a success toast. It will instead POST the validated form data to the n8n webhook and only show success when the webhook accepts it.

## Behaviour

- On submit: validate as today (name, email, question), then send the data to the webhook.
- While sending: button shows "Sending..." and stays disabled.
- On success: success toast, form clears.
- On failure (network error or non-2xx response): error toast ("Something went wrong. Please try again or call us."), form keeps the typed values so nothing is lost.
- A 15s timeout guards against a hanging request.

## Technical notes

- The site is a fully static export, so there is no server to proxy through — the request goes from the browser straight to the webhook URL.
- Payload: JSON `{ name, email, question, submittedAt, source: "wine-scroll-story-contact" }`, sent with `Content-Type: application/json`.
- The webhook URL lives in a single constant at the top of `src/components/site/ContactSection.tsx`.
- Requirement on the n8n side: the webhook must return permissive CORS headers (`Access-Control-Allow-Origin` for the site's domain or `*`, plus allow `POST` and `Content-Type`), otherwise the browser blocks the call. If n8n cannot be configured that way, the alternative is adding a small server-side proxy, which means dropping the static export — flag this if the request fails in preview.

## Files touched

- `src/components/site/ContactSection.tsx` — replace the simulated submit with the real webhook call plus error handling.
