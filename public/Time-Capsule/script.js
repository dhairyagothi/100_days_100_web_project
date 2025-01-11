document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('capsuleForm');
    const messageInput = document.getElementById('message');
    const timerInput = document.getElementById('timer');
    const capsuleReveal = document.getElementById('capsuleReveal');
    const messageReveal = document.getElementById('messageReveal');
    const revealTime = document.getElementById('revealTime');
    const revealedMessage = document.getElementById('revealedMessage');

    // Check if there's an existing message being timed
    const savedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];
    if (savedCapsules.length > 0) {
        const currentCapsule = savedCapsules[0]; // Check the first message in queue
        if (new Date().getTime() < currentCapsule.revealAt) {
            capsuleReveal.classList.remove('hidden');
            revealTime.textContent = Your message will be revealed at: ${new Date(currentCapsule.revealAt).toLocaleTimeString()};
            setTimeout(revealMessage, currentCapsule.revealAt - new Date().getTime());
        }
        else {
            revealMessage();
        }
    }

    // Submit new message
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = messageInput.value;
        const timer = parseInt(timerInput.value) * 1000;
        const revealAt = new Date().getTime() + timer;

        const newCapsule = {
            message: message,
            revealAt: revealAt
        };

        // Store multiple capsules in localStorage
        savedCapsules.push(newCapsule);
        localStorage.setItem('capsules', JSON.stringify(savedCapsules));

        // Hide form and show timer
        capsuleReveal.classList.remove('hidden');
        revealTime.textContent = Your message will be revealed at: ${new Date(revealAt).toLocaleTimeString()};
        messageInput.value = ''; // Clear the message input field

        // Wait until the message is revealed
        setTimeout(revealMessage, timer);
    });

    // Reveal the message when it's time
    function revealMessage() {
        const savedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];
        if (savedCapsules.length > 0) {
            const revealedCapsule = savedCapsules.shift(); // Remove the revealed capsule
            localStorage.setItem('capsules', JSON.stringify(savedCapsules)); // Update storage
            revealedMessage.textContent = revealedCapsule.message;
            messageReveal.classList.remove('hidden');
            capsuleReveal.classList.add('hidden');
        }
    }
});