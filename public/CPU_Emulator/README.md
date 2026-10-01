# Core8 - 8-Bit Virtual Machine CPU Emulator

An educational CPU emulator that simulates an 8-bit virtual machine with assembly language programming capabilities, allowing users to write, compile, and execute low-level assembly code with real-time hardware state visualization.

## Brief Description

Core8 is a comprehensive 8-bit CPU emulator and virtual machine designed for learning computer architecture and low-level programming. Users write assembly code in an integrated editor, compile it to machine instructions, execute it step-by-step or run it to completion, and observe real-time changes in CPU registers, memory, and program execution state. Perfect for computer science education and understanding CPU fundamentals.

## Features

- **Assembly Language Editor:**
  - Syntax highlighting compatible editor
  - Line numbers and code organization
  - Placeholder examples for quick learning
  - Real-time error reporting

- **Compilation & Assembly:**
  - Parses assembly code to machine instructions
  - Supports standard CPU instructions (MOV, ADD, SUB, etc.)
  - Labels and jump targets
  - Comprehensive error messages
  - Binary code generation

- **Execution Modes:**
  - **Step Mode**: Execute one instruction at a time for detailed analysis
  - **Run Mode**: Execute program until completion or halt
  - **Reset**: Clear all state and restart
  - **Breakpoints**: Pause at specific instructions (if implemented)

- **CPU Registers Display:**
  - Register A (Accumulator) - main working register
  - Register B - auxiliary register
  - Register C - auxiliary register
  - Register D - auxiliary register
  - Program Counter (PC) - instruction pointer
  - Status Flags (Z/C) - zero and carry flags
  - Stack Pointer (SP) - stack management

- **Memory Visualization:**
  - RAM contents display
  - Memory address mapping
  - Stack and heap regions
  - Data and instruction segments

- **Instruction Set:**
  - MOV (move data)
  - ADD/SUB (arithmetic)
  - AND/OR/XOR (bitwise operations)
  - CMP (comparison)
  - JMP/JZ/JNZ (jumps)
  - CALL/RET (subroutine support)
  - HALT (stop execution)
  - PUSH/POP (stack operations)

- **Console Output:**
  - Compiler output and errors
  - Execution logs
  - Debug information
  - Performance metrics

## Technologies Used

- **HTML5** - Semantic structure with form elements and canvas
- **CSS3** - Advanced styling with:
  - CSS Grid for panel layout
  - Flexbox for control organization
  - Modern color scheme (dark theme)
  - Register card styling
  - Status indicators
- **JavaScript (ES6+)** - Core emulator implementation
- **Object-Oriented Design** - CPU, Memory, and ALU classes
- **Regular Expressions** - Assembly code parsing
- **Canvas API** - Memory visualization (if applicable)

## Installation / Setup Instructions

1. **Navigate to the project folder:**
   ```bash
   cd public/CPU_Emulator
   ```

2. **Open in a web browser:**
   - Open `index.html` in any modern web browser
   - No build process or external dependencies
   - Works completely offline

