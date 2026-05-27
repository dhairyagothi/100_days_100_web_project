# Transitions & Animations

CSS can animate changes smoothly. Use:
- **transitions** for simple property changes (hover, focus)
- **animations** for repeated or timeline-based motion

---

## 1. Transitions: animate on change

```css
.btn {
  transition: transform 200ms ease, background-color 200ms ease;
}

.btn:hover {
  transform: translateY(-2px);
  background-color: #10b981;
}
```

---

## 2. Animations: keyframes

You define a sequence of styles with `@keyframes`.

```css
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.dot {
  animation: pulse 1.2s ease-in-out infinite;
}
```

---

## 3. Common animation knobs

- `duration` (time)
- `timing-function` (easing)
- `iteration-count` (`infinite` or a number)
- `delay`
- `fill-mode` (where the end state should apply)

---

## 4. Practical example: animated button feedback

```css
.submit {
  transition: transform 120ms ease;
}

.submit:active {
  transform: scale(0.98);
}
```

---

> [!NOTE]
> Respect `prefers-reduced-motion` when possible. Avoid heavy animation for users who turn motion off.

---

## 5. Coding Exercise: create a spinner animation

### Task:

Write CSS that:
- creates a `.spinner` element that rotates forever
- uses a keyframes rule

##### Solution

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(59, 130, 246, 0.25);
  border-top-color: #3b82f6;
  border-radius: 999px;
  animation: spin 0.9s linear infinite;
}
```

