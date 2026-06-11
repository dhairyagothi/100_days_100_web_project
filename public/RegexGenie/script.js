/**
 * RegexGenie — Script Module
 * Interactive AI Regex Builder & Real-time Visualizer
 * ===================================================
 * Offline-first plain-English → regex generator with
 * live match highlighting and interactive syntax breakdown.
 */

// ── DOM Nodes ──────────────────────────────────────────
const aiPrompt = document.getElementById('aiPrompt');
const generateBtn = document.getElementById('generateBtn');
const regexInput = document.getElementById('regexInput');
const flagG = document.getElementById('flagG');
const flagI = document.getElementById('flagI');
const flagM = document.getElementById('flagM');
const flagS = document.getElementById('flagS');
const regexError = document.getElementById('regexError');
const testText = document.getElementById('testText');
const highlightOverlay = document.getElementById('highlightOverlay');
const matchCount = document.getElementById('matchCount');
const groupCount = document.getElementById('groupCount');
const matchDetails = document.getElementById('matchDetails');
const matchList = document.getElementById('matchList');
const matchSummary = document.getElementById('matchSummary');
const syntaxBreakdown = document.getElementById('syntaxBreakdown');
const copyBtn = document.getElementById('copyBtn');
const copyText = document.getElementById('copyText');
const clearBtn = document.getElementById('clearBtn');
const quickPromptsContainer = document.getElementById('quickPrompts');
const cheatsheetToggle = document.getElementById('cheatsheetToggle');
const cheatsheetContent = document.getElementById('cheatsheetContent');
const cheatsheetArrow = document.getElementById('cheatsheetArrow');
const cheatsheetGrid = document.getElementById('cheatsheetGrid');

