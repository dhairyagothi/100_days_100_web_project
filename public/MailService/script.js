// Initialize EmailJS
emailjs.init({
    publicKey: 'O_j6-YUJwi1qo4v70', // Your public API key
});

// Select input elements
const namex = document.querySelector('#name');
const emailInput = document.querySelector('#email'); // Avoid using 'email' as a variable name to prevent confusion
const message = document.querySelector('#textarea'); // Correct ID reference for the textarea
const submitButton = document.querySelector('#submit'); // Select the submit button
const successMessage = document.getElementById('success-message'); // Select the success message element

// Event listener for form submission
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page refresh

    // Debug: Log values to console
    console.log(namex.value);
    console.log(emailInput.value); // Use the emailInput variable
    console.log(message.value);

    // Call the Send function to send email
    Send();
});

// Function to send email
function Send() {
    // Send email using EmailJS
    emailjs.send('service_nptdu0c', 'template_h7nfc6f', {
        from_name: `${namex.value}`,  // The name of the sender
        from_email: `${emailInput.value}`, // The email address of the sender
        message: `${message.value}`,   // The message content
    })
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);

        // Show success message and disable the submit button
        successMessage.style.display = 'block';
        submitButton.disabled = true; // Disable the button to prevent multiple submissions

        // Reload the page after 3 seconds
        setTimeout(() => {
            location.reload();
        }, 1000);
    }, function(error) {
        console.log('FAILED...', error);
    });
}
