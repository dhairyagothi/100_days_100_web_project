// --- HARDWARE COMPONENT REPRESENTATION MATRIX ---
const cpu = {
    registers: { A: 0, B: 0, C: 0, D: 0 },
    PC: 0,       // Program Counter index pointer
    flags: { Z: 1, C: 0 }, // Zero and Carry status indicators
    RAM: new Uint8Array(16), // Strict 16-byte virtual address memory block
    halted: false
};

// Instruction-to-Opcode hex mapping dictionary
const OPCODES = { HALT: 0x00, MOV: 0x01, ADD: 0x02, SUB: 0x03, JMP: 0x04 };

let instructionInterval = null;

// --- DOM BINDINGS ---
const ramGrid = document.getElementById('ram-matrix');
const consoleOutput = document.getElementById('console-output');
const btnStep = document.getElementById('btn-step');
const btnRun = document.getElementById('btn-run');

// Generate structural UI elements for the 16-byte RAM visualization grid
function renderInitialHardwareGrid() {
    ramGrid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const hexAddress = '0x' + i.toString(16).toUpperCase();
        ramGrid.innerHTML += `
            <div class="ram-cell" id="ram-cell-${i}">
                <span class="ram-addr">${hexAddress}</span>
                <span class="ram-data" id="ram-data-${i}">00</span>
            </div>
        `;
    }
}

// Update the glowing UI dashboard fields with current CPU states
function updateHardwareDashboard() {
    document.getElementById('reg-a').textContent = cpu.registers.A.toString(16).toUpperCase().padStart(2, '0');
    document.getElementById('reg-b').textContent = cpu.registers.B.toString(16).toUpperCase().padStart(2, '0');
    document.getElementById('reg-c').textContent = cpu.registers.C.toString(16).toUpperCase().padStart(2, '0');
    document.getElementById('reg-d').textContent = cpu.registers.D.toString(16).toUpperCase().padStart(2, '0');
    document.getElementById('reg-pc').textContent = '0x' + cpu.PC.toString(16).toUpperCase().padStart(2, '0');
    document.getElementById('reg-flags').textContent = `Z:${cpu.flags.Z} C:${cpu.flags.C}`;

    // Update RAM visualization indicators dynamically
    for (let i = 0; i < 16; i++) {
        const cell = document.getElementById(`ram-cell-${i}`);
        const dataElement = document.getElementById(`ram-data-${i}`);

        dataElement.textContent = cpu.RAM[i].toString(16).toUpperCase().padStart(2, '0');

        // Highlight cell if the Program Counter is targeting it
        if (i === cpu.PC && !cpu.halted) {
            cell.classList.add('active-pc');
        } else {
            cell.classList.remove('active-pc');
        }
    }
}

function printConsole(text, isError = false) {
    consoleOutput.textContent = text;
    consoleOutput.style.color = isError ? '#ef4444' : '#a4b0be';
}

// --- COMPILER STRATEGY ENGINE (LEXER & PARSER) ---
document.getElementById('btn-assemble').addEventListener('click', () => {
    const rawLines = document.getElementById('assembly-input').value.split('\n');
    cpu.RAM.fill(0); // Wipe memory for fresh compile load

    let memoryWritePtr = 0;
    printConsole("Initializing compilation pipeline...");

    try {
        for (let rawLine of rawLines) {
            // Strip comments and redundant whitespaces cleanly
            let cleanLine = rawLine.split(';')[0].trim();
            if (!cleanLine) continue; // Ignore empty breaks safely

            if (memoryWritePtr >= 16) throw new Error("Compilation Error: Out of 16-byte memory limits.");

            // Tokenize standard instructions: MOV A, 5 -> ['MOV', 'A,', '5']
            let tokens = cleanLine.replace(/,/g, ' ').split(/\s+/);
            let operation = tokens[0].toUpperCase();

            if (operation === 'HALT') {
                cpu.RAM[memoryWritePtr++] = OPCODES.HALT;
            }
            else if (operation === 'MOV') {
                let targetReg = tokens[1].toUpperCase();
                let literalValue = parseInt(tokens[2]);

                if (!['A', 'B', 'C', 'D'].includes(targetReg) || isNaN(literalValue)) {
                    throw new Error(`Syntax Error: Invalid arguments in line "${cleanLine}"`);
                }

                // Encode layout details: Opcode -> target register metadata identity -> numeric payload byte
                cpu.RAM[memoryWritePtr++] = OPCODES.MOV;
                cpu.RAM[memoryWritePtr++] = targetReg.charCodeAt(0); // Convert register letter character to ASCII byte
                cpu.RAM[memoryWritePtr++] = literalValue & 0xFF;     // Sanitize to 8-bit boundaries
            }
            else if (operation === 'ADD' || operation === 'SUB') {
                let regDest = tokens[1].toUpperCase();
                let regSrc = tokens[2].toUpperCase();

                cpu.RAM[memoryWritePtr++] = OPCODES[operation];
                cpu.RAM[memoryWritePtr++] = regDest.charCodeAt(0);
                cpu.RAM[memoryWritePtr++] = regSrc.charCodeAt(0);
            }
            else {
                throw new Error(`Assembler Exception: Token pattern instruction "${operation}" unrecognizable.`);
            }
        }

        // Fresh compile configuration resetting states completely
        resetHardwareState();
        btnStep.disabled = false;
        btnRun.disabled = false;
        printConsole("Compilation successful. Machine code map injected safely into RAM vectors.");
    } catch (err) {
        printConsole(err.message, true);
    }
});

