# Transfer check landing (`/transfer-check`)

Interactive explainer for the wallet preparation method: the calling service passes the
sender and recipient addresses; we check both wallets, delegate Energy and bandwidth to the
sender wallet, charge the cost to the caller's account balance and answer:

- **GO (МОЖНО)** + price — the sender wallet is prepared, send USDT (up to 60% cheaper
  than burning TRX for the network fee);
- **STOP** — the recipient is on a sanctions list or another stop factor was found;
  nothing is delegated or charged.

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
- Addresses, the 250 USDT amount, Energy figures and prices (6.4 → 2.6 TRX, 13 → 5.2 TRX)
  are illustrative; they live in `RECIPS` in `check.js`.
- Palette tokens are at the top of `check.css` (`--acc`, `--sky`, `--gold`, `--red`) and
  the matching 3D colors at the top of `check.js`.
- Bump `?v=` on the CSS/JS links in `transfer-check.html` after changing them.
