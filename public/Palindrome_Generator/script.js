// Function to check if a string is a palindrome
function isPalindrome(str) {
    // Remove non-alphanumeric characters and convert to lowercase
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanStr === cleanStr.split('').reverse().join('');
}

// Function to handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('palindromeForm');
    const input = document.getElementById('inputString');
    const resultDiv = document.getElementById('result');
    const loadingText = document.querySelector('.loading-text');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const inputValue = input.value.trim();

        if (inputValue !== '') {
            // Show loading message
            loadingText.style.display = 'block';

            // Simulate asynchronous behavior to show loading text
            setTimeout(function() {
                const isPal = isPalindrome(inputValue);
                let result = '';

                if (isPal) {
                    result = inputValue; // Input is a palindrome
                } else {
                    result = `${inputValue}${inputValue.split('').reverse().join('')}`; // Input + reversed input
                }

                // Display result
                resultDiv.textContent = result;

                // Hide loading message after generating result
                loadingText.style.display = 'none';
            }, 1000); // Simulate a delay of 1 second for demonstration
        } else {
            resultDiv.textContent = 'Please enter a valid string.';
        }
    });
});
