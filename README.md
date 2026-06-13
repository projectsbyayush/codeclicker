<h1 align="center">codeimage</h1>

<p align="center">
  <strong>Generate beautiful code screenshots with macOS terminal styling for VS Code</strong>
</p>

<p align="center">
  <a href="https://github.com/projectsbyayush/codeimage">
    <img src="https://img.shields.io/github/stars/projectsbyayush/codeimage?style=social" alt="GitHub stars">
  </a>
  <a href="https://github.com/projectsbyayush/codeimage">
    <img src="https://img.shields.io/github/forks/projectsbyayush/codeimage?style=social" alt="GitHub forks">
  </a>
  <a href="https://github.com/projectsbyayush/codeimage/issues">
    <img src="https://img.shields.io/github/issues/projectsbyayush/codeimage" alt="GitHub issues">
  </a>
  <a href="https://github.com/projectsbyayush/codeimage/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/projectsbyayush/codeimage" alt="License">
  </a>
</p>

---

Turn your code into stunning, shareable images directly from Visual Studio Code. Perfect for social media, documentation, presentations, and code sharing.

## Why CodeImage?

CodeImage is a **VS Code extension** that generates **beautiful code screenshots** with a **macOS terminal look**. Unlike other screenshot tools, CodeImage runs entirely inside your editor — no external apps, no browser tabs, just one click.

## Features

- **macOS Terminal Styling** — Authentic traffic light buttons and window frame
- **5 Premium Themes** — Classic Dark, Crisp Light, Solarized Dark, Solarized Light, Hacker Green
- **Syntax Highlighting** — Full color support for 20+ languages
- **Editable Title** — Click the filename to rename it before exporting
- **Font Size Controls** — Adjust text size with +/- buttons
- **Save as PNG** — Export high-quality images to your file system
- **Copy to Clipboard** — One-click copy for instant sharing on Twitter, LinkedIn, Slack
- **Line Numbers** — Toggle line number visibility
- **Custom Padding** — Control spacing around your code
- **Multiple Languages** — JavaScript, TypeScript, Python, Go, Rust, C, HTML, CSS, and more

## Quick Start

1. Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AyushPatil.codeimage)
2. Open any code file in VS Code
3. Click the **camera icon** in the editor title bar
4. Choose your theme from the dropdown
5. Click **Save as PNG** or **Copy to Clipboard**

## Themes

| Theme | Style | Best For |
|-------|-------|----------|
| **Classic Dark** | Deep black with vibrant syntax colors | General use, dark backgrounds |
| **Crisp Light** | Clean white with bold text | Light backgrounds, presentations |
| **Solarized Dark** | Muted Solarized palette | Eye comfort, long sessions |
| **Solarized Light** | Warm light Solarized | Daytime use, printing |
| **Hacker Green** | Retro green-on-black terminal | Terminal aesthetic, retro style |

## Supported Languages

CodeImage provides syntax highlighting for:

- **Web**: JavaScript, TypeScript, JSX, TSX, HTML, CSS, SCSS, Vue
- **Systems**: C, C++, Rust, Go, Java, Kotlin, Swift, Objective-C
- **Scripting**: Python, Ruby, PHP, Lua, Perl, Shell/Bash, PowerShell
- **Data**: JSON, YAML, Dockerfile, SQL
- **And more**: Assembly, Lisp, Clojure, Haskell, MATLAB, LaTeX, R

## Settings

Configure CodeImage in VS Code Settings (`Ctrl+,`):

```json
{
  "codeimage.fontSize": 12,
  "codeimage.fontFamily": "\"JetBrains Mono\", \"Cascadia Code\", \"Fira Code\", Consolas, monospace",
  "codeimage.lineNumbers": true,
  "codeimage.windowPadding": 32,
  "codeimage.outerPadding": 48,
  "codeimage.visualTheme": "classic-dark",
  "codeimage.transparentBackground": false
}
```

## Installation

### From VSIX

```bash
code --install-extension codeimage-0.2.0.vsix
```

### From Source

```bash
git clone https://github.com/projectsbyayush/codeimage.git
cd codeimage
npm install
npm run compile
```

## Keyboard Shortcuts

Open the Command Palette (`Ctrl+Shift+P`) and type:

- `Take Code Snapshot`
- `Copy Code Snapshot to Clipboard`

## Tips

- **Select code first** to capture only a portion
- **Edit the title** by clicking on the filename in the terminal window
- **Switch themes** using the dropdown to preview different styles
- **Adjust font size** with the +/- buttons for optimal readability

## Requirements

- Visual Studio Code 1.74.0 or higher

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Enjoying CodeImage?</strong> Leave a review on the <a href="https://marketplace.visualstudio.com/items?itemName=AyushPatil.codeimage">VS Code Marketplace</a>!
</p>

<p align="center">
  <a href="https://github.com/projectsbyayush/codeimage">
    <img src="https://github.com/projectsbyayush/codeimage/raw/main/resources/icon.png" alt="CodeImage Logo" width="128">
  </a>
</p>
