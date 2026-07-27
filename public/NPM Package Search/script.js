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
  messageElement.style.textAlign = 'center';
  messageElement.style.color = '#666';
  messageElement.style.marginTop = '20px';
  resultsDiv.appendChild(messageElement);
  resultsDiv.style.display = 'block';
}

function createPackageElement(packageData) {
  const packageName = packageData.name || 'Unnamed package';
  const pkgElement = document.createElement('div');
  const title = document.createElement('h1');
  title.textContent = packageName;

  const description = document.createElement('p');
  description.textContent = packageData.description || 'No description available';

  const version = document.createElement('p');
  version.textContent = `Version: ${packageData.version || 'N/A'}`;
  version.style.fontSize = '0.85rem';
  version.style.color = '#888';

  const author = document.createElement('p');
  const authorName =
    (packageData.author &&
      (typeof packageData.author === 'string'
        ? packageData.author
        : packageData.author.name)) ||
    'Unknown';
  author.textContent = `Author: ${authorName}`;

  const link = document.createElement('a');
  link.href = `https://www.npmjs.com/package/${packageName}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'View on npm →';

  pkgElement.appendChild(title);
  pkgElement.appendChild(description);
  pkgElement.appendChild(version);
  pkgElement.appendChild(author);
  pkgElement.appendChild(link);
  pkgElement.className = 'package';

  return pkgElement;
}

async function searchPackages() {
  const query = searchInput.value.trim();

  if (!query) {
    showMessage('Please enter a package name to search.');
    return;
  }

  const currentSearchId = ++activeSearchId;
  showMessage('Loading...');

  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=10`
    );

    if (currentSearchId !== activeSearchId) return;

    if (!response.ok) {
      showMessage('Error fetching results. Please try again.');
      return;
    }

    const data = await response.json();

    if (currentSearchId !== activeSearchId) return;

    clearResults();

    if (!data.objects || data.objects.length === 0) {
      showMessage('No packages found. Try a different search term.');
      return;
    }

    resultsDiv.style.display = 'grid';

    data.objects.forEach(({ package: pkg }) => {
      const packageElement = createPackageElement(pkg);
      resultsDiv.appendChild(packageElement);
    });

  } catch (error) {
    if (currentSearchId === activeSearchId) {
      showMessage('Something went wrong. Please check your connection and try again.');
    }
  }
}

searchButton.addEventListener('click', searchPackages);

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchPackages();
  }
});
