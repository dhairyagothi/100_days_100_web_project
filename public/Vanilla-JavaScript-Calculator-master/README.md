# Advanced Calculator

A modern web-based calculator featuring both **Basic** and **Scientific** calculation modes, keyboard shortcuts, DEG/RAD support, calculation history, and a responsive user interface.

## Features

### Basic Calculator

* Addition, subtraction, multiplication, and division
* Decimal number support
* Delete (DEL) and All Clear (AC) functions
* Keyboard input support
* Responsive display

### Scientific Calculator

* Trigonometric functions:

  * sin()
  * cos()
  * tan()
* DEG/RAD angle modes
* Natural logarithm (ln)
* Common logarithm (log)
* Square root (√)
* Exponential function (EXP)
* Power operation (x^y)
* Factorial (x!)
* Percentage (%)
* Mathematical constants:

  * π (Pi)
  * e (Euler's Number)
* Parentheses support
* Previous answer (Ans)

### Calculation History

* Stores up to 20 calculations
* Saved automatically using Local Storage
* Click any history item to reuse its result
* Clear all history with one click

### Keyboard Shortcuts

| Key       | Function          |
| --------- | ----------------- |
| 0-9       | Numbers           |
| .         | Decimal           |
| +         | Addition          |
| -         | Subtraction       |
| *         | Multiplication    |
| /         | Division          |
| Enter     | Calculate         |
| Backspace | Delete            |
| Esc       | Clear             |
| (         | Left Parenthesis  |
| )         | Right Parenthesis |
| ^         | Power             |

#### Scientific Functions

| Key | Function       |
| --- | -------------- |
| s   | sin            |
| c   | cos            |
| t   | tan            |
| l   | ln             |
| g   | log            |
| p   | π              |
| r   | √              |
| e   | Euler's Number |
| x   | EXP            |
| %   | Percentage     |
| d   | Degree Mode    |
| a   | Radian Mode    |
| f   | Factorial      |

## Project Structure

```text
project/
│
├── index.html
├── styles.css
├── script.js
├── download (1).png
├── preview.png
├── favicon_clacs.png
├── img/
│   └── download (1).png
│
└── README.md
```

## Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* Local Storage API
* Google Fonts

  * DM Sans
  * DM Mono

## How to Run

1. Download or clone the project.
2. Ensure all files remain in their original structure.
3. Open `index.html` in any modern browser.

No additional installation is required.

## Security Notes

The calculator validates mathematical expressions before evaluation to prevent execution of invalid code. Invalid calculations return an `Error` state rather than crashing the application.

## Supported Operations

### Arithmetic

```text
+
-
*
÷
```

### Scientific

```text
sin(x)
cos(x)
tan(x)
√x
ln(x)
log(x)
x!
x^y
e^x
%
π
e
```

## History Persistence

Calculation history is stored in the browser using Local Storage:

* Automatically saved after each calculation
* Persists across browser refreshes
* Limited to the most recent 20 calculations

## Future Improvements

* Memory functions (M+, M-, MR, MC)
* Inverse trigonometric functions
* Hyperbolic functions
* Theme switcher (Dark/Light mode)
* Scientific notation display
* Expression parser improvements
* Export calculation history

## Author

Advanced Calculator Project

Built using HTML, CSS, and JavaScript.
