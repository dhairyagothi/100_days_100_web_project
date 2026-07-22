document.addEventListener('DOMContentLoaded', () => {
    const jokeElement = document.getElementById('jokeText');
    const jokeBtn = document.getElementById('jokeBtn');

    if (!jokeElement || !jokeBtn) {
        console.error('Required DOM elements not found');
        return;
    }

    const generateJoke = async () => {
        jokeBtn.disabled = true;
        jokeBtn.textContent = 'Loading...';
        jokeElement.textContent = 'Searching for something funny...';

        try {
            const controller = new AbortController();

            const timeout = setTimeout(() => {
                controller.abort();
            }, 5000);

            const response = await fetch(
                'https://icanhazdadjoke.com/',
                {
                    headers: {
                        Accept: 'application/json'
                    },
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(
                    `HTTP error! Status: ${response.status}`
                );
            }

            const data = await response.json();

            jokeElement.textContent = data.joke;

        } catch (error) {
            console.error('Failed to fetch joke:', error);

            jokeElement.textContent =
                'Oops! Unable to fetch a joke right now.';
        } finally {
            jokeBtn.disabled = false;
            jokeBtn.textContent = 'Get Another Joke';
        }
    };

    jokeBtn.addEventListener('click', generateJoke);

    generateJoke();
});