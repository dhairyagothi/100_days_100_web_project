const resultsDiv = document.getElementById('results');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
let activeSearchId = 0;

resultsDiv.style.display = 'none';

function clearResults() {
    resultsDiv.textContent = '';
}

function showMessage(message) {
    clearResults();
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    resultsDiv.appendChild(messageElement);
    resultsDiv.style.display = 'block';
}

function createPackageElement(packageData) {
    const packageName = packageData.name || 'Unnamed package';
    const pkgElement = document.createElement('div');
    const title = document.createElement('h3');
    const link = document.createElement('a');
    const description = document.createElement('p');

    pkgElement.classList.add('package');
    const packagePath = packageName.split('/').map(encodeURIComponent).join('/');

    link.href = `https://www.npmjs.com/package/${packagePath}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = packageName;
    description.textContent = packageData.description || 'No description provided.';

    title.appendChild(link);
    pkgElement.appendChild(title);
    pkgElement.appendChild(description);

    return pkgElement;
}

searchButton.addEventListener('click', async function() {
    const query = searchInput.value.trim();
    const searchId = ++activeSearchId;

    if (!query) {
        showMessage('Enter a package name to search.');
        return;
    }

    const url = new URL('https://registry.npmjs.org/-/v1/search');
    url.search = new URLSearchParams({
        text: query,
        size: '10'
    });

    searchButton.disabled = true;
    showMessage('Searching packages...');

    try {
        const response = await fetch(url.toString());

        if (searchId !== activeSearchId) return;

        if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        if (!response.ok) {
            throw new Error(`Search failed with status ${response.status}.`);
        }

        const data = await response.json();

        if (searchId !== activeSearchId) return;

        clearResults();
        resultsDiv.style.display = 'block';

        if (!data.objects || data.objects.length === 0) {
            showMessage('No packages found.');
            return;
        }

        data.objects.forEach(pkg => {
            resultsDiv.appendChild(createPackageElement(pkg.package || {}));
        });
    } catch (error) {
        if (searchId !== activeSearchId) return;

        showMessage(`Error: ${error.message}`);
        console.error('Error fetching packages:', error);
    } finally {
        if (searchId === activeSearchId) {
            searchButton.disabled = false;
        }
    }
});
