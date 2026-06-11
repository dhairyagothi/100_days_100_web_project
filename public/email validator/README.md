# Email Validator

Email Validator is a browser-based validation tool that checks email format, flags common typos, highlights disposable domains, and gives clear feedback about the address you entered.

## Features

- Client-side email format validation
- Common domain typo detection
- Disposable domain warnings
- Local/domain breakdown badges
- Helpful suggestion banner for likely corrections

## How to Use

1. Enter an email address.
2. Click **Validate Email**.
3. Review the format warnings or validity status.
4. Apply the suggested correction if the domain looks wrong.

## Files

- `index.html` - Validation UI
- `style.css` - Visual styling
- `script.js` - Validation logic and typo detection

## Notes

- The checker uses a built-in list of known domains.
- Validation happens in the browser without a backend call.
