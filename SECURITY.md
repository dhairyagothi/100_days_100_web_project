# Security Policy

## Supported Versions

Only the current version (`v2.x` - Next.js rewrite) is actively supported with security updates. 

| Version | Supported          | Stack |
| ------- | ------------------ | ----- |
| 2.x.x   | :white_check_mark: | Next.js 15, React 19, Tailwind v4 |
| 1.x.x   | :x:                | Vanilla HTML/JS |

## Reporting a Vulnerability

If you discover a security vulnerability within this repository, please do **not** open a public issue. Instead, please follow these steps:

1. Email the repository maintainers privately (check the maintainer profile for the contact email).
2. Include a detailed description of the vulnerability and the steps required to reproduce it.
3. We will review the report within 48 hours and coordinate with you on a patch.

## Next.js Security Best Practices

As a Next.js application, we adhere to the following:
- **Environment Variables**: No sensitive API keys are exposed to the browser unless prefixed with `NEXT_PUBLIC_`.
- **Dependency Management**: We run `npm audit` regularly to detect vulnerabilities in our dependencies.
- **XSS Prevention**: React automatically escapes values embedded in JSX, mitigating cross-site scripting (XSS) attacks.

Thank you for helping keep the open source community safe!
