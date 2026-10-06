# Trusted Types Security Guide

## Overview

This repository contains a large collection of web projects that dynamically update the DOM. While dynamic HTML rendering is sometimes necessary, directly assigning untrusted content to APIs such as `innerHTML` can introduce DOM-based Cross-Site Scripting (XSS) vulnerabilities.

Trusted Types is a browser security mechanism that helps prevent these vulnerabilities by restricting unsafe HTML injection.

---

## Why Trusted Types?

Trusted Types provides an additional layer of security by ensuring that dangerous DOM APIs only accept trusted, sanitized HTML objects instead of arbitrary strings.

Benefits include:

* Prevents DOM-based XSS attacks.
* Encourages secure DOM manipulation practices.
* Improves compatibility with strict Content Security Policies (CSP).
* Makes security reviews easier.
* Promotes safer handling of dynamic HTML.

---

## Unsafe DOM APIs

Avoid using the following APIs with untrusted data:

```javascript
element.innerHTML = userInput;
element.outerHTML = html;
element.insertAdjacentHTML("beforeend", html);
document.write(html);
```

These APIs can execute injected HTML or JavaScript if the content is not properly sanitized.

---

## Recommended Alternatives

When displaying plain text:

```javascript
element.textContent = userInput;
```

When creating elements dynamically:

```javascript
const div = document.createElement("div");
div.textContent = userInput;
container.appendChild(div);
```

When HTML rendering is required, sanitize the content before inserting it into the DOM.

---

## Trusted Types Policy

A reusable Trusted Types policy can be created using a sanitizer such as DOMPurify.

Example:

```javascript
const policy = window.trustedTypes?.createPolicy("app-policy", {
  createHTML: (input) => DOMPurify.sanitize(input),
});

element.innerHTML = policy
  ? policy.createHTML(html)
  : DOMPurify.sanitize(html);
```

---

## Content Security Policy

Trusted Types can be enforced through the Content Security Policy:

```text
Content-Security-Policy:
require-trusted-types-for 'script';
trusted-types app-policy;
```

Browsers without Trusted Types support will safely ignore these directives.

---

## Best Practices

* Prefer `textContent` whenever HTML rendering is unnecessary.
* Avoid assigning user-controlled data directly to `innerHTML`.
* Sanitize all HTML originating from external sources.
* Reuse a single Trusted Types policy throughout the application.
* Review new code for unsafe DOM manipulation before merging.

---

## Browser Support

Trusted Types is currently supported by Chromium-based browsers. Other browsers safely ignore the policy while continuing to execute sanitized code.

---

## References

* Trusted Types API
* Content Security Policy Level 3
* DOMPurify Documentation
* OWASP Cross Site Scripting Prevention Cheat Sheet