// ── Comprehensive Pattern Dictionary ───────────────────
// Each entry has keywords, a regex pattern, and a description.
const patternLibrary = [
    {
        keywords: ['email', 'mail', 'e-mail', 'email address'],
        pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}',
        description: 'Matches standard email addresses'
    },
    {
        keywords: ['url', 'link', 'website', 'web address', 'http', 'https'],
        pattern: 'https?:\\/\\/(?:www\\.)?[a-zA-Z0-9][a-zA-Z0-9\\-]*(?:\\.[a-zA-Z]{2,})+(?:\\/[^\\s]*)?',
        description: 'Matches HTTP/HTTPS URLs'
    },
    {
        keywords: ['phone', 'telephone', 'phone number', 'mobile', 'cell'],
        pattern: '\\+?\\d{1,3}[\\s\\-.]?\\(?\\d{1,4}\\)?[\\s\\-.]?\\d{1,4}[\\s\\-.]?\\d{1,9}',
        description: 'Matches international and domestic phone numbers'
    },
    {
        keywords: ['ip', 'ip address', 'ipv4', 'ip4'],
        pattern: '\\b(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b',
        description: 'Matches valid IPv4 addresses (0.0.0.0 – 255.255.255.255)'
    },
    {
        keywords: ['hex', 'hex color', 'color code', 'colour', 'css color'],
        pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
        description: 'Matches 3- and 6-digit hex color codes like #FFF or #3BCD96'
    },
    {
        keywords: ['date', 'dates', 'dd/mm/yyyy', 'mm/dd/yyyy'],
        pattern: '\\b\\d{1,2}[\\/\\-.]\\d{1,2}[\\/\\-.]\\d{2,4}\\b',
        description: 'Matches dates in DD/MM/YYYY, MM-DD-YYYY, and similar formats'
    },
    {
        keywords: ['iso date', 'iso 8601', 'yyyy-mm-dd', 'iso'],
        pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b',
        description: 'Matches ISO 8601 dates (YYYY-MM-DD)'
    },
    {
        keywords: ['time', 'clock', 'hh:mm', 'timestamp'],
        pattern: '\\b(?:[01]?\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?\\b',
        description: 'Matches 24-hour time (HH:MM or HH:MM:SS)'
    },
    {
        keywords: ['number', 'integer', 'digit', 'numeric'],
        pattern: '\\b\\d+\\b',
        description: 'Matches whole numbers (integers)'
    },
    {
        keywords: ['decimal', 'float', 'floating point'],
        pattern: '-?\\d+\\.\\d+',
        description: 'Matches decimal/floating-point numbers'
    },
    {
        keywords: ['alphabetic', 'only letters', 'letters only'],
        pattern: '\\b[a-zA-Z]+\\b',
        description: 'Matches alphabetic words'
    },
    {
        keywords: ['capitalized', 'proper noun', 'uppercase word', 'name'],
        pattern: '\\b[A-Z][a-z]+\\b',
        description: 'Matches capitalized words (e.g. proper nouns)'
    },
    {
        keywords: ['hashtag', 'hash tag', 'twitter tag'],
        pattern: '#[a-zA-Z_]\\w*',
        description: 'Matches hashtags like #OpenSource'
    },
    {
        keywords: ['mention', 'at mention', 'username', '@'],
        pattern: '@[a-zA-Z_]\\w*',
        description: 'Matches @mentions like @username'
    },
    {
        keywords: ['mac', 'mac address', 'hardware address'],
        pattern: '(?:[0-9A-Fa-f]{2}[:\\-]){5}[0-9A-Fa-f]{2}',
        description: 'Matches MAC addresses (colon or hyphen separated)'
    },
    {
        keywords: ['zip', 'zip code', 'postal', 'postal code', 'us zip'],
        pattern: '\\b\\d{5}(?:-\\d{4})?\\b',
        description: 'Matches US ZIP codes (5-digit or ZIP+4)'
    },
    {
        keywords: ['credit card', 'card number', 'visa', 'mastercard'],
        pattern: '\\b(?:4\\d{3}|5[1-5]\\d{2}|3[47]\\d{2}|6(?:011|5\\d{2}))[\\s\\-]?\\d{4}[\\s\\-]?\\d{4}[\\s\\-]?\\d{4}\\b',
        description: 'Matches Visa, Mastercard, Amex, and Discover card formats'
    },
    {
        keywords: ['ssn', 'social security', 'social security number'],
        pattern: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
        description: 'Matches US Social Security Numbers (XXX-XX-XXXX)'
    },
    {
        keywords: ['html tag', 'tag', 'html', 'element', 'markup'],
        pattern: '<\\/?[a-zA-Z][a-zA-Z0-9]*(?:\\s[^>]*)?\\/?>',
        description: 'Matches HTML/XML tags'
    },
    {
        keywords: ['variable', 'camelcase', 'camel case', 'identifier'],
        pattern: '\\b[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\\b',
        description: 'Matches camelCase identifiers'
    },
    {
        keywords: ['whitespace', 'spaces', 'blank', 'tabs'],
        pattern: '\\s+',
        description: 'Matches one or more whitespace characters'
    },
    {
        keywords: ['sentence', 'full sentence'],
        pattern: '[A-Z][^.!?]*[.!?]',
        description: 'Matches sentences starting with a capital letter'
    },
    {
        keywords: ['bracket', 'brackets', 'parentheses', 'inside brackets'],
        pattern: '\\([^)]*\\)',
        description: 'Matches content inside parentheses (including the parens)'
    },
    {
        keywords: ['quoted', 'string', 'double quote', 'quoted text'],
        pattern: '"[^"]*"',
        description: 'Matches double-quoted strings'
    },
    {
        keywords: ['single quote', 'single quoted'],
        pattern: "'[^']*'",
        description: 'Matches single-quoted strings'
    },
    {
        keywords: ['domain', 'domain name'],
        pattern: '\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b',
        description: 'Matches domain names like example.com'
    },
    {
        keywords: ['order', 'order number', 'order id', 'reference'],
        pattern: '[A-Z]{2,4}-\\d{4}-\\d{2,6}',
        description: 'Matches order/reference numbers like ORD-2026-0529'
    },
    {
        keywords: ['rgb', 'rgb color'],
        pattern: 'rgb\\(\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*\\)',
        description: 'Matches CSS rgb() color values'
    },
    {
        keywords: ['currency', 'money', 'dollar', 'price'],
        pattern: '\\$\\d{1,3}(?:,\\d{3})*(?:\\.\\d{2})?',
        description: 'Matches US dollar amounts like $1,234.56'
    },
    {
        keywords: ['password', 'strong password'],
        pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}',
        description: 'Validates strong passwords (8+ chars, upper, lower, digit, special)'
    },
    {
        keywords: ['uuid', 'guid'],
        pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
        description: 'Matches UUID v4 format strings'
    },
    {
        keywords: ['file', 'filename', 'extension', 'file extension'],
        pattern: '\\b\\w+\\.(?:js|ts|html|css|json|py|java|cpp|md|txt)\\b',
        description: 'Matches common filenames with extensions'
    }
];

