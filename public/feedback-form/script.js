document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('feedback-form');
    const dateInput = document.getElementById('date');
    const starRating = document.getElementById('star-rating');
    const stars = starRating.querySelectorAll('span');
    const ratingValue = document.getElementById('rating-value');
    const emojiReaction = document.getElementById('emoji-reaction');
    const emojis = emojiReaction.querySelectorAll('span');
    const emojiValue = document.getElementById('emoji-value');
    const imageUpload = document.getElementById('image-upload');
    const feedbackList = document.getElementById('feedback-list');
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');
    const themeToggle = document.getElementById('theme-toggle');

    // State
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    let imageBase64 = "";

    // 1. Auto-fill Date
    dateInput.value = new Date().toISOString().split('T')[0];

    // 2. Dark/Light Mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
    });

    // 3. Interactive Star Rating
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            ratingValue.value = star.getAttribute('data-value');
            stars.forEach((s, i) => {
                s.style.color = i <= index ? 'var(--star-active)' : 'var(--star-color)';
            });
        });
    });

    // 4. Interactive Emoji
    emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            emojis.forEach(e => e.classList.remove('active'));
            emoji.classList.add('active');
            emojiValue.value = emoji.getAttribute('data-value');
        });
    });

    // 5. Image File Handling (Convert to Base64 for LocalStorage)
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imageBase64 = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 6. Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation for custom inputs
        if (!ratingValue.value) {
            alert('Please select a star rating!');
            return;
        }

        const newFeedback = {
            id: Date.now(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            category: document.getElementById('category').value,
            rating: ratingValue.value,
            emoji: emojiValue.value || 'None',
            text: document.getElementById('feedback-text').value,
            recommend: document.querySelector('input[name="recommend"]:checked').value,
            date: dateInput.value,
            image: imageBase64
        };

        feedbacks.unshift(newFeedback); // Add to top
        saveAndRender();
        
        // Reset form
        form.reset();
        ratingValue.value = '';
        emojiValue.value = '';
        imageBase64 = '';
        stars.forEach(s => s.style.color = 'var(--star-color)');
        emojis.forEach(e => e.classList.remove('active'));
        dateInput.value = new Date().toISOString().split('T')[0]; // re-fill date
    });

    // 7. Render Feedbacks
    function renderFeedbacks(filterText = "", filterCat = "All") {
        feedbackList.innerHTML = '';

        const filtered = feedbacks.filter(fb => {
            const matchesSearch = fb.text.toLowerCase().includes(filterText.toLowerCase()) || 
                                  fb.name.toLowerCase().includes(filterText.toLowerCase());
            const matchesCategory = filterCat === "All" || fb.category === filterCat;
            return matchesSearch && matchesCategory;
        });

        if (filtered.length === 0) {
            feedbackList.innerHTML = '<p>No feedback found.</p>';
            return;
        }

        filtered.forEach(fb => {
            const card = document.createElement('div');
            card.className = 'feedback-card';
            
            card.innerHTML = `
                <div class="feedback-header">
                    <strong>${fb.name}</strong>
                    <span class="category-badge">${fb.category}</span>
                </div>
                <div class="meta">
                    <small>${fb.date} • ${'★'.repeat(fb.rating)}${'☆'.repeat(5-fb.rating)} • ${fb.emoji}</small>
                </div>
                <p style="margin: 1rem 0;">${fb.text}</p>
                <small>Recommend: <strong>${fb.recommend}</strong></small>
                ${fb.image ? `<img src="${fb.image}" alt="Feedback Upload">` : ''}
                <button class="delete-btn" onclick="deleteFeedback(${fb.id})" style="position:absolute; bottom: 1rem; right: 1rem;">Delete</button>
            `;
            feedbackList.appendChild(card);
        });
    }

    // 8. Delete Feedback (Exposed to window for inline onclick)
    window.deleteFeedback = (id) => {
        if(confirm('Delete this feedback?')) {
            feedbacks = feedbacks.filter(fb => fb.id !== id);
            saveAndRender();
        }
    };

    // Helper: Save & Render
    function saveAndRender() {
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        renderFeedbacks(searchInput.value, filterCategory.value);
    }

    // 9. Search and Filter Listeners
    searchInput.addEventListener('input', (e) => renderFeedbacks(e.target.value, filterCategory.value));
    filterCategory.addEventListener('change', (e) => renderFeedbacks(searchInput.value, e.target.value));

    // Initial Render
    renderFeedbacks();
});