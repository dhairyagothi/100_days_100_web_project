const resultsDiv = document.getElementById('results');
resultsDiv.style.display = 'none';

document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    fetch(`https://registry.npmjs.org/-/v1/search?text=${query}&size=10`)
        .then(response => {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
            return response.json();
        })
        .then(data => {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '';
            if (data.objects.length === 0) {
                resultsDiv.innerHTML = '<p>No packages found.</p>';
            } else {
                data.objects.forEach(pkg => {
                    const pkgElement = document.createElement('div');
                    pkgElement.classList.add('package');
                    pkgElement.innerHTML = `
                        <h3><a href="https://www.npmjs.com/package/${pkg.package.name}" target="_blank">${pkg.package.name}</a></h3>
                        <p>${pkg.package.description}</p>
                    `;
                    resultsDiv.appendChild(pkgElement);
                });
            }
        })
        .catch(error => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            console.error('Error fetching packages:', error);
        });
});
