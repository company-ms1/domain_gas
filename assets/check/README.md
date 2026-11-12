# Transfer check landing (`/transfer-check`)

Interactive explainer for the "check & prepare" method: the caller passes a sender
and a recipient address and gets one of two answers:

- **READY** — recipient is clean, the transfer is allowed and the network is prepared
  (no TRX / Energy needed on the sender side);
- **STOP** — the recipient is on a sanctions list or another stop factor was found;
  nothing is prepared or sent.

The page is written for end users, not developers, and does not publish an API contract.

## Files

- `/transfer-check.html` — markup; Russian copy lives here.
- `check.js` — English dictionary, scenario timeline, three.js scene, phone demo.
- `check.css` — styles.
- `/assets/vendor/three.module.min.js` — three.js r160 (MIT, see `three.LICENSE.md`),
  vendored so the page has no third-party CDN dependency.

## Notes

- Language: `?lang=ru|en`, then the saved choice, then the browser language.
- Without WebGL the 3D canvas is replaced by a note; the response panel still runs.
- `prefers-reduced-motion` disables autoplay, camera sway and CSS loops.
- Addresses and the 250 USDT amount are illustrative only.
- Bump `?v=` on the CSS/JS links in `transfer-check.html` after changing them.
