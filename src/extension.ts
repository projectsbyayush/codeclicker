import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { execSync } from 'child_process';

interface VisualTheme {
    name: string;
    group: 'dark' | 'light';
    codeBg: string;
    titleBarBg: string;
    outerBg: string;
    gradient: string;
    shadow: string;
    border: string;
    text: string;
    lineNumber: string;
    titleText: string;
    tokens: Record<string, string>;
}

const VISUAL_THEMES: Record<string, VisualTheme> = {
    'classic-dark': {
        name: 'Classic Dark',
        group: 'dark',
        codeBg: '#1E1E1E',
        titleBarBg: '#181818',
        outerBg: '#121212',
        gradient: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
        shadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 30px rgba(97,175,239,0.08)',
        border: '1px solid rgba(255,255,255,0.06)',
        text: '#D4D4D4',
        lineNumber: '#5A5A5A',
        titleText: 'rgba(212,212,212,0.4)',
        tokens: {
            'comment': '#FFFFFF', 'keyword': '#C678DD', 'keyword-control': '#C678DD',
            'string': '#98C379', 'string-regex': '#98C379', 'number': '#D19A66',
            'constant': '#D19A66', 'type': '#E5C07B', 'type-builtin': '#E5C07B',
            'function': '#61AFEF', 'function-call': '#61AFEF', 'variable': '#E06C75',
            'variable-parameter': '#E06C75', 'variable-property': '#E06C75',
            'parameter': '#E06C75', 'operator': '#56B6C2', 'delimiter': '#ABB2BF',
            'bracket': '#ABB2BF', 'tag': '#E06C75', 'attribute': '#D19A66',
            'attribute-value': '#98C379', 'decorator': '#C678DD', 'class': '#E5C07B',
            'interface': '#E5C07B', 'enum': '#E5C07B', 'namespace': '#E5C07B',
            'regex': '#98C379', 'plain': '#ABB2BF',
        },
    },
    'crisp-light': {
        name: 'Crisp Light',
        group: 'light',
        codeBg: '#FFFFFF',
        titleBarBg: '#F5F5F5',
        outerBg: '#ECECEC',
        gradient: 'linear-gradient(140deg, #ECECEC 0%, #FFFFFF 100%)',
        shadow: '0 25px 80px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.08)',
        text: '#333333',
        lineNumber: '#AAAAAA',
        titleText: 'rgba(51,51,51,0.35)',
        tokens: {
            'comment': '#000000', 'keyword': '#A000A0', 'keyword-control': '#A000A0',
            'string': '#008000', 'string-regex': '#008000', 'number': '#800000',
            'constant': '#800000', 'type': '#000000', 'type-builtin': '#000000',
            'function': '#000080', 'function-call': '#000080', 'variable': '#000000',
            'variable-parameter': '#FF0000', 'variable-property': '#000000',
            'parameter': '#FF0000', 'operator': '#0000FF', 'delimiter': '#333333',
            'bracket': '#333333', 'tag': '#800000', 'attribute': '#FF0000',
            'attribute-value': '#008000', 'decorator': '#A000A0', 'class': '#000000',
            'interface': '#000000', 'enum': '#000000', 'namespace': '#000000',
            'regex': '#008000', 'plain': '#333333',
        },
    },
    'solarized-dark': {
        name: 'Solarized Dark',
        group: 'dark',
        codeBg: '#002B36',
        titleBarBg: '#073642',
        outerBg: '#001E27',
        gradient: 'linear-gradient(140deg, #001E27 0%, #002B36 50%, #073642 100%)',
        shadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 30px rgba(42,161,152,0.08)',
        border: '1px solid rgba(147,161,161,0.12)',
        text: '#839496',
        lineNumber: '#586E75',
        titleText: 'rgba(131,148,150,0.4)',
        tokens: {
            'comment': '#FFFFFF', 'keyword': '#CB4B16', 'keyword-control': '#CB4B16',
            'string': '#2AA198', 'string-regex': '#2AA198', 'number': '#D33682',
            'constant': '#CB4B16', 'type': '#B58900', 'type-builtin': '#B58900',
            'function': '#268BD2', 'function-call': '#268BD2', 'variable': '#93A1A1',
            'variable-parameter': '#93A1A1', 'variable-property': '#93A1A1',
            'parameter': '#93A1A1', 'operator': '#859900', 'delimiter': '#839496',
            'bracket': '#839496', 'tag': '#268BD2', 'attribute': '#B58900',
            'attribute-value': '#2AA198', 'decorator': '#CB4B16', 'class': '#B58900',
            'interface': '#268BD2', 'enum': '#B58900', 'namespace': '#268BD2',
            'regex': '#2AA198', 'plain': '#839496',
        },
    },
    'solarized-light': {
        name: 'Solarized Light',
        group: 'light',
        codeBg: '#FDF6E3',
        titleBarBg: '#EEE8D5',
        outerBg: '#F5EFDC',
        gradient: 'linear-gradient(140deg, #F5EFDC 0%, #FDF6E3 50%, #EEE8D5 100%)',
        shadow: '0 25px 80px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid rgba(147,161,161,0.15)',
        text: '#586E75',
        lineNumber: '#93A1A1',
        titleText: 'rgba(88,110,117,0.35)',
        tokens: {
            'comment': '#000000', 'keyword': '#CB4B16', 'keyword-control': '#CB4B16',
            'string': '#2AA198', 'string-regex': '#2AA198', 'number': '#D33682',
            'constant': '#CB4B16', 'type': '#B58900', 'type-builtin': '#B58900',
            'function': '#268BD2', 'function-call': '#268BD2', 'variable': '#657B83',
            'variable-parameter': '#657B83', 'variable-property': '#657B83',
            'parameter': '#657B83', 'operator': '#859900', 'delimiter': '#586E75',
            'bracket': '#586E75', 'tag': '#268BD2', 'attribute': '#B58900',
            'attribute-value': '#2AA198', 'decorator': '#CB4B16', 'class': '#B58900',
            'interface': '#268BD2', 'enum': '#B58900', 'namespace': '#268BD2',
            'regex': '#2AA198', 'plain': '#586E75',
        },
    },
    'hacker-green': {
        name: 'Hacker Green',
        group: 'dark',
        codeBg: '#1E1E1E',
        titleBarBg: '#181818',
        outerBg: '#121212',
        gradient: 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)',
        shadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 30px rgba(0,255,0,0.06)',
        border: '1px solid rgba(0,255,0,0.1)',
        text: '#39D353',
        lineNumber: '#1A6B2A',
        titleText: 'rgba(57,211,83,0.4)',
        tokens: {
            'comment': '#FFFFFF', 'keyword': '#4ADE80', 'keyword-control': '#4ADE80',
            'string': '#86EFAC', 'string-regex': '#86EFAC', 'number': '#22C55E',
            'constant': '#22C55E', 'type': '#6EE7B7', 'type-builtin': '#6EE7B7',
            'function': '#34D399', 'function-call': '#34D399', 'variable': '#A7F3D0',
            'variable-parameter': '#BBF7D0', 'variable-property': '#A7F3D0',
            'parameter': '#BBF7D0', 'operator': '#4ADE80', 'delimiter': '#6EE7B7',
            'bracket': '#6EE7B7', 'tag': '#4ADE80', 'attribute': '#86EFAC',
            'attribute-value': '#86EFAC', 'decorator': '#22C55E', 'class': '#6EE7B7',
            'interface': '#6EE7B7', 'enum': '#6EE7B7', 'namespace': '#6EE7B7',
            'regex': '#86EFAC', 'plain': '#39D353',
        },
    },
};

