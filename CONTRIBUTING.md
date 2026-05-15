# Contributing Guidelines

Thank you for your interest in contributing to **100 Days 100 Web Projects**! This project is participating in the GirlScript Summer of Code (GSSoC), and we value the contributions of open source developers of all skill levels.

## 🌟 The V2 Next.js Architecture

The project has been entirely rewritten from a Vanilla monolithic website into a modular **Next.js 15 (App Router)** architecture utilizing **TypeScript** and **Tailwind CSS v4**.

Before contributing, please familiarize yourself with the [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🛠️ How to Contribute

### 1. Setup Your Environment

Fork the repository and clone your fork locally:

```bash
git clone https://github.com/<your-username>/100_days_100_web_project.git
cd 100_days_100_web_project
npm install
npm run dev
```

### 2. The "Taste Standard" Design System

If you are contributing UI changes, you MUST adhere to the **Taste Standard**:
- **Fonts**: Use the provided `Geist` and `Geist Mono` fonts.
- **Colors**: Rely on the pre-configured `globals.css` CSS variables (e.g., `bg-background`, `text-muted-foreground`). Avoid arbitrary hex codes.
- **Borders**: Do NOT use stark solid borders. Use tonal transitions, e.g., `bg-muted/50`.
- **Components**: Utilize the `shadcn/ui` components found in `src/components/ui/` instead of building from scratch.

### 3. Adding a New Project Entry

To add a new project to the list:
1. Open `src/data/projects.ts`.
2. Add your new object to the end of the `projects` array, following the `Project` interface.
3. Ensure the project is hosted and provide a valid URL.

### 4. Submitting a Pull Request

We follow Conventional Commits. Your PR title should look like:
- `feat: added interactive background component`
- `fix: resolved timeline spacing issue`
- `docs: updated readme instructions`

1. Create a new branch: `git checkout -b feat/your-feature-name`
2. Commit your changes: `git commit -m "feat: your feature description"`
3. Push to your fork: `git push origin feat/your-feature-name`
4. Open a Pull Request on the main repository.

## 🐛 Reporting Bugs

If you find a bug, please create an Issue and include:
- A clear, descriptive title.
- Steps to reproduce the bug.
- The expected vs. actual behavior.
- Screenshots if applicable.

Thank you for contributing!