// ── Quick prompt suggestions ───────────────────────────
const quickPrompts = [
    { emoji: '📧', text: 'Email addresses' },
    { emoji: '🔗', text: 'URLs and links' },
    { emoji: '📱', text: 'Phone numbers' },
    { emoji: '🎨', text: 'Hex colors' },
    { emoji: '📅', text: 'Dates' },
    { emoji: '🔢', text: 'Numbers' },
    { emoji: '🌐', text: 'IP addresses' },
    { emoji: '💳', text: 'Credit cards' },
];

// ── Regex Syntax Token Explanations ────────────────────
const tokenExplanations = {
    // Character classes
    '\\d':   { label: 'Any digit (0–9)', type: 'escape' },
    '\\D':   { label: 'Any non-digit', type: 'escape' },
    '\\w':   { label: 'Word char (a-z, 0-9, _)', type: 'escape' },
    '\\W':   { label: 'Non-word char', type: 'escape' },
    '\\s':   { label: 'Whitespace (space, tab, newline)', type: 'escape' },
    '\\S':   { label: 'Non-whitespace', type: 'escape' },
    '\\b':   { label: 'Word boundary', type: 'anchor' },
    '\\B':   { label: 'Non-word boundary', type: 'anchor' },
    '\\.':   { label: 'Literal dot (.)', type: 'escape' },
    '\\+':   { label: 'Literal plus (+)', type: 'escape' },
    '\\*':   { label: 'Literal asterisk (*)', type: 'escape' },
    '\\?':   { label: 'Literal question mark (?)', type: 'escape' },
    '\\(':   { label: 'Literal open parenthesis', type: 'escape' },
    '\\)':   { label: 'Literal close parenthesis', type: 'escape' },
    '\\[':   { label: 'Literal open bracket', type: 'escape' },
    '\\]':   { label: 'Literal close bracket', type: 'escape' },
    '\\/':   { label: 'Literal forward slash', type: 'escape' },
    '\\-':   { label: 'Literal hyphen', type: 'escape' },
    '\\n':   { label: 'Newline', type: 'escape' },
    '\\t':   { label: 'Tab', type: 'escape' },
    '\\r':   { label: 'Carriage return', type: 'escape' },

    // Quantifiers
    '+':     { label: 'One or more', type: 'quantifier' },
    '*':     { label: 'Zero or more', type: 'quantifier' },
    '?':     { label: 'Zero or one (optional)', type: 'quantifier' },
    '+?':    { label: 'One or more (lazy)', type: 'quantifier' },
    '*?':    { label: 'Zero or more (lazy)', type: 'quantifier' },

    // Anchors
    '^':     { label: 'Start of string/line', type: 'anchor' },
    '$':     { label: 'End of string/line', type: 'anchor' },

    // Alternation
    '|':     { label: 'OR (alternation)', type: 'alternation' },

    // Special
    '.':     { label: 'Any character (except newline)', type: 'escape' },
};

