// This generates a random joke
document.addEventListener('DOMContentLoaded', () => {

  const jokeElement = document.getElementById('jokeText');
  const jokeBtn = document.getElementById('jokeBtn');

  // Arrow function
  const generateJoke = async () => {
    jokeElement.innerHTML = 'Searching for something funny...';
    
    try { //Fetch API
      const response = await fetch('https://icanhazdadjoke.com/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      jokeElement.innerHTML = data.joke;
      //Error Handling 
    } catch (error) {
      console.error('Failed to fetch joke:', error);
      jokeElement.innerHTML = 'Oops! The joke machine is broken. Try again later.';
    }
  };


  jokeBtn.addEventListener('click', generateJoke);

  generateJoke();
  
});