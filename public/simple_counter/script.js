document.addEventListener('DOMContentLoaded', () => {
    const counterDisplay = document.getElementById('counter');
    const increaseBtn = document.getElementById('increase');
    const decreaseBtn = document.getElementById('decrease');
    const resetBtn = document.getElementById('reset');

    let count = 0;

    const updateDisplay = () => {
        counterDisplay.textContent = count;
        
        // Add a little animation effect
        counterDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            counterDisplay.style.transform = 'scale(1)';
        }, 100);

        // Color coding
        if (count > 0) {
            counterDisplay.style.color = '#4ade80';
        } else if (count < 0) {
            counterDisplay.style.color = '#f87171';
        } else {
            counterDisplay.style.color = '#f8fafc';
        }
    };

    increaseBtn.addEventListener('click', () => {
        count++;
        updateDisplay();
    });

    decreaseBtn.addEventListener('click', () => {
        count--;
        updateDisplay();
    });

    resetBtn.addEventListener('click', () => {
        count = 0;
        updateDisplay();
    });
});
