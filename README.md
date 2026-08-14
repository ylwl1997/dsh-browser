# dsh-browser

Browser automation for DeepSeek Harness via [bsk](https://github.com/anthropics/browser-skill) — lets your agent navigate, snapshot, click, fill, and screenshot the **real Chromium browser** (with your logins).

## Install

```sh
dsh plugin add dsh-browser
```

Requires `bsk` on PATH + the browser-skill extension loaded (see browser-skill prerequisites).

## Tools

| Tool | What it does |
|---|---|
| `browse_navigate` | Open a URL |
| `browse_snapshot` | Read the page as an accessibility tree (with @eN refs) |
| `browse_click` | Click an element by @eN ref or CSS selector |
| `browse_fill` | Type into an input |
| `browse_screenshot` | Capture a screenshot |
| `browse_observe` | Semantic VOM observation |

## Example

> Open https://example.com, read the page, and tell me the title.

## License

MIT