// ── Cheatsheet Data ────────────────────────────────────
const cheatsheetData = [
    {
        title: 'Anchors',
        items: [
            { code: '^', desc: 'Start of string' },
            { code: '$', desc: 'End of string' },
            { code: '\\b', desc: 'Word boundary' },
        ]
    },
    {
        title: 'Character Classes',
        items: [
            { code: '.', desc: 'Any character' },
            { code: '\\d / \\D', desc: 'Digit / non-digit' },
            { code: '\\w / \\W', desc: 'Word / non-word' },
            { code: '\\s / \\S', desc: 'Space / non-space' },
            { code: '[abc]', desc: 'Any of a, b, c' },
            { code: '[^abc]', desc: 'Not a, b, or c' },
        ]
    },
    {
        title: 'Quantifiers',
        items: [
            { code: '*', desc: '0 or more' },
            { code: '+', desc: '1 or more' },
            { code: '?', desc: '0 or 1' },
            { code: '{n}', desc: 'Exactly n' },
            { code: '{n,m}', desc: 'Between n and m' },
        ]
    },
    {
        title: 'Groups & Lookaround',
        items: [
            { code: '(abc)', desc: 'Capture group' },
            { code: '(?:abc)', desc: 'Non-capture group' },
            { code: '(?=abc)', desc: 'Positive lookahead' },
            { code: '(?!abc)', desc: 'Negative lookahead' },
        ]
    },
    {
        title: 'Flags',
        items: [
            { code: 'g', desc: 'Global (all matches)' },
            { code: 'i', desc: 'Case insensitive' },
            { code: 'm', desc: 'Multiline' },
            { code: 's', desc: 'Dotall (. matches \\n)' },
        ]
    },
    {
        title: 'Escapes',
        items: [
            { code: '\\.', desc: 'Literal period' },
            { code: '\\\\', desc: 'Literal backslash' },
            { code: '\\n', desc: 'Newline' },
            { code: '\\t', desc: 'Tab character' },
        ]
    },
];

// ── Initialization ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderQuickPrompts();
    renderCheatsheet();
    triggerVisualization();
    syncScrollPositions();
});

// ── Quick Prompts Rendering ────────────────────────────
function renderQuickPrompts() {
    quickPromptsContainer.innerHTML = quickPrompts.map(
        (p, i) => `<button class="prompt-chip animate-pop-in" style="animation-delay:${i * 50}ms" data-prompt="${p.text}">${p.emoji} ${p.text}</button>`
    ).join('');

    quickPromptsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.prompt-chip');
        if (!chip) return;
        aiPrompt.value = chip.dataset.prompt;
        handleGenerate();
    });
}

// ── Cheatsheet Rendering ───────────────────────────────
function renderCheatsheet() {
    cheatsheetGrid.innerHTML = cheatsheetData.map(group => `
        <div class="cheatsheet-group">
            <h3>${group.title}</h3>
            ${group.items.map(item => `
                <div class="cheatsheet-item">
                    <code>${escapeHtml(item.code)}</code>
                    <span>${item.desc}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// ── Cheatsheet Toggle ──────────────────────────────────
cheatsheetToggle.addEventListener('click', () => {
    const isHidden = cheatsheetContent.classList.toggle('hidden');
    cheatsheetArrow.style.transform = isHidden ? '' : 'rotate(180deg)';
});

// ── Generate Regex from Plain English ──────────────────
generateBtn.addEventListener('click', handleGenerate);
aiPrompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleGenerate();
});