3. **Alternative - Local development server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Navigate to: http://localhost:8000/CPU_Emulator
   ```

## Usage Instructions

1. **Launch the Emulator:**
   - Open `index.html` in your browser
   - Interface displays with editor on left, hardware state on right

2. **Write Assembly Code:**

   **Example 1 - Simple Addition:**
   ```assembly
   MOV A, 5       ; Load 5 into Register A
   MOV B, 3       ; Load 3 into Register B
   ADD A, B       ; Add B to A (A = A + B = 8)
   HALT           ; Stop execution
   ```

   **Example 2 - Loop (10 iterations):**
   ```assembly
   MOV C, 10      ; Set counter to 10
   MOV A, 0       ; Initialize accumulator
   LOOP: ADD A, 1 ; Increment A
   SUB C, 1       ; Decrement counter
   JNZ LOOP       ; Jump back if not zero
   HALT           ; Program end
   ```

3. **Compile Your Program:**
   - Click **⚡ Compile** button
   - Compiler parses assembly and generates machine code
   - Check console output for errors or success message

4. **Execute Program:**

   **Step Mode:**
   - Click **🎬 Step** button to execute one instruction
   - Observe register changes
   - Watch Program Counter (PC) increment
   - Repeat for detailed analysis

   **Run Mode:**
   - Click **▶️ Run Machine** button
   - Program executes until HALT
   - Observe final register values
   - Review execution time and instruction count

5. **Monitor Hardware State:**

   **CPU Registers:**
   - Watch register values change during execution
   - Register A (Accumulator) highlighted for active use
   - PC shows current instruction position
   - Status Flags show Z (zero) and C (carry) flags

   **Memory:**
   - RAM display shows data section
   - Stack operations visible
   - Memory address mapping

6. **Debug Your Code:**
   - Use Step mode for line-by-line execution
   - Check register values after each instruction
   - Verify memory contents
   - Use console output for error messages

7. **Reset and Start Over:**
   - Click **🔄 Reset** button
   - Clear all registers and memory
   - Start a new program

## Project Structure

```
CPU_Emulator/
├── index.html          # Main interface with editor and hardware panels
├── app.js              # Application controller and IDE logic
├── style.css           # Styling for modern IDE appearance
└── README.md           # This file
```

## Assembly Language Reference

### Instructions

| Instruction | Format | Description | Example |
|------------|--------|-------------|---------|
| MOV | MOV dest, src | Move data | MOV A, 5 |
| ADD | ADD dest, src | Add and store | ADD A, B |
| SUB | SUB dest, src | Subtract | SUB A, 1 |
| AND | AND dest, src | Bitwise AND | AND A, 0xFF |
| OR | OR dest, src | Bitwise OR | OR A, B |
| XOR | XOR dest, src | Bitwise XOR | XOR A, 0x0F |
| CMP | CMP reg1, reg2 | Compare (sets flags) | CMP A, B |
| JMP | JMP label | Unconditional jump | JMP LOOP |
| JZ | JZ label | Jump if zero | JZ DONE |
| JNZ | JNZ label | Jump if not zero | JNZ LOOP |
| JC | JC label | Jump if carry | JC OVERFLOW |
| CALL | CALL label | Call subroutine | CALL FUNC |
| RET | RET | Return from call | RET |
| PUSH | PUSH reg | Push to stack | PUSH A |
| POP | POP reg | Pop from stack | POP A |
| HALT | HALT | Stop execution | HALT |

### Registers

| Register | Purpose | Size |
|----------|---------|------|
| A | Accumulator (main working) | 8-bit |
| B | General purpose | 8-bit |
| C | General purpose (often loop counter) | 8-bit |
| D | General purpose | 8-bit |
| PC | Program Counter | 16-bit |
| SP | Stack Pointer | 16-bit |

### Status Flags

| Flag | Meaning |
|------|---------|
| Z | Zero flag (set if last result = 0) |
| C | Carry flag (set if arithmetic overflow) |

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Example Programs

### Program 1: Calculate 5 + 3
```assembly
MOV A, 5
MOV B, 3
ADD A, B
HALT
; Result: A = 8
```

### Program 2: Count to 10
```assembly
MOV C, 0
START: ADD C, 1
CMP C, 10
JNZ START
HALT
; Result: C = 10
```

### Program 3: Multiply by repeated addition
```assembly
MOV A, 0        ; A = result
MOV B, 4        ; B = multiplier (4 * 5 = 20)
MOV C, 5        ; C = multiplicand
LOOP: ADD A, C
SUB B, 1
JNZ LOOP
HALT
; Result: A = 20
```

## Learning Resources

### Concepts Covered
- CPU architecture and registers
- Instruction execution cycle
- Memory management and stack
- Jump and branching logic
- Subroutines and function calls
- Flags and conditional logic

### Exercises
1. Write programs for basic arithmetic
2. Implement loops with counters
3. Use subroutines for code reuse
4. Implement conditional branching
5. Debug multi-instruction programs

## Tips for Learning

1. **Start Simple** - Begin with MOV and ADD instructions
2. **Use Step Mode** - Watch each instruction execute
3. **Check Registers** - Verify expected values after each step
4. **Add Comments** - Document what each instruction does
5. **Experiment** - Try different instruction combinations
6. **Debug Systematically** - Check assumptions step-by-step
7. **Review Examples** - Study provided code samples

## Notes

- Educational tool for understanding CPU fundamentals
- Simplified instruction set (not RISC or x86)
- 8-bit architecture for accessibility and learning
- All operations client-side with no external services
- Perfect for computer science courses
- Great for embedded systems and assembly learning
- Helps build mental model of CPU execution
