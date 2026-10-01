import { SearchTrieIndex } from './trieKernel.js';

const searchIndex = new SearchTrieIndex();

const logTerminal = document.getElementById('trie-log');
const searchInput = document.getElementById('trie-search');
const resultsView = document.getElementById('trie-results');

// Generate 50,000 complex database items for indexing
const companies = ['Google', 'Meta', 'Netflix', 'Amazon', 'Apple', 'Microsoft', 'VIT Solutions', 'OpenAI', 'SpaceX'];
const roles = ['Systems Architect', 'Frontend Lead', 'AI Research Fellow', 'Data Scientist', 'Kernel Developer'];

logTerminal.textContent = "[System Indexing Status] Building and indexing 50,000 Trie structural records...";

console.time('Trie Generation Matrix Speed');
for (let i = 1; i <= 50000; i++) {
    const item = {
        id: i,
        company: companies[i % companies.length],
        role: roles[i % roles.length] + ` (Index Registry Vector #${i})`
    };

    // Index items by bundling target search parameters into character keys
    searchIndex.insert(`${item.company} ${item.role}`, item);
}
console.timeEnd('Trie Generation Matrix Speed');

logTerminal.textContent = `\n[System Indexing Connected] 50,000 records structured in memory tree. Tree traversal speed locked to O(K) complexity.`;

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    resultsView.innerHTML = '';

    if (!query) {
        logTerminal.textContent = `[System Status] Awaiting auto-complete keyword strings...`;
        return;
    }

    // Track runtime processing speeds down to fractions of milliseconds
    const startTime = performance.now();
    const matches = searchIndex.searchPrefix(query);
    const totalDuration = performance.now() - startTime;

    logTerminal.textContent = `[Query Metrics] Search string: "${query}" | Traversals finished in ${totalDuration.toFixed(4)}ms | Located matches: ${matches.length}`;

    if (matches.length === 0) {
        resultsView.textContent = "No matching character tree paths found in memory structures.";
        return;
    }

    // Splice out and slice the top 10 items for view rendering
    const visibleSubLimits = matches.slice(0, 10);
    visibleSubLimits.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.style.padding = '4px 0';
        itemRow.textContent = `[Prefix Match Found] ${item.company} ➔ ${item.role}`;
        resultsView.appendChild(itemRow);
    });
});