function handleGenerate() {
    const query = aiPrompt.value.trim().toLowerCase();
    if (!query) {
        aiPrompt.focus();
        return;
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of patternLibrary) {
        let score = 0;
        for (const keyword of entry.keywords) {
            if (query.includes(keyword)) {
                // Longer keyword matches are more specific
                score += keyword.length;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch) {
        regexInput.value = bestMatch.pattern;
    } else {
        // Smart fallback: try to extract something useful
        if (query.includes('start') || query.includes('begin')) {
            regexInput.value = '^.*';
        } else if (query.includes('end')) {
            regexInput.value = '.*$';
        } else if (query.includes('any')) {
            regexInput.value = '.+';
        } else {
            // Generate a literal search for the user's query words
            const stopWords = ['extract', 'find', 'search', 'match', 'get', 'show', 'the', 'a', 'an', 'some', 'all', 'word', 'words', 'text', 'string', 'that', 'this', 'and', 'or'];
            const words = query.split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 0);
            
            if (words.length > 0) {
                // Escape special regex characters in the literal words
                const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                // If they typed multiple words, assume they want to match the exact phrase with spaces
                regexInput.value = words.map(escapeRegex).join(' ');
            } else {
                regexInput.value = '[a-zA-Z]+';
            }
        }
    }

    // Visual feedback
    regexInput.classList.add('regex-flash');
    setTimeout(() => regexInput.classList.remove('regex-flash'), 600);

    triggerVisualization();
}

// ── Core Visualization Engine ──────────────────────────
function triggerVisualization() {
    const pattern = regexInput.value;
    const text = testText.value;

    // Clear previous state
    if (!pattern || !text) {
        highlightOverlay.innerHTML = escapeHtml(text || '');
        matchCount.textContent = '0';
        groupCount.textContent = '0';
        matchDetails.classList.add('hidden');
        updateSyntaxBreakdown(pattern || '');
        return;
    }

    // Build flags
    let flags = '';
    if (flagG.checked) flags += 'g';
    if (flagI.checked) flags += 'i';
    if (flagM.checked) flags += 'm';
    if (flagS.checked) flags += 's';

    try {
        regexError.classList.add('hidden');
        const regex = new RegExp(pattern, flags);

        let highlightedHtml = '';
        let totalMatches = 0;
        let totalGroups = 0;
        const matchEntries = [];

        if (flags.includes('g')) {
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(text)) !== null) {
                // Guard against infinite loops on zero-length matches
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                    continue;
                }

                totalMatches++;
                highlightedHtml += escapeHtml(text.substring(lastIndex, match.index));
                highlightedHtml += `<span class="match-highlight">${escapeHtml(match[0])}</span>`;
                lastIndex = regex.lastIndex;

                // Track groups
                const groups = match.slice(1).filter(g => g !== undefined);
                totalGroups += groups.length;

                matchEntries.push({
                    index: totalMatches,
                    value: match[0],
                    position: match.index,
                    groups: groups,
                });

                // Safety: cap at 500 matches to prevent UI freeze
                if (totalMatches >= 500) break;
            }
            highlightedHtml += escapeHtml(text.substring(lastIndex));

        } else {
            const match = text.match(regex);
            if (match) {
                totalMatches = 1;
                const idx = text.search(regex);
                highlightedHtml =
                    escapeHtml(text.substring(0, idx)) +
                    `<span class="match-highlight">${escapeHtml(match[0])}</span>` +
                    escapeHtml(text.substring(idx + match[0].length));

                const groups = match.slice(1).filter(g => g !== undefined);
                totalGroups = groups.length;
                matchEntries.push({ index: 1, value: match[0], position: idx, groups });
            } else {
                highlightedHtml = escapeHtml(text);
            }
        }

        highlightOverlay.innerHTML = highlightedHtml;
        matchCount.textContent = totalMatches;
        groupCount.textContent = totalGroups;

        // Render match list
        renderMatchDetails(matchEntries);
        updateSyntaxBreakdown(pattern);

    } catch (err) {
        regexError.textContent = `⚠ ${err.message}`;
        regexError.classList.remove('hidden');
        highlightOverlay.innerHTML = escapeHtml(text);
        matchCount.textContent = '0';
        groupCount.textContent = '0';
        matchDetails.classList.add('hidden');
        updateSyntaxBreakdown('');
    }
}

