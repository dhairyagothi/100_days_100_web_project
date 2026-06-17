document.addEventListener('DOMContentLoaded', function(){
    const searchInput = document.getElementById('remedySearch');
    const chips = Array.from(document.querySelectorAll('.chip'));
    const grid = document.getElementById('remedyGrid');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    // Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {

        document.body.classList.toggle('dark-theme');

        const isDark = document.body.classList.contains('dark-theme');

        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

    if(!grid) return;

    const cards = Array.from(grid.querySelectorAll('.remedy-card'));

    // Utility: escape regex
    function escapeRegExp(string){ return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function removeMarks(el){ el.innerHTML = el.innerHTML.replace(/<mark class="search-hit">(.*?)<\/mark>/gi, '$1'); }
    function highlightInElement(el, query){ if(!query) return; removeMarks(el); const rx = new RegExp(escapeRegExp(query),'gi'); el.innerHTML = el.innerHTML.replace(rx, m => `<mark class="search-hit">${m}</mark>`); }

    // Enhance cards: add icon and Learn more button
    cards.forEach(card => {
        const titleEl = card.querySelector('h2');
        const title = titleEl ? titleEl.textContent.trim() : 'Remedy';

        if(!card.querySelector('.meta')){
            const meta = document.createElement('div'); meta.className = 'meta';
            const icon = document.createElement('div'); icon.className = 'icon';
            const t = title.toLowerCase();
            if(t.includes('fever')) icon.textContent = '🌡';
            else if(t.includes('pain')||t.includes('sprain')||t.includes('strain')) icon.textContent = '🤕';
            else if(t.includes('skin')||t.includes('burn')||t.includes('cuts')) icon.textContent = '🧴';
            else if(t.includes('sore')||t.includes('throat')||t.includes('cough')||t.includes('cold')) icon.textContent = '🫁';
            else icon.textContent = '🩺';

            meta.appendChild(icon);
            titleEl.parentNode.insertBefore(meta, titleEl);
            meta.appendChild(titleEl);
        }

        if(!card.querySelector('.actions')){
            const actions = document.createElement('div'); actions.className = 'actions';
            const btn = document.createElement('button'); btn.className = 'btn primary'; btn.textContent = 'Learn more';
            btn.addEventListener('click', () => {
                modalBody.replaceChildren();
                const heading = document.createElement('h4');
                heading.style.margin = '0 0 8px';
                heading.textContent =
                card.querySelector('h2')?.textContent || '';
                
                modalBody.appendChild(heading);
                
                card.querySelectorAll('p').forEach((p) => {
                    const para = document.createElement('p');
                    para.textContent = p.textContent || '';
                    modalBody.appendChild(para);
                });
                const note = document.createElement('p');
                note.style.marginTop = '12px';
                note.style.color = '#444';
                note.style.fontSize = '.9rem';
                note.textContent =
                'This information is for basic guidance only.';
                modalBody.appendChild(note);
                modalBackdrop.style.display = 'flex';
                modalBackdrop.setAttribute('aria-hidden', 'false');
            });
        }
    });

    // Stagger reveal
    cards.forEach((c,i)=> setTimeout(()=> c.classList.add('reveal'), i * 90));

    // Filter logic with highlighting
    function applyFilter(){
        const q = (searchInput?.value || '').toLowerCase().trim();
        const activeChip = document.querySelector('.chip.active');
        const filter = activeChip ? activeChip.dataset.filter : 'all';

        cards.forEach(card=>{
            // clear previous marks
            removeMarks(card);
            const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
            const bodyText = card.textContent.toLowerCase();
            const matchesQuery = q === '' || bodyText.includes(q) || title.includes(q);
            const tags = (card.dataset.tags || '').toLowerCase();
            const matchesFilter = filter === 'all' || tags.includes(filter) || title.includes(filter);
            const show = matchesQuery && matchesFilter;
            card.style.display = show ? '' : 'none';

            if(show && q){
                // highlight in title and paragraphs
                const titleEl = card.querySelector('h2');
                highlightInElement(titleEl, q);
                card.querySelectorAll('p').forEach(p => highlightInElement(p, q));
            }
        });
    }

    searchInput && searchInput.addEventListener('input', applyFilter);

    chips.forEach(ch=> ch.addEventListener('click', function(){
        chips.forEach(c=>c.classList.remove('active'));
        this.classList.add('active');
        applyFilter();
    }));

    // Modal close
    function closeModal(){ modalBackdrop.style.display = 'none'; modalBackdrop.setAttribute('aria-hidden','true'); }
    modalClose && modalClose.addEventListener('click', closeModal);
    modalBackdrop && modalBackdrop.addEventListener('click', function(e){ if(e.target === modalBackdrop) closeModal(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

});