// --- FETCH-DECODE-EXECUTE PROCESSOR RUNTIME PASS ---
function executeClockCycleStep() {
    if (cpu.halted || cpu.PC >= 16) {
        cpu.halted = true;
        clearInterval(instructionInterval);
        printConsole("Processor execution finished (System HALT or memory out of bounds).");
        return;
    }

    // Fetch block instruction bytecode operations
    let currentOpcode = cpu.RAM[cpu.PC];

    // Decode & Execute Operations via Bitwise Math
    switch (currentOpcode) {
        case OPCODES.HALT:
            cpu.halted = true;
            break;

        case OPCODES.MOV: {
            let regAscii = cpu.RAM[cpu.PC + 1];
            let value = cpu.RAM[cpu.PC + 2];
            let regLetter = String.fromCharCode(regAscii);

            cpu.registers[regLetter] = value;
            cpu.PC += 3; // Shift instruction pointer past operation payload data blocks
            break;
        }

        case OPCODES.ADD: {
            let destReg = String.fromCharCode(cpu.RAM[cpu.PC + 1]);
            let srcReg = String.fromCharCode(cpu.RAM[cpu.PC + 2]);

            let result = cpu.registers[destReg] + cpu.registers[srcReg];
            cpu.flags.C = result > 255 ? 1 : 0; // Evaluate Arithmetic Overflow states
            cpu.registers[destReg] = result & 0xFF;
            cpu.flags.Z = cpu.registers[destReg] === 0 ? 1 : 0;

            cpu.PC += 3;
            break;
        }

        case OPCODES.SUB: {
            let destReg = String.fromCharCode(cpu.RAM[cpu.PC + 1]);
            let srcReg = String.fromCharCode(cpu.RAM[cpu.PC + 2]);

            let result = cpu.registers[destReg] - cpu.registers[srcReg];
            cpu.flags.C = result < 0 ? 1 : 0;
            cpu.registers[destReg] = (result < 0 ? result + 256 : result) & 0xFF;
            cpu.flags.Z = cpu.registers[destReg] === 0 ? 1 : 0;

            cpu.PC += 3;
            break;
        }

        default:
            cpu.PC++; // Skip dead unallocated bytes safely
            break;
    }

    updateHardwareDashboard();
}

// --- MACHINE RUN/RESET EVENT HOOKS ---
btnStep.addEventListener('click', executeClockCycleStep);

btnRun.addEventListener('click', () => {
    btnRun.disabled = true;
    btnStep.disabled = true;
    printConsole("Processor running at variable clock speed execution loop...");
    instructionInterval = setInterval(executeClockCycleStep, 400); // 400ms variable step rate
});

function resetHardwareState() {
    clearInterval(instructionInterval);
    cpu.registers = { A: 0, B: 0, C: 0, D: 0 };
    cpu.PC = 0;
    cpu.flags = { Z: 1, C: 0 };
    cpu.halted = false;
    updateHardwareDashboard();
}

document.getElementById('btn-reset').addEventListener('click', () => {
    resetHardwareState();
    cpu.RAM.fill(0);
    updateHardwareDashboard();
    btnStep.disabled = true;
    btnRun.disabled = true;
    printConsole("System architecture clear. Awaiting fresh compilation pass...");
});

// App Initialization entry points
renderInitialHardwareGrid();
updateHardwareDashboard();