// ── Match Details Panel ────────────────────────────────
function renderMatchDetails(entries) {
    if (entries.length === 0) {
        matchDetails.classList.add('hidden');
        return;
    }

    matchDetails.classList.remove('hidden');
    matchSummary.textContent = `${entries.length} match${entries.length !== 1 ? 'es' : ''} found`;

    const maxToShow = Math.min(entries.length, 100);
    matchList.innerHTML = entries.slice(0, maxToShow).map(m => `
        <div class="match-item">
            <span class="match-index">${m.index}.</span>
            <span class="match-value">${escapeHtml(m.value)}</span>
            <span class="match-position">pos ${m.position}</span>
        </div>
    `).join('');

    if (entries.length > maxToShow) {
        matchList.innerHTML += `<div class="match-item text-slate-500 text-xs">… and ${entries.length - maxToShow} more</div>`;
    }
}

// ── Syntax Breakdown ───────────────────────────────────
function updateSyntaxBreakdown(pattern) {
    if (!pattern) {
        syntaxBreakdown.innerHTML = '<span class="text-slate-600 text-xs italic">Enter a regex pattern to see its breakdown</span>';
        return;
    }

    const tokens = tokenizeRegex(pattern);
    syntaxBreakdown.innerHTML = tokens.map((token, i) => {
        const info = getTokenInfo(token);
        return `<span class="syntax-token syntax-token--${info.type} animate-pop-in" style="animation-delay:${i * 30}ms" title="${escapeHtml(info.label)}">
            <span class="token-pattern">${escapeHtml(token)}</span>
            <span class="token-label">${escapeHtml(info.label)}</span>
        </span>`;
    }).join('');
}

/**
 * Tokenizes a regex pattern string into meaningful tokens
 * for the syntax breakdown display.
 */
function tokenizeRegex(pattern) {
    const tokens = [];
    let i = 0;

    while (i < pattern.length) {
        const ch = pattern[i];

        // Escaped sequences
        if (ch === '\\' && i + 1 < pattern.length) {
            tokens.push(pattern.substring(i, i + 2));
            i += 2;
            continue;
        }

        // Quantifiers with braces {n} or {n,m}
        if (ch === '{') {
            const end = pattern.indexOf('}', i);
            if (end !== -1) {
                tokens.push(pattern.substring(i, end + 1));
                i = end + 1;
                continue;
            }
        }

        // Character classes [...]
        if (ch === '[') {
            let end = i + 1;
            // Handle negation and closing bracket edge cases
            if (end < pattern.length && pattern[end] === '^') end++;
            if (end < pattern.length && pattern[end] === ']') end++;
            while (end < pattern.length && pattern[end] !== ']') {
                if (pattern[end] === '\\') end++; // skip escaped chars inside class
                end++;
            }
            if (end < pattern.length) end++; // include closing ]
            tokens.push(pattern.substring(i, end));
            i = end;
            continue;
        }

        // Groups (...) — just capture the parens, not the whole group
        if (ch === '(') {
            // Check for special group prefixes
            if (pattern.substring(i, i + 3) === '(?:') {
                tokens.push('(?:');
                i += 3;
            } else if (pattern.substring(i, i + 3) === '(?=') {
                tokens.push('(?=');
                i += 3;
            } else if (pattern.substring(i, i + 3) === '(?!') {
                tokens.push('(?!');
                i += 3;
            } else if (pattern.substring(i, i + 4) === '(?<=') {
                tokens.push('(?<=');
                i += 4;
            } else if (pattern.substring(i, i + 4) === '(?<!') {
                tokens.push('(?<!');
                i += 4;
            } else {
                tokens.push('(');
                i += 1;
            }
            continue;
        }

        if (ch === ')') {
            tokens.push(')');
            i += 1;
            continue;
        }

        // Lazy quantifiers
        if ((ch === '+' || ch === '*') && i + 1 < pattern.length && pattern[i + 1] === '?') {
            tokens.push(ch + '?');
            i += 2;
            continue;
        }

        // Single-character tokens (quantifiers, anchors, alternation, dot, literals)
        tokens.push(ch);
        i++;
    }

    return tokens;
}

