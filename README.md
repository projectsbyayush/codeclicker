# codeclicker

Generate beautiful code screenshots with macOS terminal styling for VS Code.

Turn your code into stunning, shareable images directly from Visual Studio Code. Perfect for social media, documentation, presentations, and code sharing.

**Resources**

- GitHub: https://github.com/projectsbyayush/codeclicker
- Report Issues: https://github.com/projectsbyayush/codeclicker/issues
- License: MIT

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

1. Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AyushPatil.codeclicker)
2. Open any code file in VS Code
3. Click the **camera icon** in the editor title bar (top-right)
4. Choose your theme from the dropdown
5. Click **Save as PNG** or **Copy to Clipboard**

## How It Works

1. Click the camera icon or press `Ctrl+Shift+P` and type "Take Code Snapshot"
2. Webview panel opens with your code in a macOS terminal frame
3. Select a theme from the dropdown to change colors
4. Edit the filename by clicking on it in the title bar
5. Use +/- buttons to adjust font size
6. Save as PNG or copy to clipboard

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| Take Code Snapshot | Open the code image generator panel | Click camera icon |
| Copy Code Snapshot to Clipboard | Quick copy without the panel | Right-click menu |

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

- **Web**: HTML, CSS, SCSS, LESS, JavaScript, TypeScript, JSX, TSX, Vue
- **Systems**: C, C++, Rust, Go, Java, Kotlin, Swift, Objective-C
- **Scripting**: Python, Ruby, PHP, Lua, Perl, Shell/Bash, PowerShell
- **Data**: JSON, YAML, Dockerfile, SQL
- **And more**: Assembly, Lisp, Clojure, Haskell, MATLAB, LaTeX, R

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `codeclicker.fontSize` | `12` | Font size for the code in the snapshot |
| `codeclicker.fontFamily` | `"JetBrains Mono", "Cascadia Code", "Fira Code", Consolas, monospace` | Font family for the code |
| `codeclicker.lineNumbers` | `true` | Show line numbers in the snapshot |
| `codeclicker.windowPadding` | `32` | Padding around the code block inside the window |
| `codeclicker.outerPadding` | `48` | Padding around the window frame |
| `codeclicker.visualTheme` | `"classic-dark"` | Visual theme for the output image |
| `codeclicker.transparentBackground` | `false` | Make the outer background transparent |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+Shift+P` → "Take Code Snapshot" | Open code image panel |
| `Ctrl+Shift+P` → "Copy Code Snapshot to Clipboard" | Quick copy to clipboard |

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "codeclicker"
4. Click **Install**

### From VSIX

```bash
code --install-extension AyushPatil.codeclicker-1.0.0.vsix
```

### From Source

```bash
git clone https://github.com/projectsbyayush/codeclicker.git
cd codeclicker
npm install
npm run compile
```

## Requirements

- VS Code 1.74.0 or higher

## License

MIT License - Copyright (c) 2025 Ayush Patil.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you find this extension helpful, please rate it on the VS Code Marketplace.