interface SnapshotConfig {
    fontSize: number;
    fontFamily: string;
    lineNumbers: boolean;
    windowPadding: number;
    background: string;
    titleBarColor: string;
    theme: string;
    transparentBackground: boolean;
    outerPadding: number;
    visualTheme: string;
}

function getConfig(): SnapshotConfig {
    const cfg = vscode.workspace.getConfiguration('codeclick');
    return {
        fontSize: cfg.get<number>('fontSize', 12),
        fontFamily: cfg.get<string>('fontFamily', '"JetBrains Mono", "Cascadia Code", "Fira Code", Consolas, monospace'),
        lineNumbers: cfg.get<boolean>('lineNumbers', true),
        windowPadding: cfg.get<number>('windowPadding', 32),
        background: cfg.get<string>('background', '#1e1e2e'),
        titleBarColor: cfg.get<string>('titleBarColor', '#2d2d3f'),
        theme: cfg.get<string>('theme', 'dark'),
        transparentBackground: cfg.get<boolean>('transparentBackground', false),
        outerPadding: cfg.get<number>('outerPadding', 48),
        visualTheme: cfg.get<string>('visualTheme', 'classic-dark'),
    };
}

function getVisualTheme(name: string): VisualTheme {
    return VISUAL_THEMES[name] || VISUAL_THEMES['classic-dark'];
}

