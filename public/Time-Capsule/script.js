document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('capsuleForm');
    const messageInput = document.getElementById('message');
    const timerInput = document.getElementById('timer');
    const capsuleReveal = document.getElementById('capsuleReveal');
    const messageReveal = document.getElementById('messageReveal');
    const revealTime = document.getElementById('revealTime');
    const revealedMessage = document.getElementById('revealedMessage');

    function checkCapsules() {
        const savedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];
        const now = new Date().getTime();
        
        let updatedCapsules = [];
        let revealedCapsule = null;

        for (let capsule of savedCapsules) {
            if (now >= capsule.revealAt) {
                revealedCapsule = capsule;
                break; // Reveal only the first due capsule
            } else {
                updatedCapsules.push(capsule);
            }
        }

        if (revealedCapsule) {
            revealedMessage.textContent = revealedCapsule.message;
            messageReveal.classList.remove('hidden');
            capsuleReveal.classList.add('hidden');
            localStorage.setItem('capsules', JSON.stringify(updatedCapsules));
        }
    }

    // Run checkCapsules every second
    setInterval(checkCapsules, 1000);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = messageInput.value;
        const timer = parseInt(timerInput.value) * 1000;
        const revealAt = new Date().getTime() + timer;

        const newCapsule = { message, revealAt };
        const savedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];
        savedCapsules.push(newCapsule);
        localStorage.setItem('capsules', JSON.stringify(savedCapsules));

        // Show feedback
        capsuleReveal.classList.remove('hidden');
        revealTime.textContent = `Your message will be revealed at: ${new Date(revealAt).toLocaleTimeString()}`;

        // Clear input fields
        messageInput.value = '';
        timerInput.value = '';
    });
});
