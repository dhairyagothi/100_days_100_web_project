/**
 * PassPulse - Premium Password Analyzer & Generator
 * Pure Vanilla JavaScript | High-Performance Utility
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // DOM Element Selections
    // ==========================================================================
    
    // Password Checker Elements
    const passwordInput = document.getElementById('password-input');
    const toggleVisibilityBtn = document.getElementById('toggle-visibility');
    const eyeOpenIcon = document.querySelector('.eye-open');
    const eyeClosedIcon = document.querySelector('.eye-closed');
    const strengthBadge = document.getElementById('strength-badge');
    const strengthScore = document.getElementById('strength-score');
    const meterBar = document.getElementById('meter-bar');
    const checklistItems = document.querySelectorAll('.requirement-item');
    
    // Security Insights Elements
    const crackTimeDisplay = document.getElementById('crack-time-display');
    const entropyDisplay = document.getElementById('entropy-display');
    const securityTipText = document.getElementById('security-tip-text');
    
    // Password Generator Elements
    const generatorOutput = document.getElementById('generator-output');
    const copyBtn = document.getElementById('copy-password');
    const copyIcon = document.querySelector('.copy-icon');
    const copySuccessIcon = document.querySelector('.copy-success-icon');
    const copyTooltip = document.getElementById('copy-tooltip');
    const lengthSlider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-val');
    const generateBtn = document.getElementById('generate-btn');
    const genUpper = document.getElementById('gen-upper');
    const genLower = document.getElementById('gen-lower');
    const genNumbers = document.getElementById('gen-numbers');
    const genSymbols = document.getElementById('gen-symbols');

    // ==========================================================================
    // Core Logic: Live Password Analyzer
    // ==========================================================================
    
    // Define the regular expression rules
    const rules = {
        length: (pwd) => pwd.length >= 8,
        uppercase: (pwd) => /[A-Z]/.test(pwd),
        lowercase: (pwd) => /[a-z]/.test(pwd),
        number: (pwd) => /[0-9]/.test(pwd),
        special: (pwd) => /[^A-Za-z0-9]/.test(pwd)
    };

    /**
     * Updates strength meter, badge text, and progress bar width/color based on score
     */
    function updateStrengthMeter(score, hasPassword) {
        // Remove all previous strength classes from meter bar
        meterBar.className = 'meter-bar';
        
        if (!hasPassword) {
            strengthBadge.textContent = 'Empty';
            strengthBadge.style.color = 'var(--text-muted)';
            strengthScore.textContent = '0 / 5';
            meterBar.style.width = '0%';
            return;
        }

        const percentage = (score / 5) * 100;
        meterBar.style.width = `${percentage}%`;
        strengthScore.textContent = `${score} / 5`;

        // Update levels according to the standard score
        switch (score) {
            case 1:
                strengthBadge.textContent = 'Weak';
                strengthBadge.style.color = 'var(--strength-0)';
                meterBar.classList.add('strength-weak');
                break;
            case 2:
                strengthBadge.textContent = 'Fair';
                strengthBadge.style.color = 'var(--strength-1)';
                meterBar.classList.add('strength-fair');
                break;
            case 3:
                strengthBadge.textContent = 'Medium';
                strengthBadge.style.color = 'var(--strength-2)';
                meterBar.classList.add('strength-good');
                break;
            case 4:
                strengthBadge.textContent = 'Strong';
                strengthBadge.style.color = 'var(--strength-3)';
                meterBar.classList.add('strength-strong');
                break;
            case 5:
                strengthBadge.textContent = 'Bulletproof!';
                strengthBadge.style.color = 'var(--strength-5)';
                meterBar.classList.add('strength-bulletproof');
                break;
            default:
                strengthBadge.textContent = 'Very Weak';
                strengthBadge.style.color = 'var(--strength-0)';
                meterBar.classList.add('strength-weak');
                break;
        }
    }

    /**
     * Calculates Shannon entropy (log2(poolSize) * length) & crack-time estimate
     */
    function analyzeSecurityInsights(password, score) {
        if (!password) {
            entropyDisplay.textContent = '0 bits';
            crackTimeDisplay.textContent = 'Instantly';
            securityTipText.textContent = 'Start typing your password to get dynamic security tips to secure your accounts.';
            return;
        }

        // 1. Determine size of character pool based on matched classes
        let poolSize = 0;
        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/[0-9]/.test(password)) poolSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33; // Standard special characters on US keyboards

        // 2. Entropy calculations
        const length = password.length;
        const entropy = Math.round(Math.log2(poolSize) * length);
        entropyDisplay.textContent = `${entropy} bits`;

        // 3. Crack-Time calculations
        // Attacker model: 10 billion attempts (1e10) per second using custom GPU setups
        const guessesPerSec = 1e10;
        const searchSpace = Math.pow(poolSize, length);
        
        // Average combinations checked is searchSpace / 2
        const secondsToCrack = (searchSpace / 2) / guessesPerSec;

        let timeLabel = '';
        if (secondsToCrack < 0.1) {
            timeLabel = 'Instantly';
        } else if (secondsToCrack < 60) {
            timeLabel = 'A few seconds';
        } else if (secondsToCrack < 3600) {
            timeLabel = 'A few minutes';
        } else if (secondsToCrack < 86400) {
            timeLabel = 'A few hours';
        } else if (secondsToCrack < 2592000) {
            timeLabel = `${Math.round(secondsToCrack / 86400)} days`;
        } else if (secondsToCrack < 31536000) {
            timeLabel = `${Math.round(secondsToCrack / 2592000)} months`;
        } else if (secondsToCrack < 3153600000) {
            timeLabel = `${Math.round(secondsToCrack / 31536000)} years`;
        } else if (secondsToCrack < 315360000000) {
            timeLabel = 'Centuries';
        } else if (secondsToCrack < 315360000000000) {
            timeLabel = 'Eons';
        } else {
            timeLabel = 'Eternal 🛡️';
        }

        crackTimeDisplay.textContent = timeLabel;

        // 4. Context-aware security tips
        let suggestions = [];
        if (length < 8) {
            suggestions.push('Make it at least 8 characters. Length is key!');
        } else if (length < 12) {
            suggestions.push('Increasing length beyond 12 characters exponentially boosts security.');
        }
        
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
            suggestions.push('Mix uppercase (A-Z) and lowercase (a-z) characters.');
        }
        if (!/[0-9]/.test(password)) {
            suggestions.push('Add numbers (0-9) to disrupt simple word-dictionary attacks.');
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            suggestions.push('Incorporate special characters (!, @, #, $, etc.) for peak entropy.');
        }

        if (score === 5 && length >= 12) {
            securityTipText.textContent = 'Excellent choice! This is an exceptionally secure password that is highly resilient to all modern hacking methods.';
        } else if (suggestions.length > 0) {
            securityTipText.textContent = suggestions[Math.floor(Math.random() * suggestions.length)];
        } else {
            securityTipText.textContent = 'Your password is strong. Make it even longer to ensure absolute safety across decades.';
        }
    }

    /**
     * Centralized event handler for checking password on input
     */
    function handlePasswordVerification() {
        const passwordValue = passwordInput.value;
        const hasPassword = passwordValue.length > 0;
        let score = 0;

        checklistItems.forEach(item => {
            const ruleName = item.getAttribute('data-rule');
            const checkFn = rules[ruleName];
            const isValid = checkFn(passwordValue);

            const emptyCircle = item.querySelector('.circle');
            const checkMark = item.querySelector('.check');

            if (isValid) {
                item.classList.add('valid');
                emptyCircle.classList.add('hidden');
                checkMark.classList.remove('hidden');
                score++;
            } else {
                item.classList.remove('valid');
                emptyCircle.classList.remove('hidden');
                checkMark.classList.add('hidden');
            }
        });

        // Update elements
        updateStrengthMeter(score, hasPassword);
        analyzeSecurityInsights(passwordValue, score);
    }

    // Bind verification event listener
    passwordInput.addEventListener('input', handlePasswordVerification);

    // Visibility toggle (Show / Hide Password)
    toggleVisibilityBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'password') {
            eyeOpenIcon.classList.remove('hidden');
            eyeClosedIcon.classList.add('hidden');
            toggleVisibilityBtn.title = 'Show Password';
        } else {
            eyeOpenIcon.classList.add('hidden');
            eyeClosedIcon.classList.remove('hidden');
            toggleVisibilityBtn.title = 'Hide Password';
        }
    });

    // ==========================================================================
    // Extra Feature: Strong Random Password Generator
    // ==========================================================================
    
    // Sync slider output display
    lengthSlider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
    });

    const CHAR_SETS = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:\',./<>?`~'
    };

    /**
     * Generates a secure random password using Cryptographically Secure Pseudo-Random Numbers
     */
    function generateSecurePassword() {
        const length = parseInt(lengthSlider.value, 10);
        let activePool = '';
        let guaranteedChars = [];

        // Track user selections & load pool sets
        if (genUpper.checked) {
            activePool += CHAR_SETS.upper;
            guaranteedChars.push(getRandomChar(CHAR_SETS.upper));
        }
        if (genLower.checked) {
            activePool += CHAR_SETS.lower;
            guaranteedChars.push(getRandomChar(CHAR_SETS.lower));
        }
        if (genNumbers.checked) {
            activePool += CHAR_SETS.numbers;
            guaranteedChars.push(getRandomChar(CHAR_SETS.numbers));
        }
        if (genSymbols.checked) {
            activePool += CHAR_SETS.symbols;
            guaranteedChars.push(getRandomChar(CHAR_SETS.symbols));
        }

        // If no types are selected, force lowercase or prompt a choice
        if (activePool === '') {
            alert('Please select at least one character type option for generation.');
            return;
        }

        // Fill remaining spaces with random items from the overall selected activePool
        const remainingLength = length - guaranteedChars.length;
        for (let i = 0; i < remainingLength; i++) {
            guaranteedChars.push(getRandomChar(activePool));
        }

        // Shuffle guaranteed items to prevent visual pattern predictability
        const generatedString = shuffleArray(guaranteedChars).join('');
        
        // Output password and copy to active analyzer field if the user wants to check it
        generatorOutput.value = generatedString;
        
        // Trigger verification automatically when generator outputs
        passwordInput.value = generatedString;
        handlePasswordVerification();
    }

    /**
     * Fetches a single random character using Cryptographically Secure APIs
     */
    function getRandomChar(str) {
        const randomValues = new Uint32Array(1);
        window.crypto.getRandomValues(randomValues);
        const index = randomValues[0] % str.length;
        return str.charAt(index);
    }

    /**
     * Fisher-Yates array shuffling using Cryptographically Secure APIs
     */
    function shuffleArray(arr) {
        const shuffled = [...arr];
        const randomValues = new Uint32Array(shuffled.length);
        window.crypto.getRandomValues(randomValues);

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = randomValues[i] % (i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Connect generation actions
    generateBtn.addEventListener('click', () => {
        // Spin spinner feedback
        const spinner = generateBtn.querySelector('.btn-spinner');
        spinner.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
            spinner.style.transform = '';
        }, 600);

        generateSecurePassword();
    });

    // ==========================================================================
    // Clipboard Copy Animation Utility
    // ==========================================================================
    copyBtn.addEventListener('click', () => {
        const passwordToCopy = generatorOutput.value;
        if (!passwordToCopy) return;

        navigator.clipboard.writeText(passwordToCopy).then(() => {
            // Success Feedback
            copyIcon.classList.add('hidden');
            copySuccessIcon.classList.remove('hidden');
            copyTooltip.classList.add('show');

            // Reset back to original look after timeout
            setTimeout(() => {
                copyIcon.classList.remove('hidden');
                copySuccessIcon.classList.add('hidden');
                copyTooltip.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('Clipboard copy failed: ', err);
        });
    });

    // Reset input fields to be absolutely empty on page load, ignoring browser auto-fills
    passwordInput.value = '';
    generatorOutput.value = '';
    handlePasswordVerification();
});