function getTokenColors(): Record<string, string> {
    const themeKind = vscode.window.activeColorTheme.kind;
    const cfg = vscode.workspace.getConfiguration();
    const themeName = cfg.get<string>('workbench.colorTheme', '').toLowerCase();

    const isDark = themeKind === vscode.ColorThemeKind.Dark ||
                   themeKind === vscode.ColorThemeKind.HighContrast;

    const dark: Record<string, string> = {
        'comment': '#FFFFFF', 'keyword': '#C586C0', 'keyword-control': '#C586C0',
        'string': '#CE9178', 'string-regex': '#D16969', 'number': '#B5CEA8',
        'constant': '#4FC1FF', 'type': '#4EC9B0', 'type-builtin': '#4EC9B0',
        'function': '#DCDCAA', 'function-call': '#DCDCAA', 'variable': '#9CDCFE',
        'variable-parameter': '#9CDCFE', 'variable-property': '#9CDCFE',
        'parameter': '#9CDCFE', 'operator': '#D4D4D4', 'delimiter': '#D4D4D4',
        'bracket': '#FFD700', 'tag': '#569CD6', 'attribute': '#9CDCFE',
        'attribute-value': '#CE9178', 'decorator': '#DCDCAA', 'class': '#4EC9B0',
        'interface': '#4EC9B0', 'enum': '#4EC9B0', 'namespace': '#4EC9B0',
        'regex': '#D16969', 'plain': '#D4D4D4',
    };

    const light: Record<string, string> = {
        'comment': '#FFFFFF', 'keyword': '#AF00DB', 'keyword-control': '#AF00DB',
        'string': '#A31515', 'string-regex': '#811F3F', 'number': '#098658',
        'constant': '#0070C1', 'type': '#267F99', 'type-builtin': '#267F99',
        'function': '#795E26', 'function-call': '#795E26', 'variable': '#001080',
        'variable-parameter': '#E50000', 'variable-property': '#001080',
        'parameter': '#E50000', 'operator': '#000000', 'delimiter': '#000000',
        'bracket': '#795E26', 'tag': '#800000', 'attribute': '#E50000',
        'attribute-value': '#0000FF', 'decorator': '#795E26', 'class': '#267F99',
        'interface': '#267F99', 'enum': '#267F99', 'namespace': '#267F99',
        'regex': '#811F3F', 'plain': '#000000',
    };

    const palettes: Record<string, Record<string, string>> = {
        'monokai': {
            'comment': '#75715E', 'keyword': '#F92672', 'keyword-control': '#F92672',
            'string': '#E6DB74', 'string-regex': '#E6DB74', 'number': '#AE81FF',
            'constant': '#AE81FF', 'type': '#A6E22E', 'type-builtin': '#66D9EF',
            'function': '#A6E22E', 'function-call': '#A6E22E', 'variable': '#F8F8F2',
            'variable-parameter': '#FD971F', 'variable-property': '#F8F8F2',
            'parameter': '#FD971F', 'operator': '#F92672', 'delimiter': '#F8F8F2',
            'bracket': '#F8F8F2', 'tag': '#F92672', 'attribute': '#A6E22E',
            'attribute-value': '#E6DB74', 'decorator': '#A6E22E', 'class': '#A6E22E',
            'interface': '#66D9EF', 'enum': '#A6E22E', 'namespace': '#66D9EF',
            'regex': '#E6DB74', 'plain': '#F8F8F2',
        },
        'dracula': {
            'comment': '#6272A4', 'keyword': '#FF79C6', 'keyword-control': '#FF79C6',
            'string': '#F1FA8C', 'string-regex': '#F1FA8C', 'number': '#BD93F9',
            'constant': '#BD93F9', 'type': '#8BE9FD', 'type-builtin': '#8BE9FD',
            'function': '#50FA7B', 'function-call': '#50FA7B', 'variable': '#F8F8F2',
            'variable-parameter': '#FFB86C', 'variable-property': '#F8F8F2',
            'parameter': '#FFB86C', 'operator': '#FF79C6', 'delimiter': '#F8F8F2',
            'bracket': '#F8F8F2', 'tag': '#FF79C6', 'attribute': '#50FA7B',
            'attribute-value': '#F1FA8C', 'decorator': '#50FA7B', 'class': '#8BE9FD',
            'interface': '#8BE9FD', 'enum': '#8BE9FD', 'namespace': '#8BE9FD',
            'regex': '#F1FA8C', 'plain': '#F8F8F2',
        },
        'one-dark': {
            'comment': '#5C6370', 'keyword': '#C678DD', 'keyword-control': '#C678DD',
            'string': '#98C379', 'string-regex': '#56B6C2', 'number': '#D19A66',
            'constant': '#D19A66', 'type': '#E5C07B', 'type-builtin': '#E5C07B',
            'function': '#61AFEF', 'function-call': '#61AFEF', 'variable': '#E06C75',
            'variable-parameter': '#E06C75', 'variable-property': '#ABB2BF',
            'parameter': '#E06C75', 'operator': '#ABB2BF', 'delimiter': '#ABB2BF',
            'bracket': '#ABB2BF', 'tag': '#E06C75', 'attribute': '#D19A66',
            'attribute-value': '#98C379', 'decorator': '#E5C07B', 'class': '#E5C07B',
            'interface': '#E5C07B', 'enum': '#E5C07B', 'namespace': '#E5C07B',
            'regex': '#56B6C2', 'plain': '#ABB2BF',
        },
        'nord': {
            'comment': '#616E88', 'keyword': '#81A1C1', 'keyword-control': '#81A1C1',
            'string': '#A3BE8C', 'string-regex': '#EBCB8B', 'number': '#B48EAD',
            'constant': '#B48EAD', 'type': '#8FBCBB', 'type-builtin': '#8FBCBB',
            'function': '#88C0D0', 'function-call': '#88C0D0', 'variable': '#D8DEE9',
            'variable-parameter': '#D08770', 'variable-property': '#D8DEE9',
            'parameter': '#D08770', 'operator': '#81A1C1', 'delimiter': '#ECEFF4',
            'bracket': '#ECEFF4', 'tag': '#81A1C1', 'attribute': '#8FBCBB',
            'attribute-value': '#A3BE8C', 'decorator': '#8FBCBB', 'class': '#8FBCBB',
            'interface': '#8FBCBB', 'enum': '#8FBCBB', 'namespace': '#8FBCBB',
            'regex': '#EBCB8B', 'plain': '#D8DEE9',
        },
        'solarized-dark': {
            'comment': '#586E75', 'keyword': '#859900', 'keyword-control': '#859900',
            'string': '#2AA198', 'string-regex': '#CB4B16', 'number': '#D33682',
            'constant': '#CB4B16', 'type': '#B58900', 'type-builtin': '#B58900',
            'function': '#268BD2', 'function-call': '#268BD2', 'variable': '#839496',
            'variable-parameter': '#CB4B16', 'variable-property': '#839496',
            'parameter': '#CB4B16', 'operator': '#859900', 'delimiter': '#839496',
            'bracket': '#839496', 'tag': '#268BD2', 'attribute': '#93A1A1',
            'attribute-value': '#2AA198', 'decorator': '#B58900', 'class': '#B58900',
            'interface': '#268BD2', 'enum': '#B58900', 'namespace': '#268BD2',
            'regex': '#CB4B16', 'plain': '#839496',
        },
        'solarized-light': {
            'comment': '#93A1A1', 'keyword': '#859900', 'keyword-control': '#859900',
            'string': '#2AA198', 'string-regex': '#CB4B16', 'number': '#D33682',
            'constant': '#CB4B16', 'type': '#B58900', 'type-builtin': '#B58900',
            'function': '#268BD2', 'function-call': '#268BD2', 'variable': '#657B83',
            'variable-parameter': '#CB4B16', 'variable-property': '#657B83',
            'parameter': '#CB4B16', 'operator': '#859900', 'delimiter': '#657B83',
            'bracket': '#657B83', 'tag': '#268BD2', 'attribute': '#586E75',
            'attribute-value': '#2AA198', 'decorator': '#B58900', 'class': '#B58900',
            'interface': '#268BD2', 'enum': '#B58900', 'namespace': '#268BD2',
            'regex': '#CB4B16', 'plain': '#657B83',
        },
        'tokyo-night': {
            'comment': '#565F89', 'keyword': '#BB9AF7', 'keyword-control': '#BB9AF7',
            'string': '#9ECE6A', 'string-regex': '#B4F9F8', 'number': '#FF9E64',
            'constant': '#FF9E64', 'type': '#2AC3DE', 'type-builtin': '#2AC3DE',
            'function': '#7AA2F7', 'function-call': '#7AA2F7', 'variable': '#C0CAF5',
            'variable-parameter': '#E0AF68', 'variable-property': '#C0CAF5',
            'parameter': '#E0AF68', 'operator': '#89DDFF', 'delimiter': '#C0CAF5',
            'bracket': '#C0CAF5', 'tag': '#F7768E', 'attribute': '#73DACA',
            'attribute-value': '#9ECE6A', 'decorator': '#7AA2F7', 'class': '#2AC3DE',
            'interface': '#2AC3DE', 'enum': '#2AC3DE', 'namespace': '#2AC3DE',
            'regex': '#B4F9F8', 'plain': '#C0CAF5',
        },
        'github-dark': {
            'comment': '#8B949E', 'keyword': '#FF7B72', 'keyword-control': '#FF7B72',
            'string': '#A5D6FF', 'string-regex': '#7EE787', 'number': '#79C0FF',
            'constant': '#79C0FF', 'type': '#FFA657', 'type-builtin': '#FFA657',
            'function': '#D2A8FF', 'function-call': '#D2A8FF', 'variable': '#FFA657',
            'variable-parameter': '#FFA657', 'variable-property': '#C9D1D9',
            'parameter': '#FFA657', 'operator': '#FF7B72', 'delimiter': '#C9D1D9',
            'bracket': '#C9D1D9', 'tag': '#7EE787', 'attribute': '#79C0FF',
            'attribute-value': '#A5D6FF', 'decorator': '#D2A8FF', 'class': '#FFA657',
            'interface': '#FFA657', 'enum': '#FFA657', 'namespace': '#FFA657',
            'regex': '#7EE787', 'plain': '#C9D1D9',
        },
        'github-light': {
            'comment': '#6A737D', 'keyword': '#D73A49', 'keyword-control': '#D73A49',
            'string': '#032F62', 'string-regex': '#032F62', 'number': '#005CC5',
            'constant': '#005CC5', 'type': '#6F42C1', 'type-builtin': '#6F42C1',
            'function': '#6F42C1', 'function-call': '#6F42C1', 'variable': '#E36209',
            'variable-parameter': '#E36209', 'variable-property': '#24292E',
            'parameter': '#E36209', 'operator': '#D73A49', 'delimiter': '#24292E',
            'bracket': '#24292E', 'tag': '#22863A', 'attribute': '#005CC5',
            'attribute-value': '#032F62', 'decorator': '#6F42C1', 'class': '#6F42C1',
            'interface': '#6F42C1', 'enum': '#6F42C1', 'namespace': '#6F42C1',
            'regex': '#032F62', 'plain': '#24292E',
        },
        'ayu-mirage': {
            'comment': '#5C6773', 'keyword': '#FF8F40', 'keyword-control': '#FF8F40',
            'string': '#C2D94C', 'string-regex': '#95E6CB', 'number': '#FFCC66',
            'constant': '#FFCC66', 'type': '#59C2FF', 'type-builtin': '#59C2FF',
            'function': '#FFD580', 'function-call': '#FFD580', 'variable': '#EDBFE8',
            'variable-parameter': '#FFA75D', 'variable-property': '#BFC2D4',
            'parameter': '#FFA75D', 'operator': '#FFCC66', 'delimiter': '#BFC2D4',
            'bracket': '#BFC2D4', 'tag': '#39BAE6', 'attribute': '#7FD962',
            'attribute-value': '#C2D94C', 'decorator': '#FFD580', 'class': '#59C2FF',
            'interface': '#59C2FF', 'enum': '#59C2FF', 'namespace': '#59C2FF',
            'regex': '#95E6CB', 'plain': '#BFC2D4',
        },
        'monokai-pro': {
            'comment': '#727072', 'keyword': '#FAA61A', 'keyword-control': '#FAA61A',
            'string': '#A9DC76', 'string-regex': '#FC9867', 'number': '#AB9DF2',
            'constant': '#AB9DF2', 'type': '#66D9EF', 'type-builtin': '#66D9EF',
            'function': '#A9DC76', 'function-call': '#A9DC76', 'variable': '#FCFCFA',
            'variable-parameter': '#FC9867', 'variable-property': '#FCFCFA',
            'parameter': '#FC9867', 'operator': '#FD9720', 'delimiter': '#FCFCFA',
            'bracket': '#FCFCFA', 'tag': '#FF6188', 'attribute': '#A9DC76',
            'attribute-value': '#A9DC76', 'decorator': '#A9DC76', 'class': '#66D9EF',
            'interface': '#66D9EF', 'enum': '#66D9EF', 'namespace': '#66D9EF',
            'regex': '#FC9867', 'plain': '#FCFCFA',
        },
        'night-owl': {
            'comment': '#637777', 'keyword': '#C792EA', 'keyword-control': '#C792EA',
            'string': '#C3E88D', 'string-regex': '#C3E88D', 'number': '#F78C6C',
            'constant': '#82AAFF', 'type': '#FFCB6B', 'type-builtin': '#FFCB6B',
            'function': '#82AAFF', 'function-call': '#82AAFF', 'variable': '#D6DEEB',
            'variable-parameter': '#F07178', 'variable-property': '#D6DEEB',
            'parameter': '#F07178', 'operator': '#89DDFF', 'delimiter': '#D6DEEB',
            'bracket': '#D6DEEB', 'tag': '#F07178', 'attribute': '#FFCB6B',
            'attribute-value': '#C3E88D', 'decorator': '#C792EA', 'class': '#FFCB6B',
            'interface': '#FFCB6B', 'enum': '#FFCB6B', 'namespace': '#FFCB6B',
            'regex': '#C3E88D', 'plain': '#D6DEEB',
        },
        'catppuccin-mocha': {
            'comment': '#6C7086', 'keyword': '#CBA6F7', 'keyword-control': '#CBA6F7',
            'string': '#A6E3A1', 'string-regex': '#F5C2E7', 'number': '#FAB387',
            'constant': '#FAB387', 'type': '#89DCEB', 'type-builtin': '#89DCEB',
            'function': '#89B4FA', 'function-call': '#89B4FA', 'variable': '#CDD6F4',
            'variable-parameter': '#F38BA8', 'variable-property': '#CDD6F4',
            'parameter': '#F38BA8', 'operator': '#89DCEB', 'delimiter': '#BAC2DE',
            'bracket': '#BAC2DE', 'tag': '#F38BA8', 'attribute': '#F9E2AF',
            'attribute-value': '#A6E3A1', 'decorator': '#CBA6F7', 'class': '#F9E2AF',
            'interface': '#89DCEB', 'enum': '#F9E2AF', 'namespace': '#89DCEB',
            'regex': '#F5C2E7', 'plain': '#CDD6F4',
        },
        'rose-pine': {
            'comment': '#6E6A86', 'keyword': '#C4A7E7', 'keyword-control': '#C4A7E7',
            'string': '#F6C177', 'string-regex': '#EBBCBA', 'number': '#EBBCBA',
            'constant': '#EBBCBA', 'type': '#9CCFD8', 'type-builtin': '#9CCFD8',
            'function': '#31748F', 'function-call': '#31748F', 'variable': '#E0DEF4',
            'variable-parameter': '#EB6F92', 'variable-property': '#E0DEF4',
            'parameter': '#EB6F92', 'operator': '#908CAA', 'delimiter': '#E0DEF4',
            'bracket': '#E0DEF4', 'tag': '#EB6F92', 'attribute': '#F6C177',
            'attribute-value': '#F6C177', 'decorator': '#C4A7E7', 'class': '#9CCFD8',
            'interface': '#9CCFD8', 'enum': '#9CCFD8', 'namespace': '#9CCFD8',
            'regex': '#EBBCBA', 'plain': '#E0DEF4',
        },
    };

    let matched: Record<string, string> = isDark ? dark : light;

    const themeMap: Record<string, string> = {
        'monokai': 'monokai', 'monokai-pro': 'monokai-pro',
        'dracula': 'dracula', 'one dark': 'one-dark', 'onedark': 'one-dark',
        'nord': 'nord', 'solarized dark': 'solarized-dark', 'solarized light': 'solarized-light',
        'tokyo night': 'tokyo-night', 'tokyonight': 'tokyo-night',
        'github dark': 'github-dark', 'github light': 'github-light',
        'ayu': 'ayu-mirage', 'night owl': 'night-owl',
        'catppuccin': 'catppuccin-mocha', 'rose pine': 'rose-pine', 'rosepine': 'rose-pine',
    };

    for (const [keyword, paletteKey] of Object.entries(themeMap)) {
        if (themeName.includes(keyword)) {
            const palette = palettes[paletteKey];
            if (palette) {
                const isLightPalette = paletteKey.includes('light') || paletteKey === 'solarized-light' || paletteKey === 'github-light';
                if ((isDark && !isLightPalette) || (!isDark && isLightPalette)) {
                    matched = palette;
                    break;
                } else if (!isDark && !isLightPalette) {
                    matched = palette;
                    break;
                } else if (isDark && isLightPalette) {
                    continue;
                }
            }
        }
    }

    return matched;
}

