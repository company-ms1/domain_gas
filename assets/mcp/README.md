# MCP landing pages

- Russian source: `ru/mcp.html`.
- Translation dictionary: `assets/mcp/translations.json`.
- Rebuild English, Spanish and Indonesian pages: `python3 scripts/build_mcp.py`.
- Runtime messages and chat scenarios: `assets/mcp/page.js`.
- Routes: `/ru/mcp`, `/en/mcp`, `/es/mcp`, `/id/mcp`; configured in `vercel.json`.
- `/mcp` remains the existing server proxy, never an HTML route.

The chat is an illustrative local animation, not a live MCP client. It never sends
requests, receives API keys or places orders. It pauses outside the viewport,
when the tab is hidden, when the visitor pauses it, or when reduced motion is enabled.

## Connection verification (2026-10-10)

- Live server `initialize` and `tools/list` verified over Streamable HTTP without a key.
- `get_energy_prices` successfully called through the connected Codex MCP tool.
- Codex configuration accepted by the installed CLI as `streamable_http` with `http_headers`.
- Cursor and Claude Code snippets checked against official documentation:
  https://cursor.com/docs/mcp
  https://code.claude.com/docs/en/mcp
- Codex configuration reference: https://developers.openai.com/codex/mcp
- End-to-end Cursor / Claude Code connections and authenticated balance / paid
  ordering have not been tested. Do not label these integrations as fully tested
  or add one-click installation claims until client testing is complete.

Browser checks cover all four languages, widths from 320 to 1440 pixels,
client tabs and keyboard navigation, both auth modes, copied configuration and
prompt text, developer details, and animation/pause/reduced-motion behavior.
