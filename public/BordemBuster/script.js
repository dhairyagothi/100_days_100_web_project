document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const fetchBtn = document.getElementById('fetch-btn');
    const resultContainer = document.getElementById('result-container');
    const activityName = document.getElementById('activity-name');
    const activityType = document.getElementById('activity-type');
    const activityParticipants = document.getElementById('activity-participants');
    const activityPrice = document.getElementById('activity-price');
    const errorMessage = document.getElementById('error-message');

    // Fetch Activity Logic
    const fetchActivity = async () => {
        const category = document.getElementById('category').value;
        const participants = document.getElementById('participants').value;
        const budget = document.getElementById('budget').value;

        let url = 'https://bored.api.lewagon.com/api/activity?';

        if (category) url += `type=${category}&`;
        if (participants) url += `participants=${participants}&`;

        if (budget === 'free') {
            url += 'price=0.0&';
        } else if (budget === 'cheap') {
            url += 'minprice=0.1&maxprice=0.4&';
        } else if (budget === 'expensive') {
            url += 'minprice=0.5&maxprice=1.0&';
        }

        fetchBtn.textContent = 'Seeking...';
        errorMessage.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        try {
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();

            if (data.error) {
                activityName.textContent = "Hold up!";
                errorMessage.textContent = "We couldn't find an exact match for that vibe. Try tweaking the filters.";
                errorMessage.classList.remove('hidden');
                document.querySelector('.pill-container').classList.add('hidden');
            } else {
                activityName.textContent = data.activity;
                activityType.textContent = `Type: ${data.type}`;
                activityParticipants.textContent = `Peeps: ${data.participants}`;
                
                let priceText = "Free";
                if (data.price > 0 && data.price <= 0.4) priceText = "Cheap";
                if (data.price > 0.4) priceText = "Pricey";
                activityPrice.textContent = `Cost: ${priceText}`;
                
                document.querySelector('.pill-container').classList.remove('hidden');
            }

        } catch (error) {
            console.error('Failed to fetch activity:', error);
            activityName.textContent = "Signal Lost";
            errorMessage.textContent = "Could not connect to the network. Take a breather and try again.";
            errorMessage.classList.remove('hidden');
            document.querySelector('.pill-container').classList.add('hidden');
        } finally {
            fetchBtn.textContent = 'Find Activity';
        }
    };

    // Event Listener
    fetchBtn.addEventListener('click', fetchActivity);
});