interface Token {
    text: string;
    type: string;
}

const ALL_KEYWORDS: Record<string, boolean> = {};
const _jsKw = [
    'abstract', 'arguments', 'async', 'await', 'boolean', 'break', 'byte',
    'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger',
    'default', 'delete', 'do', 'double', 'else', 'enum', 'export',
    'extends', 'false', 'final', 'finally', 'float', 'for', 'from',
    'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof',
    'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'of',
    'package', 'private', 'protected', 'public', 'return', 'short',
    'static', 'super', 'switch', 'synchronized', 'this', 'throw',
    'throws', 'transient', 'true', 'try', 'typeof', 'undefined', 'var',
    'void', 'volatile', 'while', 'with', 'yield',
];
const _pyKw = [
    'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
    'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
    'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not',
    'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
];
const _goKw = [
    'break', 'case', 'chan', 'const', 'continue', 'default', 'defer',
    'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import',
    'interface', 'map', 'package', 'range', 'return', 'select', 'struct',
    'switch', 'type', 'var',
];
const _rustKw = [
    'as', 'async', 'await', 'break', 'const', 'continue', 'crate', 'dyn',
    'else', 'enum', 'extern', 'fn', 'for', 'if', 'impl', 'in', 'let',
    'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self',
    'Self', 'static', 'struct', 'super', 'trait', 'true', 'false', 'type',
    'unsafe', 'use', 'where', 'while',
];
for (const k of [..._jsKw, ..._pyKw, ..._goKw, ..._rustKw]) { ALL_KEYWORDS[k] = true; }

