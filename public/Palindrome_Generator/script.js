// Function to check if a string is a palindrome
function isPalindrome(str) {
    return str === str.split('').reverse().join('');
}

// Function to generate all permutations of a string
function generatePermutations(str) {
    let permutations = [];

    // Helper function to recursively generate permutations
    function permute(current, remaining) {
        if (remaining.length === 0) {
            permutations.push(current.join(''));
        } else {
            for (let i = 0; i < remaining.length; i++) {
                let nextCurrent = current.concat(remaining[i]);
                let nextRemaining = remaining.slice(0, i).concat(remaining.slice(i + 1));
                permute(nextCurrent, nextRemaining);
            }
        }
    }

    permute([], str.split(''));
    return permutations;
}

// Function to handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('palindromeForm');
    const input = document.getElementById('inputString');
    const palindromeList = document.getElementById('palindromeList');
    const loadingText = document.querySelector('.loading-text');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const inputValue = input.value.trim();

        if (inputValue !== '') {
            // Show loading message
            loadingText.style.display = 'block';
            palindromeList.innerHTML = ''; // Clear previous results

            // Simulate asynchronous behavior to show loading text
            setTimeout(function() {
                const permutations = generatePermutations(inputValue);
                const palindromes = permutations.filter(str => isPalindrome(str));
                const uniquePalindromes = [...new Set(palindromes)]; // Remove duplicates

                if (uniquePalindromes.length === 0) {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.textContent = 'No palindromes found.';
                    palindromeList.appendChild(li);
                } else {
                    uniquePalindromes.forEach(palindrome => {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item');
                        li.textContent = palindrome;
                        palindromeList.appendChild(li);
                    });
                }

                // Hide loading message after generating palindromes
                loadingText.style.display = 'none';
            }, 1000); // Simulate a delay of 1 second for demonstration
        } else {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = 'Please enter a valid string.';
            palindromeList.appendChild(li);
        }
    });
});
