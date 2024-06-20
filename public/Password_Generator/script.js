function generatePassword(length, useUpper, useLower, useDigits, useSpecial) {
    let characterPool = '';
    let mandatoryCharacters = '';

    if (useUpper) {
        characterPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        mandatoryCharacters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    }
    if (useLower) {
        characterPool += 'abcdefghijklmnopqrstuvwxyz';
        mandatoryCharacters += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    }
    if (useDigits) {
        characterPool += '0123456789';
        mandatoryCharacters += '0123456789'[Math.floor(Math.random() * 10)];
    }
    if (useSpecial) {
        characterPool += '!@#$%^&*()_+[]{}|;:,.<>?';
        const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';
        mandatoryCharacters += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    }

    if (!characterPool) {
        alert("No character types selected! Please select at least one character type.");
        return '';
    }

    let password = mandatoryCharacters;
    for (let i = mandatoryCharacters.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }

    // Shuffle the password to ensure mandatory characters are not in the same order
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    return password;
}

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const length = parseInt(document.getElementById('lengthofpassword').value);
    if (length <= 0) {
        alert("Please Enter a Larger Value for Length");
        return;
    }

    const useUpper = document.querySelector('input[name="uppercase"]:checked').value === 'option1';
    const useLower = document.querySelector('input[name="lowercase"]:checked').value === 'option1';
    const useDigits = document.querySelector('input[name="digit"]:checked').value === 'option1';
    const useSpecial = document.querySelector('input[name="special"]:checked').value === 'option1';

    // Ensure length is sufficient to include all mandatory characters
    const selectedOptionsCount = useUpper + useLower + useDigits + useSpecial;
    if (length < selectedOptionsCount) {
        alert(`Please enter a length of at least ${selectedOptionsCount} to include all selected character types.`);
        return;
    }

    const password = generatePassword(length, useUpper, useLower, useDigits, useSpecial);
    if (password) {
        alert(`Generated password: ${password}`);
    }
});
