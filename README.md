README:[Chinese 中文](https://github.com/turtlelnc/Claude-like-theme-for-ChatGPT./blob/main/README_CH.md)|[English 英语](https://github.com/turtlelnc/Claude-like-theme-for-ChatGPT./blob/main/README.md)

# Claude-like Theme for ChatGPT

A warm, Claude-like visual theme for the ChatGPT website.

The author recommends using the dark mode for the ChatGPT website, as it looks better than the light mode.

This is an unofficial community project. It is not affiliated with or endorsed by OpenAI or Anthropic.

## Features

- Warm light and dark palettes
- Serif UI typography with monospace code
- Warm sidebar, composer, messages, code blocks, and tool output
- Fixes several native black surfaces and footer fades
- Keeps ChatGPT's layout and interaction model intact
- CSS-only content script: no background service, DOM observer, or remote code

## Install

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the repository folder containing `manifest.json`.
6. Refresh `chatgpt.com`.

> In order to make your loading smoother and more convenient, you can directly download our extension file `ctflc.crx`, and after enabling **Developer Mode**, directly drag it in to load. Since we are very poor and do not have any money to register for the Google App Store, you may be warned that it is **"unsafe"** when you use it for the first time. Please follow the prompts to continue adding. If it really cannot be loaded, please choose the original solution, download the `manifest.json` file and `theme.css` file, and put them into a new clean folder and load them. Thank you.

## Current version

`0.14.9`

The theme targets the current ChatGPT web UI. ChatGPT can change its DOM or CSS tokens at any time, so future site updates may require selector adjustments.

## Files

- `manifest.json` — Chrome Manifest V3 extension definition
- `theme.css` — all theme styling

## License

MIT

## Acknowledgments

Thanks to ChatGPT for coding and finding bugs.
