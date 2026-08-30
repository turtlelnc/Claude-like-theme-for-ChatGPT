# ChatGPT UI Scanner

Debugging helper for this theme. It scans the current ChatGPT page for near-black UI surfaces and records likely sources such as element backgrounds, pseudo-elements, CSS token overrides, and edge-probe chains.

This scanner is **not part of the main theme extension**. The main extension remains CSS-only.

## Install

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `tools/ui-scanner` folder.
5. Open or refresh `chatgpt.com`.

## Use

1. Open the scanner extension popup.
2. Click **Scan black sources**.
3. Wait until `Scanning: NO` and the queue reaches `0`.
4. Click **Export JSON**.
5. Attach the exported JSON to a bug report when a visual issue cannot be identified from a screenshot alone.

## What it records

- Near-black element backgrounds, gradients, and shadows
- Suspicious `::before` / `::after` pseudo-elements
- Local dark CSS token values
- Root page backgrounds
- Edge probes and ancestor chains

## Notes

The scanner only targets `chatgpt.com` and runs locally in the browser. The exported report may contain DOM metadata, page title, and the current page URL, so review the JSON before sharing it publicly if the conversation URL or other page metadata is sensitive.
