# Unit Converter

A small, dependency-free unit converter for the browser. Pick a category, type
a number, get an instant result — no submit button, no page reload.

Supports four categories out of the box:

- **Weight** — kilograms, pounds, grams, ounces, stone
- **Length** — metres, feet, centimetres, inches, miles, kilometres
- **Temperature** — Celsius, Fahrenheit, Kelvin
- **Volume** — litres, US gallons, millilitres, US cups, US fluid ounces

## Features

- **Live conversion** — updates on every keystroke, no submit required
- **Four categories in one tool** — switch with the tab bar instead of
  reloading a different page per conversion type
- **Swap button** — flips the "from" and "to" units and carries the current
  result into the input, so you can keep converting in the other direction
- **Inline, persistent error state** — invalid input shows a message next to
  the field instead of flashing for a couple of seconds and resetting what
  you typed
- **Keyboard and screen-reader friendly** — visible focus rings, labelled
  inputs/selects, and `aria-live` on the result so updates are announced
- **No build step, no dependencies** — just HTML, CSS and vanilla JS

## Project structure

```bash
unit-converter/
├── index.html        Markup and structure
├── css/
│   └── style.css     Styling (dark "instrument panel" theme)
├── js/
│   └── app.js         Conversion logic and interactivity
└── README.md
```

## Running it

No build tools needed. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with any static server, e.g.:

  ```bash
  npx serve .
  # or
  python3 -m http.server
  ```

## How the conversion math works

Every category except temperature converts through a shared **base unit**
(`kg` for weight, `m` for length, `l` for volume):

```bash
value_in_base = value * toBase[fromUnit]
result        = value_in_base / toBase[toUnit]
```

This means adding a new unit to weight, length, or volume is a single line in
the `toBase` table in `js/app.js` — every other unit in that category will be
able to convert to and from it automatically.

**Temperature is the exception.** Celsius, Fahrenheit and Kelvin aren't
related by a simple multiplier (Fahrenheit has a +32 offset), so temperature
routes through two small helper functions, `toCelsius()` and `fromCelsius()`,
instead of a `toBase` table.

## Extending it

To add a new category (e.g. Speed):

1. Add an entry to the `categories` object in `js/app.js` with a `label`,
   `icon`, `base` unit, `units` (key → display name), and a `toBase` table.
2. Add a matching icon to the `icons` object (or reuse an existing one).

To add a new unit to an existing category, add one line to that category's
`units` and `toBase` objects — no other code changes required.

## Browser support

Uses standard ES6+ JavaScript (template literals, arrow functions, `const`/
`let`) and CSS custom properties. Works in all current evergreen browsers
(Chrome, Firefox, Safari, Edge)