function tokenizeCode(code: string, languageId: string): Token[] {
    const tokens: Token[] = [];
    const lines = code.split('\n');

    const jsKeywords = new Set(_jsKw);

    const pyKeywords = new Set([
        'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
        'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
        'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not',
        'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
    ]);

    const goKeywords = new Set([
        'break', 'case', 'chan', 'const', 'continue', 'default', 'defer',
        'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import',
        'interface', 'map', 'package', 'range', 'return', 'select', 'struct',
        'switch', 'type', 'var',
    ]);

    const rustKeywords = new Set([
        'as', 'async', 'await', 'break', 'const', 'continue', 'crate', 'dyn',
        'else', 'enum', 'extern', 'fn', 'for', 'if', 'impl', 'in', 'let',
        'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self',
        'Self', 'static', 'struct', 'super', 'trait', 'true', 'false', 'type',
        'unsafe', 'use', 'where', 'while',
    ]);

    const builtinTypes = new Set([
        'string', 'number', 'boolean', 'any', 'void', 'never', 'object',
        'symbol', 'bigint', 'undefined', 'null', 'true', 'false',
        'int', 'float', 'double', 'long', 'char', 'byte', 'short',
        'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64', 'u128',
        'f32', 'f64', 'bool', 'str', 'isize', 'usize',
        'Array', 'Map', 'Set', 'Promise', 'Record', 'Partial', 'Required',
        'Readonly', 'Pick', 'Omit', 'Exclude', 'Extract', 'NonNullable',
        'int', 'float', 'bool', 'str', 'list', 'dict', 'tuple', 'None',
        'True', 'False',
    ]);

    const constants = new Set([
        'true', 'false', 'null', 'undefined', 'None', 'True', 'False',
        'nil', 'NaN', 'Infinity', 'MAX_VALUE', 'MIN_VALUE',
    ]);

    const variables = new Set(['self', 'this', 'super']);

    const keywords = languageId === 'python' ? pyKeywords :
                     languageId === 'go' ? goKeywords :
                     languageId === 'rust' ? rustKeywords : jsKeywords;

    const isJsLike = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact',
                       'json', 'jsonc', 'jsx', 'tsx'].includes(languageId);
    const isPython = languageId === 'python';
    const isGo = languageId === 'go';
    const isRust = languageId === 'rust';
    const isCStyle = ['c', 'cpp', 'csharp', 'java', 'php', 'scala', 'kotlin', 'swift', 'objective-c'].includes(languageId);
    const isShellLike = ['shellscript', 'bash', 'zsh', 'powershell'].includes(languageId);

    for (const line of lines) {
        let i = 0;
        while (i < line.length) {
            if (line[i] === '/' && i + 1 < line.length && line[i + 1] === '/') {
                tokens.push({ text: line.substring(i), type: 'comment' });
                break;
            }

            if (line[i] === '/' && i + 1 < line.length && line[i + 1] === '*') {
                const end = line.indexOf('*/', i + 2);
                if (end !== -1) {
                    tokens.push({ text: line.substring(i, end + 2), type: 'comment' });
                    i = end + 2;
                } else {
                    tokens.push({ text: line.substring(i), type: 'comment' });
                    break;
                }
                continue;
            }

            if (line[i] === '<' && line.substring(i, i + 4) === '<!--') {
                const end = line.indexOf('-->', i + 4);
                if (end !== -1) {
                    tokens.push({ text: line.substring(i, end + 3), type: 'comment' });
                    i = end + 3;
                } else {
                    tokens.push({ text: line.substring(i), type: 'comment' });
                    break;
                }
                continue;
            }

            if (line[i] === '#' && !languageId.startsWith('c')) {
                tokens.push({ text: line.substring(i), type: 'comment' });
                break;
            }

            if (line[i] === '-' && i + 1 < line.length && line[i + 1] === '-' && ['lua', 'sql', 'haskell', 'ada'].includes(languageId)) {
                tokens.push({ text: line.substring(i), type: 'comment' });
                break;
            }

            if (line[i] === ';' && ['assembly', 'lisp', 'clojure', 'scheme', 'asm'].includes(languageId)) {
                tokens.push({ text: line.substring(i), type: 'comment' });
                break;
            }

            if (line[i] === '%' && ['matlab', 'latex', 'tex', 'erlang'].includes(languageId)) {
                tokens.push({ text: line.substring(i), type: 'comment' });
                break;
            }

            if (line[i] === '@' && (isJsLike || isPython || isCStyle || isRust || languageId === 'java' || languageId === 'kotlin' || languageId === 'swift')) {
                let j = i + 1;
                while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) { j++; }
                tokens.push({ text: line.substring(i, j), type: 'decorator' });
                i = j;
                continue;
            }

            if (line[i] === '#' && languageId === 'c') {
                let j = i;
                while (j < line.length && line[j] !== ' ' && line[j] !== '\t') { j++; }
                tokens.push({ text: line.substring(i, j), type: 'keyword' });
                i = j;
                continue;
            }

            if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
                const quote = line[i];
                let j = i + 1;
                while (j < line.length && line[j] !== quote) {
                    if (line[j] === '\\') { j++; }
                    j++;
                }
                tokens.push({ text: line.substring(i, j + 1), type: 'string' });
                i = j + 1;
                continue;
            }

            if (line[i] === 'r' && i + 1 < line.length && (line[i + 1] === '"' || line[i + 1] === "'")) {
                const quote = line[i + 1];
                let j = i + 2;
                while (j < line.length && line[j] !== quote) { j++; }
                tokens.push({ text: line.substring(i, j + 1), type: 'string-regex' });
                i = j + 1;
                continue;
            }

            if (/\d/.test(line[i]) || (line[i] === '.' && i + 1 < line.length && /\d/.test(line[i + 1]))) {
                let j = i;
                if (line[j] === '0' && j + 1 < line.length && (line[j + 1] === 'x' || line[j + 1] === 'X')) {
                    j += 2;
                    while (j < line.length && /[0-9a-fA-F]/.test(line[j])) { j++; }
                } else if (line[j] === '0' && j + 1 < line.length && (line[j + 1] === 'b' || line[j + 1] === 'B')) {
                    j += 2;
                    while (j < line.length && /[01]/.test(line[j])) { j++; }
                } else if (line[j] === '0' && j + 1 < line.length && (line[j + 1] === 'o' || line[j + 1] === 'O')) {
                    j += 2;
                    while (j < line.length && /[0-7]/.test(line[j])) { j++; }
                } else {
                    while (j < line.length && /[\d._]/.test(line[j])) { j++; }
                }
                if (j < line.length && (line[j] === 'e' || line[j] === 'E')) {
                    j++;
                    if (j < line.length && (line[j] === '+' || line[j] === '-')) { j++; }
                    while (j < line.length && /\d/.test(line[j])) { j++; }
                }
                tokens.push({ text: line.substring(i, j), type: 'number' });
                i = j;
                continue;
            }

            if (/[a-zA-Z_$]/.test(line[i])) {
                let j = i;
                while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) { j++; }
                const word = line.substring(i, j);

                if (constants.has(word)) {
                    tokens.push({ text: word, type: 'constant' });
                } else if (variables.has(word)) {
                    tokens.push({ text: word, type: 'variable' });
                } else if (keywords.has(word)) {
                    tokens.push({ text: word, type: 'keyword' });
                } else if (builtinTypes.has(word)) {
                    tokens.push({ text: word, type: 'type-builtin' });
                } else if (j < line.length && line[j] === '(') {
                    tokens.push({ text: word, type: 'function' });
                } else if (word[0] === word[0].toUpperCase() && /[a-z]/.test(word) && word.length > 1) {
                    tokens.push({ text: word, type: 'class' });
                } else if (isJsLike && ['console', 'window', 'document', 'Math', 'JSON', 'Promise', 'Map', 'Set', 'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp', 'Date', 'Error', 'Symbol', 'WeakMap', 'WeakSet', 'Proxy', 'Reflect'].includes(word)) {
                    tokens.push({ text: word, type: 'class' });
                } else if (isPython && ['print', 'len', 'range', 'int', 'str', 'float', 'list', 'dict', 'set', 'tuple', 'type', 'super', 'property', 'staticmethod', 'classmethod', 'isinstance', 'issubclass', 'hasattr', 'getattr', 'setattr', 'open', 'input', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed', 'any', 'all', 'sum', 'min', 'max', 'abs', 'round', 'hash', 'id', 'hex', 'oct', 'bin', 'chr', 'ord', 'bool', 'bytes', 'bytearray', 'memoryview', 'complex', 'frozenset', 'object', 'Exception', 'ValueError', 'TypeError', 'KeyError', 'IndexError', 'AttributeError', 'ImportError', 'StopIteration', 'OSError', 'IOError'].includes(word)) {
                    tokens.push({ text: word, type: 'function' });
                } else if (word[0] === '_') {
                    tokens.push({ text: word, type: 'variable' });
                } else {
                    tokens.push({ text: word, type: 'plain' });
                }
                i = j;
                continue;
            }

            if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
                let j = i;
                while (j < line.length && /[+\-*/%=<>!&|^~?]/.test(line[j])) { j++; }
                tokens.push({ text: line.substring(i, j), type: 'operator' });
                i = j;
                continue;
            }

            if ('(){}[]'.includes(line[i])) {
                tokens.push({ text: line[i], type: 'bracket' });
                i++;
                continue;
            }

            if (line[i] === ';' || line[i] === ',' || line[i] === '.') {
                tokens.push({ text: line[i], type: 'delimiter' });
                i++;
                continue;
            }

            tokens.push({ text: line[i], type: 'plain' });
            i++;
        }

        tokens.push({ text: '\n', type: 'plain' });
    }

    return tokens;
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/`/g, '&#96;');
}

function buildCodeHtml(code: string, languageId: string, config: SnapshotConfig, tokenColors: Record<string, string>): string {
    const lines = code.split('\n');
    const lineNumberWidth = String(lines.length).length;
    const tokens = tokenizeCode(code, languageId);

    const tokenLines: Token[][] = [];
    let currentLine: Token[] = [];
    for (const token of tokens) {
        if (token.text === '\n') {
            tokenLines.push(currentLine);
            currentLine = [];
        } else {
            currentLine.push(token);
        }
    }
    if (currentLine.length > 0) {
        tokenLines.push(currentLine);
    }

    let html = '';
    for (let i = 0; i < tokenLines.length; i++) {
        const lineTokens = tokenLines[i];
        const lineNum = i + 1;
        html += '<div class="code-line">';
        if (config.lineNumbers) {
            html += `<span class="line-number">${String(lineNum).padStart(lineNumberWidth, ' ')}</span>`;
        }
        for (const token of lineTokens) {
            const color = tokenColors[token.type] || tokenColors['plain'] || '#D4D4D4';
            html += `<span style="color:${color}">${escapeHtml(token.text)}</span>`;
        }
        html += '</div>';
    }

    return html;
}

function generateLiveWebviewHtml(config: SnapshotConfig): string {
    const vt = getVisualTheme(config.visualTheme);
    const tokenColors = getTokenColors();
    const mergedColors = { ...tokenColors, ...vt.tokens };
    const isDarkOuter = vt.group === 'dark';
    const textColor = vt.text;
    const lineNumberColor = vt.lineNumber;
    const titleTextColor = vt.titleText;
    const toolbarBg = isDarkOuter ? '#1a1a2a' : '#f0f0f0';
    const toolbarBtnBg = isDarkOuter ? '#2a2a3a' : '#e0e0e0';
    const toolbarBtnHover = isDarkOuter ? '#3a3a4a' : '#d0d0d0';
    const toolbarText = isDarkOuter ? '#ccc' : '#333';
    const toolbarSubtext = isDarkOuter ? '#aaa' : '#666';

    const themeOptions = Object.entries(VISUAL_THEMES).map(([key, t]) =>
        `<option value="${key}" ${key === config.visualTheme ? 'selected' : ''}>${t.name}</option>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
    <title>codeclick</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: ${toolbarBg};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex; flex-direction: column; align-items: center;
            min-height: 100vh; padding: 20px;
        }
        #toolbar {
            display: flex; gap: 8px; margin-bottom: 16px;
            align-items: center; flex-wrap: wrap; justify-content: center;
        }
        .btn { padding: 8px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-primary { background: #007AFF; color: white; }
        .btn-primary:hover:not(:disabled) { background: #0056CC; }
        .btn-secondary { background: ${toolbarBtnBg}; color: ${toolbarText}; }
        .btn-secondary:hover:not(:disabled) { background: ${toolbarBtnHover}; }
        .font-controls { display: flex; align-items: center; gap: 4px; background: ${toolbarBtnBg}; border-radius: 6px; padding: 2px; }
        .font-btn { width: 30px; height: 30px; border: none; border-radius: 4px; background: transparent; color: ${toolbarText}; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .font-btn:hover { background: ${toolbarBtnHover}; }
        .font-size-label { font-size: 12px; color: ${toolbarSubtext}; min-width: 36px; text-align: center; user-select: none; }
        .theme-select { padding: 7px 10px; border: 1px solid ${isDarkOuter ? '#3a3a4a' : '#ccc'}; border-radius: 6px; font-size: 12px; background: ${toolbarBtnBg}; color: ${toolbarText}; cursor: pointer; outline: none; max-width: 150px; }
        .theme-select:hover { border-color: ${isDarkOuter ? '#5a5a6a' : '#999'}; }
        #status { margin-top: 12px; font-size: 12px; color: ${toolbarSubtext}; min-height: 18px; }
        canvas { display: block; border-radius: 12px; }
        #empty-state { color: ${isDarkOuter ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}; font-size: 16px; text-align: center; padding: 80px 20px; letter-spacing: 0.5px; }
    </style>
</head>
<body>
    <div id="toolbar">
        <select class="theme-select" id="themeSelect">${themeOptions}</select>
        <div class="font-controls">
            <button class="font-btn" id="fontDecrease">-</button>
            <span class="font-size-label" id="fontSizeLabel">${config.fontSize}px</span>
            <button class="font-btn" id="fontIncrease">+</button>
        </div>
        <button class="btn btn-primary" id="saveBtn" disabled>Save as PNG</button>
        <button class="btn btn-secondary" id="copyBtn" disabled>Copy to Clipboard</button>
    </div>
    <div id="empty-state"><span style="color:${isDarkOuter ? '#4ADE80' : '#16a34a'};font-weight:bold">❯</span> Select code in the editor to preview</div>
    <canvas id="canvas" style="display:none"></canvas>
    <div id="status"></div>

    <script>
    (function() {
        var vscode = acquireVsCodeApi();
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var status = document.getElementById('status');
        var saveBtn = document.getElementById('saveBtn');
        var copyBtn = document.getElementById('copyBtn');
        var fontSizeLabel = document.getElementById('fontSizeLabel');
        var themeSelect = document.getElementById('themeSelect');
        var emptyState = document.getElementById('empty-state');

        var currentFontSize = ${config.fontSize};
        var currentCode = '';
        var currentLanguage = '';
        var currentFileName = 'code';
        var scale = 2;

        var THEME = ${JSON.stringify({
            codeBg: vt.codeBg,
            titleBarBg: vt.titleBarBg,
            titleText: titleTextColor,
            text: textColor,
            lineNumber: lineNumberColor,
            fontFamily: config.fontFamily,
            windowPadding: config.windowPadding,
            lineNumbers: config.lineNumbers,
            trafficColors: ['#ff5f57', '#febc2e', '#28c840'],
            tokenColors: mergedColors,
        })};

        var KEYWORDS = ${JSON.stringify(ALL_KEYWORDS)};

        function tokenizeLine(line) {
            var tokens = [];
            var i = 0;
            while (i < line.length) {
                if (line[i] === '/' && i + 1 < line.length && line[i+1] === '/') {
                    tokens.push({ text: line.substring(i), type: 'comment' });
                    break;
                }
                if (line[i] === '<' && line.substring(i, i+4) === '<!--') {
                    var end = line.indexOf('-->', i+4);
                    if (end !== -1) { tokens.push({ text: line.substring(i, end+3), type: 'comment' }); i = end+3; }
                    else { tokens.push({ text: line.substring(i), type: 'comment' }); break; }
                    continue;
                }
                if (line[i] === '#') { tokens.push({ text: line.substring(i), type: 'comment' }); break; }
                if (line[i] === '"' || line[i] === "'" || line[i] === '\`') {
                    var q = line[i]; var j = i+1;
                    while (j < line.length && line[j] !== q) { if (line[j] === '\\\\') j++; j++; }
                    tokens.push({ text: line.substring(i, j+1), type: 'string' }); i = j+1; continue;
                }
                if (/\\d/.test(line[i]) || (line[i] === '.' && i+1 < line.length && /\\d/.test(line[i+1]))) {
                    var j = i; while (j < line.length && /[\\d._]/.test(line[j])) j++;
                    tokens.push({ text: line.substring(i, j), type: 'number' }); i = j; continue;
                }
                if (/[a-zA-Z_$]/.test(line[i])) {
                    var j = i; while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
                    var word = line.substring(i, j);
                    var type = KEYWORDS[word] ? 'keyword' : 'plain';
                    tokens.push({ text: word, type: type }); i = j; continue;
                }
                if (/[+\\-*/%=<>!&|^~?:]/.test(line[i])) {
                    var j = i; while (j < line.length && /[+\\-*/%=<>!&|^~?:]/.test(line[j])) j++;
                    tokens.push({ text: line.substring(i, j), type: 'operator' }); i = j; continue;
                }
                if (/[(){}\\[\\];,.]/.test(line[i])) {
                    tokens.push({ text: line[i], type: 'delimiter' }); i++; continue;
                }
                tokens.push({ text: line[i], type: 'plain' }); i++;
            }
            return tokens;
        }

        function render() {
            if (!currentCode) return;
            var lines = currentCode.split('\\n');
            var tokenLines = lines.map(function(l) { return tokenizeLine(l); });
            var lineH = currentFontSize * 1.7;
            var titleH = 44;
            var codeH = lines.length * lineH + THEME.windowPadding * 2;
            var totalH = titleH + codeH;
            var w = 800;
            var maxLen = 0;
            for (var i = 0; i < tokenLines.length; i++) {
                var lineText = '';
                for (var j = 0; j < tokenLines[i].length; j++) lineText += tokenLines[i][j].text;
                if (lineText.length > maxLen) maxLen = lineText.length;
            }
            if (maxLen * currentFontSize * 0.6 + 80 > w) w = Math.min(maxLen * currentFontSize * 0.6 + 80, 1200);

            canvas.width = w * scale;
            canvas.height = totalH * scale;
            canvas.style.width = w + 'px';
            canvas.style.height = totalH + 'px';
            ctx.scale(scale, scale);

            var r = 12;
            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.lineTo(w - r, 0);
            ctx.quadraticCurveTo(w, 0, w, r);
            ctx.lineTo(w, totalH - r);
            ctx.quadraticCurveTo(w, totalH, w - r, totalH);
            ctx.lineTo(r, totalH);
            ctx.quadraticCurveTo(0, totalH, 0, totalH - r);
            ctx.lineTo(0, r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.closePath();
            ctx.clip();

            ctx.fillStyle = THEME.codeBg;
            ctx.fillRect(0, 0, w, totalH);

            ctx.fillStyle = THEME.titleBarBg;
            ctx.fillRect(0, 0, w, titleH);

            for (var i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(20 + i * 22, titleH / 2, 6, 0, Math.PI * 2);
                ctx.fillStyle = THEME.trafficColors[i];
                ctx.fill();
            }

            ctx.fillStyle = THEME.titleText;
            ctx.font = '500 13px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(currentFileName, w / 2, titleH / 2);
            ctx.textAlign = 'left';

            ctx.font = currentFontSize + 'px ' + THEME.fontFamily;
            ctx.textBaseline = 'top';
            var y = titleH + THEME.windowPadding;
            var lineNumW = String(lines.length).length;

            for (var li = 0; li < lines.length; li++) {
                var x = THEME.windowPadding;
                if (THEME.lineNumbers) {
                    ctx.fillStyle = THEME.lineNumber;
                    ctx.globalAlpha = 0.5;
                    ctx.fillText(String(li + 1).padStart(lineNumW, ' '), x, y);
                    ctx.globalAlpha = 1;
                    x += (lineNumW + 2) * currentFontSize * 0.6 + 16;
                }
                var toks = tokenLines[li] || [];
                for (var ti = 0; ti < toks.length; ti++) {
                    ctx.fillStyle = THEME.tokenColors[toks[ti].type] || THEME.tokenColors['plain'] || '#D4D4D4';
                    ctx.fillText(toks[ti].text, x, y);
                    x += ctx.measureText(toks[ti].text).width;
                }
                y += lineH;
            }
        }

        window.addEventListener('message', function(event) {
            var msg = event.data;
            if (msg.type === 'updateCode') {
                currentCode = msg.code || '';
                currentLanguage = msg.language || '';
                currentFileName = msg.fileName || 'code';
                if (currentCode) {
                    emptyState.style.display = 'none';
                    canvas.style.display = 'block';
                    saveBtn.disabled = false;
                    copyBtn.disabled = false;
                    render();
                } else {
                    emptyState.style.display = 'block';
                    canvas.style.display = 'none';
                    saveBtn.disabled = true;
                    copyBtn.disabled = true;
                }
            } else if (msg.type === 'done') {
                status.textContent = msg.message || '';
                saveBtn.disabled = false; copyBtn.disabled = false;
            }
        });

        document.getElementById('fontDecrease').addEventListener('click', function() {
            if (currentFontSize > 8) { currentFontSize -= 1; fontSizeLabel.textContent = currentFontSize + 'px'; render(); }
        });
        document.getElementById('fontIncrease').addEventListener('click', function() {
            if (currentFontSize < 32) { currentFontSize += 1; fontSizeLabel.textContent = currentFontSize + 'px'; render(); }
        });
        themeSelect.addEventListener('change', function() {
            vscode.postMessage({ type: 'changeTheme', theme: themeSelect.value, fontSize: currentFontSize });
        });
        saveBtn.addEventListener('click', function() {
            if (!currentCode) { status.textContent = 'No code to save!'; return; }
            status.textContent = 'Saving...'; saveBtn.disabled = true; copyBtn.disabled = true;
            var data = canvas.toDataURL('image/png');
            if (!data || data.length < 200) { status.textContent = 'Error: empty canvas'; saveBtn.disabled = false; copyBtn.disabled = false; return; }
            vscode.postMessage({ type: 'save', data: data.split(',')[1] });
        });
        copyBtn.addEventListener('click', function() {
            if (!currentCode) { status.textContent = 'No code to copy!'; return; }
            status.textContent = 'Copying...'; saveBtn.disabled = true; copyBtn.disabled = true;
            var data = canvas.toDataURL('image/png');
            if (!data || data.length < 200) { status.textContent = 'Error: empty canvas'; saveBtn.disabled = false; copyBtn.disabled = false; return; }
            vscode.postMessage({ type: 'copy', data: data.split(',')[1] });
        });
    })();
    </script>
</body>
</html>`;
}

async function captureCode(): Promise<{ code: string; languageId: string; fileName: string } | undefined> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor found.');
        return undefined;
    }

    const document = editor.document;
    const selection = editor.selection;

    let code: string;
    if (selection && !selection.isEmpty) {
        code = document.getText(selection);
    } else {
        code = document.getText();
    }

    if (!code.trim()) {
        vscode.window.showWarningMessage('No code to capture.');
        return undefined;
    }

    const lines = code.split('\n');

    return {
        code,
        languageId: document.languageId,
        fileName: document.fileName,
    };
}

async function saveImageToFile(base64Data: string): Promise<void> {
    const defaultName = `code-snapshot-${Date.now()}.png`;
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || os.homedir();

    const uri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(workspaceFolder, defaultName)),
        filters: { 'PNG Image': ['png'] },
        saveLabel: 'Save Code Snapshot',
    });

    if (uri) {
        const buffer = Buffer.from(base64Data, 'base64');
        await vscode.workspace.fs.writeFile(uri, buffer);
        vscode.window.showInformationMessage(`Code snapshot saved to ${uri.fsPath}`);
    }
}

async function copyImageToClipboard(base64Data: string): Promise<void> {
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `codeclick-${Date.now()}.png`);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(tempFile, buffer);

    try {
        const platform = os.platform();
        if (platform === 'darwin') {
            execSync(`osascript -e 'set the clipboard to (read (POSIX file "${tempFile}") as TIFF picture)'`, { timeout: 10000 });
            vscode.window.showInformationMessage('Code snapshot copied to clipboard!');
        } else if (platform === 'win32') {
            const psScript = `Add-Type -AssemblyName System.Windows.Forms; $img = [System.Drawing.Image]::FromFile('${tempFile}'); [System.Windows.Forms.Clipboard]::SetImage($img); $img.Dispose()`;
            const psFile = path.join(tempDir, `codeclick-ps-${Date.now()}.ps1`);
            fs.writeFileSync(psFile, psScript, 'utf-8');
            try {
                execSync(`powershell -ExecutionPolicy Bypass -File "${psFile}"`, { timeout: 15000 });
                vscode.window.showInformationMessage('Code snapshot copied to clipboard!');
            } finally {
                try { fs.unlinkSync(psFile); } catch { /* ignore */ }
            }
        } else {
            execSync(`xclip -selection clipboard -t image/png -i "${tempFile}"`, { timeout: 10000 });
            vscode.window.showInformationMessage('Code snapshot copied to clipboard!');
        }
    } catch (e: any) {
        vscode.window.showWarningMessage('Could not copy to clipboard: ' + (e.message || e));
    } finally {
        try { fs.unlinkSync(tempFile); } catch { /* ignore */ }
    }
}

export function activate(context: vscode.ExtensionContext) {
    const takeSnapshot = vscode.commands.registerCommand('codeclick.takeSnapshot', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found.');
            return;
        }

        const config = getConfig();
        const panel = vscode.window.createWebviewPanel(
            'codeclick',
            'codeclick',
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [],
            }
        );
        panel.iconPath = {
            light: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'snapshot-light.svg')),
            dark: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'snapshot-dark.svg')),
        };

        panel.webview.html = generateLiveWebviewHtml(config);

        let lastCode = '';
        let lastLanguage = '';
        let lastFileName = 'code';

        function sendCodeUpdate() {
            const ed = vscode.window.activeTextEditor;
            if (!ed || !panel.visible) { return; }
            const sel = ed.selection;
            let code = '';
            if (sel && !sel.isEmpty) {
                code = ed.document.getText(sel);
            }
            lastCode = code;
            lastLanguage = ed.document.languageId;
            lastFileName = path.basename(ed.document.fileName);
            panel.webview.postMessage({ type: 'updateCode', code, language: lastLanguage, fileName: lastFileName });
        }

        const selectionDisposable = vscode.window.onDidChangeTextEditorSelection(() => { sendCodeUpdate(); });
        const visibleDisposable = panel.onDidChangeViewState(() => { if (panel.visible) { sendCodeUpdate(); } });

        panel.webview.onDidReceiveMessage(async (message: { type: string; data?: string; theme?: string; fontSize?: number }) => {
            if (message.type === 'save' && message.data) {
                if (!message.data || message.data.length < 100) {
                    panel.webview.postMessage({ type: 'done', message: 'No code selected!' });
                    return;
                }
                await saveImageToFile(message.data);
                panel.webview.postMessage({ type: 'done', message: 'Image saved!' });
            } else if (message.type === 'copy' && message.data) {
                if (!message.data || message.data.length < 100) {
                    panel.webview.postMessage({ type: 'done', message: 'No code selected!' });
                    return;
                }
                await copyImageToClipboard(message.data);
                panel.webview.postMessage({ type: 'done', message: 'Copied to clipboard!' });
            } else if (message.type === 'changeTheme' && message.theme) {
                await vscode.workspace.getConfiguration('codeclick').update('visualTheme', message.theme, vscode.ConfigurationTarget.Global);
                const newConfig = getConfig();
                if (message.fontSize) { newConfig.fontSize = message.fontSize; }
                panel.webview.html = generateLiveWebviewHtml(newConfig);
                const savedCode = lastCode;
                const savedLang = lastLanguage;
                const savedFile = lastFileName;
                const retrySend = (attempts: number) => {
                    if (attempts <= 0) { return; }
                    setTimeout(() => {
                        if (panel.visible) {
                            panel.webview.postMessage({ type: 'updateCode', code: savedCode, language: savedLang, fileName: savedFile });
                        } else {
                            retrySend(attempts - 1);
                        }
                    }, 300);
                };
                retrySend(5);
            }
        });

        panel.onDidDispose(() => {
            selectionDisposable.dispose();
            visibleDisposable.dispose();
        });

        sendCodeUpdate();
    });

    const copyToClipboard = vscode.commands.registerCommand('codeclick.copyToClipboard', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found.');
            return;
        }

        const sel = editor.selection;
        let code = '';
        if (sel && !sel.isEmpty) {
            code = editor.document.getText(sel);
        }
        if (!code.trim()) {
            vscode.window.showWarningMessage('Select code first.');
            return;
        }

        const config = getConfig();
        const panel = vscode.window.createWebviewPanel(
            'codeclick-quick',
            'codeclick',
            vscode.ViewColumn.Active,
            {
                enableScripts: true,
                retainContextWhenHidden: false,
                localResourceRoots: [],
            }
        );
        panel.iconPath = {
            light: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'snapshot-light.svg')),
            dark: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'snapshot-dark.svg')),
        };

        panel.webview.html = generateLiveWebviewHtml(config);
        const fileName = path.basename(editor.document.fileName);
        const languageId = editor.document.languageId;
        setTimeout(() => {
            panel.webview.postMessage({ type: 'updateCode', code, language: languageId, fileName });
        }, 200);

        let handled = false;
        const disposable = panel.webview.onDidReceiveMessage(async (message: { type: string; data?: string; theme?: string; fontSize?: number }) => {
            if (message.type === 'changeTheme' && message.theme) {
                await vscode.workspace.getConfiguration('codeclick').update('visualTheme', message.theme, vscode.ConfigurationTarget.Global);
                const newConfig = getConfig();
                if (message.fontSize) { newConfig.fontSize = message.fontSize; }
                panel.webview.html = generateLiveWebviewHtml(newConfig);
                setTimeout(() => {
                    panel.webview.postMessage({ type: 'updateCode', code, language: languageId, fileName });
                }, 200);
                return;
            }
            if (handled) { return; }
            handled = true;

            if (message.type === 'copy' && message.data) {
                await copyImageToClipboard(message.data);
                panel.webview.postMessage({ type: 'done', message: 'Copied to clipboard!' });
                setTimeout(() => panel.dispose(), 1500);
            } else if (message.type === 'save' && message.data) {
                await saveImageToFile(message.data);
                panel.webview.postMessage({ type: 'done', message: 'Image saved!' });
                setTimeout(() => panel.dispose(), 1500);
            }
        });

        panel.onDidDispose(() => disposable.dispose());
    });

    context.subscriptions.push(takeSnapshot, copyToClipboard);
}

export function deactivate() {}
