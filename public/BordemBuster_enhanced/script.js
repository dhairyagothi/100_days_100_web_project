document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.getElementById('fetch-btn');
  const btnLabel = document.getElementById('btn-label');
  const resultContainer = document.getElementById('result-container');
  const resultDivider = document.getElementById('result-divider');
  const cardFooter = document.getElementById('card-footer');
  const activityName = document.getElementById('activity-name');
  const activityType = document.getElementById('activity-type');
  const activityParticipants = document.getElementById('activity-participants');
  const activityPrice = document.getElementById('activity-price');
  const tagContainer = document.getElementById('tag-container');
  const errorMessage = document.getElementById('error-message');
  const tryAgainBtn = document.getElementById('try-again-btn');

  const categoryEmoji = {
    education: '📚', recreational: '🎮', social: '🤝',
    diy: '🔨', charity: '❤️', cooking: '🍳',
    relaxation: '🧘', music: '🎵', busywork: '📋', '': '🎲'
  };

  const setLoading = (loading) => {
    fetchBtn.disabled = loading;
    if (loading) {
      btnLabel.innerHTML = `Finding something cool <span class="dots"><span></span><span></span><span></span></span>`;
    } else {
      btnLabel.textContent = 'Find Something to Do';
    }
  };

  const showResult = () => {
    resultDivider.style.display = 'block';
    cardFooter.style.display = 'flex';
    resultContainer.classList.remove('hidden');
  };

  const fetchActivity = async () => {
    const category = document.getElementById('category').value;
    const participants = document.getElementById('participants').value;
    const budget = document.getElementById('budget').value;

    let url = 'https://bored.api.lewagon.com/api/activity?';
    if (category) url += `type=${category}&`;
    if (participants) url += `participants=${participants}&`;
    if (budget === 'free') url += 'price=0.0&';
    else if (budget === 'cheap') url += 'minprice=0.1&maxprice=0.4&';
    else if (budget === 'expensive') url += 'minprice=0.5&maxprice=1.0&';

    setLoading(true);
    errorMessage.classList.add('hidden');

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      showResult();

      if (data.error) {
        activityName.textContent = 'No match found';
        tagContainer.style.display = 'none';
        errorMessage.textContent = "We couldn't find an exact match for that combo. Try tweaking the filters!";
        errorMessage.classList.remove('hidden');
        tryAgainBtn.classList.remove('visible');
      } else {
        const emoji = categoryEmoji[data.type] || '✨';
        activityName.textContent = `${emoji} ${data.activity}`;

        activityType.textContent = `${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`;
        activityParticipants.textContent = `${data.participants} ${data.participants === 1 ? 'person' : 'people'}`;

        let priceLabel = '🆓 Free';
        if (data.price > 0 && data.price <= 0.4) priceLabel = '💸 Cheap';
        if (data.price > 0.4) priceLabel = '💳 Pricey';
        activityPrice.textContent = priceLabel;

        tagContainer.style.display = 'flex';
        errorMessage.classList.add('hidden');
        tryAgainBtn.classList.add('visible');

        // Re-trigger animation
        activityName.style.animation = 'none';
        activityName.offsetHeight;
        activityName.style.animation = '';
      }
    } catch (err) {
      console.error(err);
      showResult();
      activityName.textContent = '📡 Connection lost';
      tagContainer.style.display = 'none';
      errorMessage.textContent = 'Could not reach the activity server. Check your connection and try again.';
      errorMessage.classList.remove('hidden');
      tryAgainBtn.classList.remove('visible');
    } finally {
      setLoading(false);
    }
  };

  fetchBtn.addEventListener('click', fetchActivity);
  tryAgainBtn.addEventListener('click', fetchActivity);
});