/**
 * Returns display info for a given regex token.
 */
function getTokenInfo(token) {
    // Direct lookup
    if (tokenExplanations[token]) {
        return tokenExplanations[token];
    }

    // Character classes
    if (token.startsWith('[') && token.endsWith(']')) {
        const inner = token.slice(1, -1);
        if (inner.startsWith('^')) {
            return { label: `Not: ${inner.slice(1)}`, type: 'charset' };
        }
        return { label: `One of: ${inner}`, type: 'charset' };
    }

    // Quantifier braces
    if (token.startsWith('{') && token.endsWith('}')) {
        const inner = token.slice(1, -1);
        if (inner.includes(',')) {
            const [min, max] = inner.split(',');
            return { label: max ? `${min} to ${max} times` : `${min} or more times`, type: 'quantifier' };
        }
        return { label: `Exactly ${inner} times`, type: 'quantifier' };
    }

    // Group types
    if (token === '(')    return { label: 'Capture group start', type: 'group' };
    if (token === ')')    return { label: 'Group end', type: 'group' };
    if (token === '(?:')  return { label: 'Non-capturing group', type: 'group' };
    if (token === '(?=')  return { label: 'Positive lookahead', type: 'group' };
    if (token === '(?!')  return { label: 'Negative lookahead', type: 'group' };
    if (token === '(?<=') return { label: 'Positive lookbehind', type: 'group' };
    if (token === '(?<!') return { label: 'Negative lookbehind', type: 'group' };

    // Escaped character
    if (token.startsWith('\\')) {
        return { label: `Literal "${token[1]}"`, type: 'escape' };
    }

    // Plain literal
    return { label: `Literal "${token}"`, type: 'literal' };
}

// ── Scroll Sync between textarea and overlay ───────────
function syncScrollPositions() {
    testText.addEventListener('scroll', () => {
        highlightOverlay.scrollTop = testText.scrollTop;
        highlightOverlay.scrollLeft = testText.scrollLeft;
    });
}

// ── Copy Pattern to Clipboard ──────────────────────────
copyBtn.addEventListener('click', async () => {
    const flags = buildFlagsString();
    const fullRegex = `/${regexInput.value}/${flags}`;

    try {
        await navigator.clipboard.writeText(fullRegex);
        copyText.textContent = 'Copied!';
        setTimeout(() => { copyText.textContent = 'Copy Pattern'; }, 1500);
    } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = fullRegex;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyText.textContent = 'Copied!';
        setTimeout(() => { copyText.textContent = 'Copy Pattern'; }, 1500);
    }
});

// ── Clear All Fields ───────────────────────────────────
clearBtn.addEventListener('click', () => {
    aiPrompt.value = '';
    regexInput.value = '';
    testText.value = '';
    flagG.checked = true;
    flagI.checked = false;
    flagM.checked = false;
    flagS.checked = false;
    regexError.classList.add('hidden');
    matchDetails.classList.add('hidden');
    triggerVisualization();
    aiPrompt.focus();
});

// ── Utility: Build Flags String ────────────────────────
function buildFlagsString() {
    let flags = '';
    if (flagG.checked) flags += 'g';
    if (flagI.checked) flags += 'i';
    if (flagM.checked) flags += 'm';
    if (flagS.checked) flags += 's';
    return flags;
}

// ── Utility: HTML Escape ───────────────────────────────
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Event Bindings (Reactive live updates) ─────────────
const reactiveElements = [regexInput, testText, flagG, flagI, flagM, flagS];

reactiveElements.forEach(elem => {
    elem.addEventListener('input', triggerVisualization);
    elem.addEventListener('change', triggerVisualization);
});
