class EnigmaEngine {
    constructor() {
        // Authentic Historical 1930 Military Enigma I Rotor Wirings
        this.ROTOR_WIRINGS = {
            'I': 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', // Rotor I
            'II': 'AJDKSIRUXBLHWTMCQGZNPYFVOE', // Rotor II
            'III': 'BDFHJLCPRTXVZNYEIWGAKMUSQO'  // Rotor III
        };

        // Rotor Turnover Notches (Stepping markers)
        this.NOTCHES = { 'I': 'Q', 'II': 'E', 'III': 'V' };

        // Static Reflector Wide Matrix Mapping (UKW-B)
        this.REFLECTOR = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.layoutRows = [
            ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'],
            ['P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M']
        ];

        this.initInterface();
        this.registerInteractions();
    }

    initInterface() {
        const buildUI = (containerPrefix, entityClass) => {
            this.layoutRows.forEach((row, idx) => {
                const targetRow = document.getElementById(`${containerPrefix}Row${idx + 1}`);
                row.forEach(char => {
                    const node = document.createElement('div');
                    node.id = `${containerPrefix}_${char}`;
                    node.className = entityClass;
                    node.innerText = char;
                    targetRow.appendChild(node);
                });
            });
        };

        buildUI('lamp', 'lamp');
        buildUI('key', 'key');
    }

    registerInteractions() {
        // Track virtual keyboard input triggers
        this.layoutRows.flat().forEach(char => {
            const keyNode = document.getElementById(`key_${char}`);

            keyNode.addEventListener('mousedown', () => this.processCharacterCycle(char));
            keyNode.addEventListener('mouseup', () => this.clearActiveLamps());
        });

        // Sync local keyboard events
        window.addEventListener('keydown', (e) => {
            const letter = e.key.toUpperCase();
            if (this.alphabet.includes(letter) && !e.repeat) {
                const targetKey = document.getElementById(`key_${letter}`);
                if (targetKey) targetKey.classList.add('active');
                this.processCharacterCycle(letter);
            }
        });

        window.addEventListener('keyup', (e) => {
            const letter = e.key.toUpperCase();
            if (this.alphabet.includes(letter)) {
                const targetKey = document.getElementById(`key_${letter}`);
                if (targetKey) targetKey.classList.remove('active');
                this.clearActiveLamps();
            }
        });
    }

    // Advances mechanics based on historical stepping rules (including double-stepping)
    stepRotors() {
        const rTypeLeft = document.getElementById('rotorLeftType').value;
        const rTypeMid = document.getElementById('rotorMidType').value;
        const rTypeRight = document.getElementById('rotorRightType').value;

        let pLeft = this.alphabet.indexOf(document.getElementById('posLeft').value.toUpperCase());
        let pMid = this.alphabet.indexOf(document.getElementById('posMid').value.toUpperCase());
        let pRight = this.alphabet.indexOf(document.getElementById('posRight').value.toUpperCase());

        let stepLeft = false;
        let stepMid = false;
        let stepRight = true; // Right rotor always steps on every keypress

        // Double-stepping mechanism: if middle rotor is at its notch, it steps along with the left rotor
        if (pMid === this.alphabet.indexOf(this.NOTCHES[rTypeMid])) {
            stepLeft = true;
            stepMid = true;
        }
        // Right rotor notch triggers middle rotor step
        else if (pRight === this.alphabet.indexOf(this.NOTCHES[rTypeRight])) {
            stepMid = true;
        }

        if (stepLeft) pLeft = (pLeft + 1) % 26;
        if (stepMid) pMid = (pMid + 1) % 26;
        if (stepRight) pRight = (pRight + 1) % 26;

        document.getElementById('posLeft').value = this.alphabet[pLeft];
        document.getElementById('posMid').value = this.alphabet[pMid];
        document.getElementById('posRight').value = this.alphabet[pRight];
    }

    shiftSubstitution(index, offset, forward = true) {
        if (forward) {
            return (index + offset + 26) % 26;
        } else {
            return (index - offset + 26) % 26;
        }
    }

    processCharacterCycle(inputChar) {
        // 1. Advance the mechanical rotor positions before routing the current
        this.stepRotors();

        // Capture current settings and wiring paths
        const config = [
            { id: 'Left', type: document.getElementById('rotorLeftType').value },
            { id: 'Mid', type: document.getElementById('rotorMidType').value },
            { id: 'Right', type: document.getElementById('rotorRightType').value }
        ];

        const offsets = config.map(c => this.alphabet.indexOf(document.getElementById(`pos${c.id}`).value.toUpperCase()));

        let charIdx = this.alphabet.indexOf(inputChar);

        // 2. FORWARD PATH MODULE: Keyboard -> Right -> Mid -> Left
        for (let i = 2; i >= 0; i--) {
            const subSpaceIdx = this.shiftSubstitution(charIdx, offsets[i], true);
            const cipherChar = this.ROTOR_WIRINGS[config[i].type][subSpaceIdx];
            charIdx = this.shiftSubstitution(this.alphabet.indexOf(cipherChar), offsets[i], false);
        }

        // 3. REFLECTOR LOOP: Bounces signal back
        charIdx = this.alphabet.indexOf(this.REFLECTOR[charIdx]);

        // 4. REVERSE PATH MODULE: Left -> Mid -> Right -> Lampboard
        for (let i = 0; i < 3; i++) {
            const subSpaceIdx = this.shiftSubstitution(charIdx, offsets[i], true);
            const rawChar = this.alphabet[subSpaceIdx];
            const originalWiringIdx = this.ROTOR_WIRINGS[config[i].type].indexOf(rawChar);
            charIdx = this.shiftSubstitution(originalWiringIdx, offsets[i], false);
        }

        const outChar = this.alphabet[charIdx];

        // Light up the target character lamp
        const targetLamp = document.getElementById(`lamp_${outChar}`);
        if (targetLamp) targetLamp.classList.add('active');

        // Append to running output terminal view logs
        document.getElementById('outputLog').innerText += outChar;
    }

    clearActiveLamps() {
        this.layoutRows.flat().forEach(char => {
            const lamp = document.getElementById(`lamp_${char}`);
            if (lamp) lamp.classList.remove('active');
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new EnigmaEngine();
});