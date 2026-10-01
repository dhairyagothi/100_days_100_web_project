/* ============================================================
   CUSTOMER SERVICE PAGE  –  customer-service.js
   Full interactive functionality: search, tiles, self-service
   workflows, contact modals, and personalized help.
   ============================================================ */

(function () {
    'use strict';

    // One-time cleanup: remove hardcoded fake orders seeded by old code
    (function cleanupFakeOrders() {
        if (localStorage.getItem('_fakeOrdersCleaned')) return;
        const fakeIds = ['112-4857390-2948573', '112-9283746-1029384', '112-6573829-4950123'];
        try {
            let orders = JSON.parse(localStorage.getItem('amazonOrders')) || [];
            orders = orders.filter(o => !fakeIds.includes(o.id));
            localStorage.setItem('amazonOrders', JSON.stringify(orders));
        } catch(e) { /* ignore */ }
        localStorage.setItem('_fakeOrdersCleaned', '1');
    })();

    // ─────────────────────────────────────────────────────────
    // 1. HELP TOPICS DATABASE
    //    Each topic has: id, title, description, icon, iconBg,
    //    category, keywords, and self-service action steps.
    // ─────────────────────────────────────────────────────────
    const helpTopics = [
        {
            id: 'track',
            title: 'Track My Package',
            desc: 'View real-time tracking updates for your recent orders.',
            icon: 'fa-solid fa-truck-fast',
            iconBg: '#fff3e0',
            iconColor: '#d4763a',
            category: 'orders',
            keywords: ['track', 'package', 'shipping', 'delivery', 'where', 'status', 'order', 'transit', 'estimated'],
            actions: [
                { label: 'View Order Status', icon: 'fa-solid fa-eye', detail: 'Check the current status of your recent orders in Your Orders page.' },
                { label: 'Track a Specific Package', icon: 'fa-solid fa-map-location-dot', detail: 'Enter your tracking number to see real-time location updates.' },
                { label: 'Report Missing Package', icon: 'fa-solid fa-circle-exclamation', detail: 'If your package shows delivered but you haven\'t received it, report it here.' }
            ]
        },
        {
            id: 'cancel',
            title: 'Cancel Items or Orders',
            desc: 'Cancel an order before it ships or request cancellation for items.',
            icon: 'fa-solid fa-ban',
            iconBg: '#fce4ec',
            iconColor: '#d63a5b',
            category: 'orders',
            keywords: ['cancel', 'cancellation', 'order', 'item', 'stop', 'remove', 'undo'],
            actions: [
                { label: 'Cancel a Recent Order', icon: 'fa-solid fa-xmark', detail: 'Orders that haven\'t entered the shipping process can be cancelled immediately.' },
                { label: 'Cancel Specific Items', icon: 'fa-solid fa-list-check', detail: 'Remove individual items from a multi-item order.' },
                { label: 'Cancel a Pre-Order', icon: 'fa-solid fa-calendar-xmark', detail: 'Pre-orders can be cancelled any time before they ship.' }
            ]
        },
        {
            id: 'return',
            title: 'Start a Return',
            desc: 'Initiate a return for items you\'ve received.',
            icon: 'fa-solid fa-rotate-left',
            iconBg: '#e8f4fd',
            iconColor: '#0576b9',
            category: 'returns',
            keywords: ['return', 'send back', 'exchange', 'wrong', 'damaged', 'defective', 'start return'],
            actions: [
                { label: 'Return an Item', icon: 'fa-solid fa-box-open', detail: 'Select the item from your orders and choose a return reason. We\'ll provide a prepaid shipping label.' },
                { label: 'Exchange an Item', icon: 'fa-solid fa-arrows-rotate', detail: 'Swap for a different size, color, or model.' },
                { label: 'Print Return Label', icon: 'fa-solid fa-print', detail: 'Download and print a prepaid return shipping label.' }
            ]
        },
        {
            id: 'refund',
            title: 'Where\'s My Refund?',
            desc: 'Check the status of your refund and see when it will arrive.',
            icon: 'fa-solid fa-money-bill-wave',
            iconBg: '#e8f5e9',
            iconColor: '#2e7d32',
            category: 'returns',
            keywords: ['refund', 'money', 'credit', 'reimburse', 'when', 'where', 'status', 'back'],
            actions: [
                { label: 'Check Refund Status', icon: 'fa-solid fa-magnifying-glass-dollar', detail: 'View the current status and estimated date for your refund.' },
                { label: 'Refund to Gift Card Balance', icon: 'fa-solid fa-gift', detail: 'Receive an instant refund to your Amazon Gift Card balance.' },
                { label: 'Refund Not Received', icon: 'fa-solid fa-circle-question', detail: 'If it\'s been more than 5-7 business days since your refund was issued, report it here.' }
            ]
        },
        {
            id: 'payment',
            title: 'Change Payment Method',
            desc: 'Update or manage the payment methods on your account.',
            icon: 'fa-solid fa-credit-card',
            iconBg: '#fff9e0',
            iconColor: '#b8860b',
            category: 'payments',
            keywords: ['payment', 'credit card', 'debit', 'card', 'change', 'update', 'method', 'billing', 'add card'],
            actions: [
                { label: 'Update Default Payment', icon: 'fa-solid fa-pen-to-square', detail: 'Change the default payment method used for new purchases.' },
                { label: 'Add a New Card', icon: 'fa-solid fa-plus', detail: 'Add a new credit or debit card to your account.' },
                { label: 'Remove a Payment Method', icon: 'fa-solid fa-trash-can', detail: 'Delete a saved payment method from your account.' }
            ]
        },
        {
            id: 'prime',
            title: 'Manage Prime Membership',
            desc: 'View, modify, or cancel your Amazon Prime membership.',
            icon: 'fa-solid fa-crown',
            iconBg: '#e8f4fd',
            iconColor: '#0576b9',
            category: 'prime',
            keywords: ['prime', 'membership', 'subscribe', 'subscription', 'manage', 'cancel prime', 'free trial', 'benefits'],
            actions: [
                { label: 'View Prime Benefits', icon: 'fa-solid fa-star', detail: 'See all the benefits included with your Prime membership.' },
                { label: 'Update Prime Settings', icon: 'fa-solid fa-gear', detail: 'Manage your Prime membership preferences and sharing settings.' },
                { label: 'Cancel Prime Membership', icon: 'fa-solid fa-user-minus', detail: 'End your Prime membership. You\'ll receive a prorated refund if eligible.' },
                { label: 'Start Free Trial', icon: 'fa-solid fa-play', detail: 'Try Amazon Prime free for 30 days with full access to all benefits.' }
            ]
        },
        {
            id: 'address',
            title: 'Change Delivery Address',
            desc: 'Update the shipping address for a pending order or your account.',
            icon: 'fa-solid fa-location-dot',
            iconBg: '#fce4ec',
            iconColor: '#d63a5b',
            category: 'orders',
            keywords: ['address', 'shipping', 'delivery', 'change address', 'update address', 'wrong address', 'location'],
            actions: [
                { label: 'Update Order Address', icon: 'fa-solid fa-pen', detail: 'Change the delivery address on orders that haven\'t shipped yet.' },
                { label: 'Edit Saved Addresses', icon: 'fa-solid fa-address-book', detail: 'Add, edit, or remove addresses saved in your address book.' }
            ]
        },
        {
            id: 'giftcard',
            title: 'Gift Card Balance & Issues',
            desc: 'Check your balance, redeem a card, or report a problem.',
            icon: 'fa-solid fa-gift',
            iconBg: '#f3e5f5',
            iconColor: '#7b1fa2',
            category: 'payments',
            keywords: ['gift card', 'gift', 'balance', 'redeem', 'claim', 'code', 'voucher'],
            actions: [
                { label: 'Check Gift Card Balance', icon: 'fa-solid fa-wallet', detail: 'View your current Amazon Gift Card balance.' },
                { label: 'Redeem a Gift Card', icon: 'fa-solid fa-qrcode', detail: 'Enter a gift card claim code to add to your balance.' },
                { label: 'Report a Problem', icon: 'fa-solid fa-flag', detail: 'Report issues with gift cards such as invalid codes or missing balance.' }
            ]
        },
        {
            id: 'kindle',
            title: 'Kindle & Fire Support',
            desc: 'Get help with your Kindle, Fire Tablet, or Fire TV devices.',
            icon: 'fa-solid fa-tablet-screen-button',
            iconBg: '#e8f0fe',
            iconColor: '#2c5fa7',
            category: 'devices',
            keywords: ['kindle', 'fire', 'tablet', 'device', 'fire tv', 'fire stick', 'alexa', 'echo', 'setup', 'reset'],
            actions: [
                { label: 'Set Up a New Device', icon: 'fa-solid fa-power-off', detail: 'Step-by-step guide to set up your new Amazon device.' },
                { label: 'Troubleshoot Device Issues', icon: 'fa-solid fa-wrench', detail: 'Fix common problems like Wi-Fi, battery, or display issues.' },
                { label: 'Factory Reset', icon: 'fa-solid fa-rotate', detail: 'Reset your device to factory settings. This will erase all data.' },
                { label: 'Manage Content & Downloads', icon: 'fa-solid fa-download', detail: 'View and manage content downloaded to your device.' }
            ]
        },
        {
            id: 'account-security',
            title: 'Account & Security',
            desc: 'Update your login credentials, enable 2FA, or recover your account.',
            icon: 'fa-solid fa-shield-halved',
            iconBg: '#f0eaff',
            iconColor: '#5e35b1',
            category: 'account',
            keywords: ['account', 'password', 'security', 'login', 'sign in', 'email', 'two-factor', '2fa', 'locked', 'hacked', 'settings'],
            actions: [
                { label: 'Change Password', icon: 'fa-solid fa-key', detail: 'Update your Amazon account password.' },
                { label: 'Enable Two-Factor Authentication', icon: 'fa-solid fa-lock', detail: 'Add an extra layer of security to your account with 2FA.' },
                { label: 'Update Email Address', icon: 'fa-solid fa-envelope-open-text', detail: 'Change the email address associated with your account.' },
                { label: 'Recover Locked Account', icon: 'fa-solid fa-user-lock', detail: 'Regain access to your account if it has been locked.' }
            ]
        },
        {
            id: 'digital-orders',
            title: 'Digital Orders & Content',
            desc: 'Manage your digital purchases including ebooks, apps, and music.',
            icon: 'fa-solid fa-cloud-arrow-down',
            iconBg: '#e0f2f1',
            iconColor: '#00897b',
            category: 'devices',
            keywords: ['digital', 'ebook', 'music', 'app', 'download', 'content', 'stream', 'video', 'prime video'],
            actions: [
                { label: 'View Digital Orders', icon: 'fa-solid fa-receipt', detail: 'See your complete digital order history.' },
                { label: 'Report Download Issue', icon: 'fa-solid fa-triangle-exclamation', detail: 'Get help if a digital purchase failed to download or isn\'t working.' },
                { label: 'Request Digital Refund', icon: 'fa-solid fa-money-bill-transfer', detail: 'Request a refund for a digital content purchase.' }
            ]
        },
        {
            id: 'shipping-speed',
            title: 'Shipping & Delivery Options',
            desc: 'Learn about shipping speeds, fees, and delivery preferences.',
            icon: 'fa-solid fa-boxes-stacked',
            iconBg: '#fff3e0',
            iconColor: '#e65100',
            category: 'orders',
            keywords: ['shipping', 'delivery', 'speed', 'express', 'free shipping', 'same day', 'two day', 'next day', 'fee'],
            actions: [
                { label: 'View Shipping Options', icon: 'fa-solid fa-list', detail: 'Compare available shipping speeds and costs for your location.' },
                { label: 'Set Delivery Preferences', icon: 'fa-solid fa-sliders', detail: 'Choose delivery preferences like safe places or delivery day.' },
                { label: 'Amazon Day Delivery', icon: 'fa-solid fa-calendar-day', detail: 'Pick one day per week to receive all your packages.' }
            ]
        }
    ];

    // ─────────────────────────────────────────────────────────
    // 2. TILE → TOPICS MAPPING
    //    Maps each tile ID to the category of topics it shows.
    // ─────────────────────────────────────────────────────────
    const tileCategories = {
        'tile-orders':   { category: 'orders',   title: 'Your Orders',         icon: 'fa-solid fa-box-open',             iconBg: '#fff3e0', iconColor: '#d4763a' },
        'tile-returns':  { category: 'returns',  title: 'Returns & Refunds',   icon: 'fa-solid fa-rotate-left',          iconBg: '#fce4ec', iconColor: '#d63a5b' },
        'tile-prime':    { category: 'prime',     title: 'Prime',               icon: 'fa-solid fa-crown',                iconBg: '#e8f4fd', iconColor: '#0576b9' },
        'tile-payments': { category: 'payments', title: 'Payments & Gift Cards',icon: 'fa-solid fa-credit-card',         iconBg: '#fff9e0', iconColor: '#b8860b' },
        'tile-devices':  { category: 'devices',  title: 'Devices & Content',   icon: 'fa-solid fa-tablet-screen-button', iconBg: '#e8f0fe', iconColor: '#2c5fa7' },
        'tile-account':  { category: 'account',  title: 'Account Settings',    icon: 'fa-solid fa-shield-halved',        iconBg: '#f0eaff', iconColor: '#5e35b1' }
    };

    // ─────────────────────────────────────────────────────────
    // 3. DOM REFERENCES
    // ─────────────────────────────────────────────────────────
    const searchInput     = document.getElementById('cs-search-input');
    const searchBtn       = document.getElementById('cs-search-btn');
    const suggestionsBox  = document.getElementById('cs-suggestions');
    const searchResults   = document.getElementById('cs-search-results');
    const resultsTitle    = document.getElementById('cs-results-title');
    const resultsList     = document.getElementById('cs-results-list');
    const backBtn         = document.getElementById('cs-back-btn');
    const hub             = document.getElementById('cs-hub');

    // Self-service modal
    const modalOverlay    = document.getElementById('cs-modal-overlay');
    const modalIcon       = document.getElementById('cs-modal-icon');
    const modalTitle      = document.getElementById('cs-modal-title');
    const modalDesc       = document.getElementById('cs-modal-desc');
    const modalActions    = document.getElementById('cs-modal-actions');
    const modalEscalate   = document.getElementById('cs-modal-escalate');
    const modalCloseBtn   = document.getElementById('cs-modal-close');

    // Contact modal
    const contactModal      = document.getElementById('cs-contact-modal');
    const contactIcon       = document.getElementById('cs-contact-icon');
    const contactTitle      = document.getElementById('cs-contact-title');
    const contactFormArea   = document.getElementById('cs-contact-form-area');
    const contactCloseBtn   = document.getElementById('cs-contact-modal-close');

    // ─────────────────────────────────────────────────────────
    // 4. SEARCH FUNCTIONALITY
    // ─────────────────────────────────────────────────────────

    /** Score how well a topic matches the query */
    function scoreMatch(topic, query) {
        const q = query.toLowerCase().trim();
        if (!q) return 0;
        const words = q.split(/\s+/);
        let score = 0;
        // Check title
        if (topic.title.toLowerCase().includes(q)) score += 10;
        // Check keywords
        words.forEach(w => {
            topic.keywords.forEach(kw => {
                if (kw.includes(w)) score += 3;
                if (kw === w) score += 5;
            });
            if (topic.title.toLowerCase().includes(w)) score += 2;
            if (topic.desc.toLowerCase().includes(w)) score += 1;
        });
        return score;
    }

    /** Search topics and return sorted results */
    function searchTopics(query) {
        return helpTopics
            .map(t => ({ topic: t, score: scoreMatch(t, query) }))
            .filter(r => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(r => r.topic);
    }

    /** Show live suggestions while typing */
    function showSuggestions(query) {
        const results = searchTopics(query).slice(0, 5);
        if (!query.trim() || results.length === 0) {
            suggestionsBox.classList.remove('open');
            suggestionsBox.innerHTML = '';
            return;
        }
        suggestionsBox.innerHTML = results.map(t =>
            `<button class="cs-suggestion-item" data-topic-id="${t.id}" type="button">
                <i class="${t.icon}"></i>
                <span>${t.title}</span>
            </button>`
        ).join('');
        suggestionsBox.classList.add('open');

        // Bind clicks on suggestions
        suggestionsBox.querySelectorAll('.cs-suggestion-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const topicId = btn.dataset.topicId;
                const topic = helpTopics.find(t => t.id === topicId);
                if (topic) openSelfServiceModal(topic);
                suggestionsBox.classList.remove('open');
                searchInput.value = '';
            });
        });
    }

    /** Perform full search and show results panel */
    function performSearch(query) {
        suggestionsBox.classList.remove('open');
        const q = query.trim();
        if (!q) return;

        const results = searchTopics(q);
        // Show results panel, hide hub
        hub.hidden = true;
        searchResults.hidden = false;
        resultsTitle.textContent = `Results for "${q}"`;

        if (results.length === 0) {
            resultsList.innerHTML = `
                <li class="cs-no-results">
                    <i class="fa-solid fa-face-sad-tear"></i>
                    No results found for "<strong>${escapeHTML(q)}</strong>".<br>
                    Try different keywords or browse the topics below.
                </li>`;
            return;
        }

        resultsList.innerHTML = results.map((t, i) => `
            <li class="cs-result-item" data-topic-id="${t.id}" style="animation-delay:${i * 0.06}s" tabindex="0">
                <div class="cs-result-icon" style="background:${t.iconBg}; color:${t.iconColor}">
                    <i class="${t.icon}"></i>
                </div>
                <div class="cs-result-text">
                    <strong>${t.title}</strong>
                    <span>${t.desc}</span>
                </div>
                <button class="cs-result-action" type="button">
                    <i class="fa-solid fa-arrow-right"></i> View
                </button>
            </li>
        `).join('');

        // Bind clicks on results
        resultsList.querySelectorAll('.cs-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const topic = helpTopics.find(t => t.id === item.dataset.topicId);
                if (topic) openSelfServiceModal(topic);
            });
        });
    }

    // Search event listeners
    searchInput.addEventListener('input', () => showSuggestions(searchInput.value));
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
            searchInput.blur();
        }
        if (e.key === 'Escape') {
            suggestionsBox.classList.remove('open');
        }
    });
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cs-search-wrap')) {
            suggestionsBox.classList.remove('open');
        }
    });

    // Back button returns to hub
    backBtn.addEventListener('click', () => {
        searchResults.hidden = true;
        hub.hidden = false;
        searchInput.value = '';
    });

    // ─────────────────────────────────────────────────────────
    // 5. TILE CLICK → CATEGORY MODAL
    // ─────────────────────────────────────────────────────────
    Object.keys(tileCategories).forEach(tileId => {
        const tile = document.getElementById(tileId);
        if (!tile) return;
        tile.addEventListener('click', () => openCategoryModal(tileId));
        tile.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCategoryModal(tileId);
            }
        });
    });

    /** Open modal showing all topics in a category */
    function openCategoryModal(tileId) {
        const config = tileCategories[tileId];
        if (!config) return;

        const topics = helpTopics.filter(t => t.category === config.category);

        modalIcon.innerHTML = `<i class="${config.icon}"></i>`;
        modalIcon.style.background = config.iconBg;
        modalIcon.style.color = config.iconColor;
        modalTitle.textContent = config.title;
        modalDesc.textContent = `Choose a topic below to get started:`;

        modalActions.innerHTML = topics.map(t =>
            `<button class="cs-action-btn" data-topic-id="${t.id}" type="button">
                <i class="${t.icon}"></i>
                ${t.title}
            </button>`
        ).join('');

        // Bind topic clicks
        modalActions.querySelectorAll('.cs-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = helpTopics.find(t => t.id === btn.dataset.topicId);
                if (topic) openSelfServiceModal(topic);
            });
        });

        modalEscalate.hidden = false;
        showModal(modalOverlay);
    }

    // ─────────────────────────────────────────────────────────
    // 6. SELF-SERVICE WORKFLOW MODAL
    // ─────────────────────────────────────────────────────────

    /** Open modal for a specific help topic with self-service actions */
    function openSelfServiceModal(topic) {
        modalIcon.innerHTML = `<i class="${topic.icon}"></i>`;
        modalIcon.style.background = topic.iconBg;
        modalIcon.style.color = topic.iconColor;
        modalTitle.textContent = topic.title;
        modalDesc.textContent = topic.desc;

        modalActions.innerHTML = topic.actions.map((action, i) =>
            `<button class="cs-action-btn" data-action-idx="${i}" type="button">
                <i class="${action.icon}"></i>
                ${action.label}
            </button>`
        ).join('');

        // Bind action button clicks → show detail / confirmation
        modalActions.querySelectorAll('.cs-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.actionIdx);
                const action = topic.actions[idx];
                showActionDetail(action, topic);
            });
        });

        modalEscalate.hidden = false;
        showModal(modalOverlay);
    }

    /** Show detail for a specific self-service action (replaces modal content) */
    function showActionDetail(action, topic) {
        modalIcon.innerHTML = `<i class="${action.icon}"></i>`;
        modalIcon.style.background = topic.iconBg;
        modalIcon.style.color = topic.iconColor;
        modalTitle.textContent = action.label;
        modalDesc.textContent = action.detail;

        modalActions.innerHTML = `
            <button class="cs-action-btn" id="action-confirm" type="button">
                <i class="fa-solid fa-check-circle"></i>
                Got it! This resolved my issue
            </button>
            <button class="cs-action-btn" id="action-back" type="button">
                <i class="fa-solid fa-arrow-left"></i>
                Back to ${topic.title}
            </button>
        `;

        document.getElementById('action-confirm').addEventListener('click', () => {
            showSuccessInModal('Your issue has been resolved! If you need further help, don\'t hesitate to reach out.');
        });

        document.getElementById('action-back').addEventListener('click', () => {
            openSelfServiceModal(topic);
        });

        modalEscalate.hidden = false;
    }

    /** Show a success message inside the modal */
    function showSuccessInModal(message, buttonText = 'Return to Help Center', onConfirm = null) {
        modalIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        modalIcon.style.background = '#e8f5e9';
        modalIcon.style.color = '#4caf50';
        modalTitle.textContent = 'Issue Resolved!';
        modalDesc.textContent = message;
        
        if (buttonText === 'Back to Orders') {
            modalIcon.innerHTML = '<i class="fa-solid fa-trash-can" style="color:#d63a5b;"></i>';
            modalIcon.style.background = '#fce4ec';
            modalTitle.textContent = 'Order Cancelled';
        }

        modalActions.innerHTML = `
            <button class="cs-action-btn" id="action-done" type="button">
                <i class="${buttonText === 'Back to Orders' ? 'fa-solid fa-arrow-left' : 'fa-solid fa-house'}"></i>
                ${buttonText}
            </button>
        `;
        document.getElementById('action-done').addEventListener('click', () => {
            if (onConfirm) {
                onConfirm();
            } else {
                hideModal(modalOverlay);
            }
        });
        modalEscalate.hidden = true;
    }

    // ─────────────────────────────────────────────────────────
    // 7. POPULAR HELP TOPICS (bottom-left panel)
    // ─────────────────────────────────────────────────────────
    document.querySelectorAll('.cs-topic-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const topicId = btn.dataset.topic;
            const topic = helpTopics.find(t => t.id === topicId);
            if (topic) openSelfServiceModal(topic);
        });
    });

    // ─────────────────────────────────────────────────────────
    // 8. CONTACT MODALS (Chat / Call / Email)
    // ─────────────────────────────────────────────────────────

    const contactConfigs = {
        chat: {
            title: 'Chat with Us',
            icon: 'fa-solid fa-headset',
            iconBg: 'linear-gradient(135deg, #f2846a, #e85d3a)',
            iconColor: '#fff',
            form: buildChatForm
        },
        call: {
            title: 'Request a Call',
            icon: 'fa-solid fa-phone',
            iconBg: 'linear-gradient(135deg, #f5c842, #e6a800)',
            iconColor: '#5a3600',
            form: buildCallForm
        },
        email: {
            title: 'Email Us',
            icon: 'fa-solid fa-envelope',
            iconBg: 'linear-gradient(135deg, #f9d3d3, #f0adb0)',
            iconColor: '#7a1c2a',
            form: buildEmailForm
        }
    };

    function openContactModal(type) {
        const cfg = contactConfigs[type];
        if (!cfg) return;

        contactIcon.innerHTML = `<i class="${cfg.icon}"></i>`;
        contactIcon.style.background = cfg.iconBg;
        contactIcon.style.color = cfg.iconColor;
        contactTitle.textContent = cfg.title;
        contactFormArea.innerHTML = '';
        cfg.form(contactFormArea);

        // Close the self-service modal if open
        hideModal(modalOverlay);
        showModal(contactModal);
    }

    // Main contact buttons
    document.getElementById('btn-chat').addEventListener('click', () => openContactModal('chat'));
    document.getElementById('btn-call').addEventListener('click', () => openContactModal('call'));
    document.getElementById('btn-email').addEventListener('click', () => openContactModal('email'));

    // Escalation buttons inside self-service modal
    document.getElementById('esc-chat').addEventListener('click', () => openContactModal('chat'));
    document.getElementById('esc-call').addEventListener('click', () => openContactModal('call'));
    document.getElementById('esc-email').addEventListener('click', () => openContactModal('email'));

    // ─── Chat Form ───
    function buildChatForm(container) {
        container.innerHTML = `
            <div class="cs-form">
                <div>
                    <label for="chat-name">Your Name</label>
                    <input type="text" id="chat-name" placeholder="John Doe" autocomplete="name">
                </div>
                <div>
                    <label for="chat-topic">What do you need help with?</label>
                    <select id="chat-topic">
                        <option value="">Select a topic...</option>
                        <option value="order">Order Issue</option>
                        <option value="return">Return / Refund</option>
                        <option value="payment">Payment Problem</option>
                        <option value="account">Account / Security</option>
                        <option value="device">Device Support</option>
                        <option value="prime">Prime Membership</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label for="chat-message">Describe your issue</label>
                    <textarea id="chat-message" placeholder="Tell us what happened..." rows="3"></textarea>
                </div>
                <button type="button" class="cs-form-submit" id="chat-submit">
                    <i class="fa-solid fa-comments"></i> Start Chat
                </button>
            </div>
        `;
        document.getElementById('chat-submit').addEventListener('click', () => {
            const name = document.getElementById('chat-name').value.trim();
            const topic = document.getElementById('chat-topic').value;
            if (!name) { shakeField('chat-name'); return; }
            if (!topic) { shakeField('chat-topic'); return; }
            container.innerHTML = `
                <div class="cs-form-success">
                    <i class="fa-solid fa-comments"></i>
                    <p><strong>Chat session started!</strong><br>
                    Hi ${escapeHTML(name)}, an Amazon associate will be with you shortly.<br>
                    Average wait time: <strong>< 2 minutes</strong></p>
                </div>
            `;
        });
    }

    // ─── Call Form ───
    function buildCallForm(container) {
        container.innerHTML = `
            <div class="cs-form">
                <div>
                    <label for="call-name">Your Name</label>
                    <input type="text" id="call-name" placeholder="John Doe" autocomplete="name">
                </div>
                <div>
                    <label for="call-phone">Phone Number</label>
                    <input type="tel" id="call-phone" placeholder="+1 (555) 123-4567" autocomplete="tel">
                </div>
                <div>
                    <label for="call-topic">What do you need help with?</label>
                    <select id="call-topic">
                        <option value="">Select a topic...</option>
                        <option value="order">Order Issue</option>
                        <option value="return">Return / Refund</option>
                        <option value="payment">Payment Problem</option>
                        <option value="account">Account / Security</option>
                        <option value="device">Device Support</option>
                        <option value="prime">Prime Membership</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <button type="button" class="cs-form-submit" id="call-submit">
                    <i class="fa-solid fa-phone"></i> Request a Call
                </button>
            </div>
        `;
        document.getElementById('call-submit').addEventListener('click', () => {
            const name = document.getElementById('call-name').value.trim();
            const phone = document.getElementById('call-phone').value.trim();
            if (!name) { shakeField('call-name'); return; }
            if (!phone) { shakeField('call-phone'); return; }
            container.innerHTML = `
                <div class="cs-form-success">
                    <i class="fa-solid fa-phone-volume"></i>
                    <p><strong>Call requested!</strong><br>
                    Hi ${escapeHTML(name)}, we'll call you at <strong>${escapeHTML(phone)}</strong>.<br>
                    Expected callback within <strong>5 minutes</strong>.</p>
                </div>
            `;
        });
    }

    // ─── Email Form ───
    function buildEmailForm(container) {
        container.innerHTML = `
            <div class="cs-form">
                <div>
                    <label for="email-name">Your Name</label>
                    <input type="text" id="email-name" placeholder="John Doe" autocomplete="name">
                </div>
                <div>
                    <label for="email-address">Your Email</label>
                    <input type="email" id="email-address" placeholder="you@example.com" autocomplete="email">
                </div>
                <div>
                    <label for="email-subject">Subject</label>
                    <select id="email-subject">
                        <option value="">Select a topic...</option>
                        <option value="order">Order Issue</option>
                        <option value="return">Return / Refund</option>
                        <option value="payment">Payment Problem</option>
                        <option value="account">Account / Security</option>
                        <option value="device">Device Support</option>
                        <option value="prime">Prime Membership</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label for="email-body">Message</label>
                    <textarea id="email-body" placeholder="Describe your issue in detail..." rows="4"></textarea>
                </div>
                <button type="button" class="cs-form-submit" id="email-submit">
                    <i class="fa-solid fa-paper-plane"></i> Send Email
                </button>
            </div>
        `;
        document.getElementById('email-submit').addEventListener('click', () => {
            const name = document.getElementById('email-name').value.trim();
            const email = document.getElementById('email-address').value.trim();
            const subject = document.getElementById('email-subject').value;
            const body = document.getElementById('email-body').value.trim();
            if (!name)    { shakeField('email-name'); return; }
            if (!email)   { shakeField('email-address'); return; }
            if (!subject) { shakeField('email-subject'); return; }
            if (!body)    { shakeField('email-body'); return; }
            container.innerHTML = `
                <div class="cs-form-success">
                    <i class="fa-solid fa-envelope-circle-check"></i>
                    <p><strong>Email sent!</strong><br>
                    Thanks ${escapeHTML(name)}, we've received your message and will reply to <strong>${escapeHTML(email)}</strong> within <strong>24 hours</strong>.</p>
                </div>
            `;
        });
    }

    // ─────────────────────────────────────────────────────────
    // 9. MODAL SHOW / HIDE HELPERS
    // ─────────────────────────────────────────────────────────
    function showModal(overlay) {
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function hideModal(overlay) {
        overlay.hidden = true;
        // Only restore scroll if no other modal is open
        if (modalOverlay.hidden && contactModal.hidden) {
            document.body.style.overflow = '';
        }
    }

    // Close buttons
    modalCloseBtn.addEventListener('click', () => hideModal(modalOverlay));
    contactCloseBtn.addEventListener('click', () => hideModal(contactModal));

    // Click overlay to close
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) hideModal(modalOverlay);
    });
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) hideModal(contactModal);
    });

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!contactModal.hidden) hideModal(contactModal);
            else if (!modalOverlay.hidden) hideModal(modalOverlay);
        }
    });

    // ─────────────────────────────────────────────────────────
    // 10. UTILITY FUNCTIONS
    // ─────────────────────────────────────────────────────────

    /** Escape HTML to prevent XSS */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /** Shake animation for validation */
    function shakeField(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.borderColor = '#e53935';
        el.style.transition = 'transform 0.08s';
        el.style.transform = 'translateX(-6px)';
        setTimeout(() => { el.style.transform = 'translateX(6px)'; }, 80);
        setTimeout(() => { el.style.transform = 'translateX(-4px)'; }, 160);
        setTimeout(() => { el.style.transform = 'translateX(4px)'; }, 240);
        setTimeout(() => { el.style.transform = 'translateX(0)'; el.focus(); }, 320);
        setTimeout(() => { el.style.borderColor = ''; }, 2000);
    }

    // ─────────────────────────────────────────────────────────
    // 11. PERSONALIZED HELP (recent orders from localStorage or fallback)
    // ─────────────────────────────────────────────────────────
    function getRecentOrders() {
        const storedStr = localStorage.getItem("amazonOrders");
        if (!storedStr) return [];
        try { return JSON.parse(storedStr); }
        catch(e) { return []; }
    }

    // If we're on the orders tile, show personalized orders in the modal
    const originalOpenCategory = openCategoryModal;
    // We override the tile-orders behavior to show recent orders
    const tileOrders = document.getElementById('tile-orders');
    if (tileOrders) {
        // Remove old listener and add enhanced one
        tileOrders.replaceWith(tileOrders.cloneNode(true));
        const newTileOrders = document.getElementById('tile-orders');
        newTileOrders.addEventListener('click', () => {
            openPersonalizedOrdersModal();
        });
        newTileOrders.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPersonalizedOrdersModal();
            }
        });
    }

    function openPersonalizedOrdersModal() {
        const config = tileCategories['tile-orders'];
        modalIcon.innerHTML = `<i class="${config.icon}"></i>`;
        modalIcon.style.background = config.iconBg;
        modalIcon.style.color = config.iconColor;
        modalTitle.textContent = 'Your Recent Orders';
        modalDesc.textContent = 'Here are your most recent orders. Select one for help, or browse order topics below.';

        const orders = getRecentOrders();
        let html = '<div style="margin-bottom:16px;">';
        if (orders.length === 0) {
            html += `
                <div style="text-align:center;padding:24px 12px;color:#888;background:#fafafa;border-radius:8px;border:1px dashed #ddd;margin-bottom:8px;">
                    <i class="fa-solid fa-box-open" style="font-size:28px;margin-bottom:8px;color:#ccc;display:block;"></i>
                    <p style="font-size:13px;margin:0;font-weight:600;">You have no active or recent orders.</p>
                </div>`;
        } else {
            orders.forEach(order => {
                const statusColor = order.status === 'Delivered' ? '#4caf50' :
                                    order.status === 'In Transit' ? '#f5a623' : '#2196f3';
                // Show item image if it exists, otherwise show default box icon
                // Sanitize item title to prevent HTML injection from apostrophes
                const safeTitle = (order.item || '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                const imageHtml = order.image 
                    ? `<img src="${order.image}" style="width:32px;height:32px;object-fit:contain;margin-right:12px;border-radius:4px;border:1px solid #ddd;padding:2px;background:#fff;" onerror="this.style.display='none'">`
                    : `<i class="fa-solid fa-box" style="color:${statusColor};margin-right:12px;"></i>`;

                html += `
                    <button class="cs-action-btn" data-order-id="${order.id}" type="button" style="margin-bottom:6px;display:flex;align-items:center;padding:10px 14px;">
                        ${imageHtml}
                        <span style="flex:1;text-align:left;">
                            <strong style="display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;">${safeTitle}</strong>
                            <small style="color:#888;">${order.id} · ${order.date}</small>
                        </span>
                        <span style="font-size:12px;color:${statusColor};font-weight:700;margin-left:8px;">${order.status}</span>
                    </button>`;
            });
        }
        html += '</div>';

        // Also add general order topics
        const orderTopics = helpTopics.filter(t => t.category === 'orders');
        html += '<p style="font-size:13px;color:#888;margin-bottom:10px;">Or browse order help topics:</p>';
        orderTopics.forEach(t => {
            html += `<button class="cs-action-btn" data-topic-id="${t.id}" type="button">
                <i class="${t.icon}"></i> ${t.title}
            </button>`;
        });

        modalActions.innerHTML = html;

        // Bind order buttons
        modalActions.querySelectorAll('[data-order-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.dataset.orderId;
                const order = orders.find(o => o.id === orderId);
                showOrderDetailModal(order);
            });
        });

        // Bind topic buttons
        modalActions.querySelectorAll('[data-topic-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = helpTopics.find(t => t.id === btn.dataset.topicId);
                if (topic) openSelfServiceModal(topic);
            });
        });

        modalEscalate.hidden = false;
        showModal(modalOverlay);
    }

    function showOrderDetailModal(order) {
        const statusColor = order.status === 'Delivered' ? '#4caf50' :
                            order.status === 'In Transit' ? '#f5a623' : '#2196f3';
        
        // Show item image if it exists
        if (order.image) {
            modalIcon.innerHTML = `<img src="${order.image}" style="width:100%;height:100%;object-fit:contain;border-radius:4px;" onerror="this.outerHTML='<i class=\"fa-solid fa-box-open\"></i>`;
            modalIcon.style.background = '#f5f5f5';
            modalIcon.style.padding = '4px';
        } else {
            modalIcon.innerHTML = '<i class="fa-solid fa-box-open"></i>';
            modalIcon.style.background = '#fff3e0';
            modalIcon.style.color = '#d4763a';
        }

        modalTitle.textContent = order.item;
        modalDesc.innerHTML = `
            <span style="display:inline-block;padding:4px 12px;border-radius:20px;background:${statusColor}22;color:${statusColor};font-weight:700;font-size:13px;margin-bottom:8px;">${order.status}</span><br>
            <span style="color:#888;font-size:13px;">Order #${order.id} · ${order.date}</span>
        `;

        let actions = [];
        if (order.status === 'Processing') {
            actions = [
                { label: 'Cancel This Order', icon: 'fa-solid fa-ban' },
                { label: 'Change Delivery Address', icon: 'fa-solid fa-location-dot' },
                { label: 'Change Payment Method', icon: 'fa-solid fa-credit-card' }
            ];
        } else if (order.status === 'In Transit') {
            actions = [
                { label: 'Track Package', icon: 'fa-solid fa-truck-fast' },
                { label: 'Change Delivery Instructions', icon: 'fa-solid fa-note-sticky' },
                { label: 'Report a Problem', icon: 'fa-solid fa-circle-exclamation' }
            ];
        } else {
            actions = [
                { label: 'Start a Return', icon: 'fa-solid fa-rotate-left' },
                { label: 'Request a Refund', icon: 'fa-solid fa-money-bill-wave' },
                { label: 'Leave a Review', icon: 'fa-solid fa-star' },
                { label: 'Buy Again', icon: 'fa-solid fa-cart-plus' }
            ];
        }

        modalActions.innerHTML = actions.map(a =>
            `<button class="cs-action-btn cs-order-action" type="button">
                <i class="${a.icon}"></i> ${a.label}
            </button>`
        ).join('') + `
            <button class="cs-action-btn" id="back-to-orders" type="button" style="margin-top:6px;">
                <i class="fa-solid fa-arrow-left"></i> Back to Orders
            </button>
        `;

        // Order action confirmation
        modalActions.querySelectorAll('.cs-order-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const actionLabel = btn.textContent.trim();
                if (actionLabel === 'Cancel This Order') {
                    // Remove from localStorage
                    let orders = getRecentOrders();
                    orders = orders.filter(o => o.id !== order.id);
                    localStorage.setItem("amazonOrders", JSON.stringify(orders));
                    
                    showSuccessInModal(
                        `Order #${order.id} ("${order.item}") has been successfully cancelled and removed from your account.`,
                        'Back to Orders',
                        () => {
                            openPersonalizedOrdersModal();
                        }
                    );
                } else {
                    showSuccessInModal(
                        `Your request for "${actionLabel}" on order #${order.id} has been submitted. We'll notify you via email with next steps.`,
                        'Return to Help Center',
                        () => {
                            hideModal(modalOverlay);
                        }
                    );
                }
            });
        });

        document.getElementById('back-to-orders').addEventListener('click', () => {
            openPersonalizedOrdersModal();
        });

        modalEscalate.hidden = false;
    }

    // ─────────────────────────────────────────────────────────
    // 12. HASH-BASED DEEP LINKING
    //     Supports links like /Customer-Service/#tile-orders
    // ─────────────────────────────────────────────────────────
    function handleHash() {
        const hash = window.location.hash.replace('#', '');
        if (!hash) return;
        if (tileCategories[hash]) {
            // Slight delay to let the page render
            setTimeout(() => {
                const tile = document.getElementById(hash);
                if (tile) tile.click();
            }, 300);
        }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();

})();

document.getElementById('search-btn').addEventListener('click', () => {
  const query = document.getElementById('main-search').value;
  window.location = `../search.html?q=${encodeURIComponent(query)}`;
});
