# Hologram Button

An interactive hologram-style button component for futuristic dashboards, games, assistant launchers, and sci-fi themed navigation.

## Objective

The project turns a visual animation demo into a practical UI component. The button now responds to hover and click events, shows live status feedback, supports theme changes, and emits a reusable custom event that developers can connect to real application logic.

## Features

- Click-based activation with loading and active states
- Hover feedback that explains the current interaction state
- Theme controls for cyan, violet, and amber color modes
- Toast notifications for completed actions and theme changes
- Short sound feedback generated with the Web Audio API
- Navigation demo action that shows feedback without leaving the page
- Custom `hologram:activated` event for reusable integrations
- Responsive layout for desktop and mobile screens

## Use Cases

- Futuristic login or sign-in action
- AI assistant activation button
- Sci-fi navigation component
- Gaming UI action trigger
- Loading or confirmation button for dashboards

## Customization

Theme colors live in `style.css` as CSS custom properties:

```css
:root {
  --accent: #34f5ff;
  --accent-strong: #8afcff;
  --accent-soft: rgba(52, 245, 255, 0.18);
}
```

Add a new theme by creating a new `body[data-theme="name"]` block, then add a matching button in `index.html` with `data-theme="name"`.

## Reusing the Component

Listen for the activation event in your app:

```js
document.getElementById('holoButton').addEventListener('hologram:activated', (event) => {
  console.log(event.detail.action);
  console.log(event.detail.theme);
});
```

Change the action name with the `data-action` attribute:

```html
<button class="holo-button" id="holoButton" data-action="open-login">
```

## Files

- `index.html` contains the component markup and demo controls.
- `style.css` contains the hologram visuals, responsive layout, and themes.
- `main.js` loads the Spline scene and handles interaction behavior.
- `circle.png` is the animated background texture.

## Notes

The Spline scene is loaded from `https://prod.spline.design`, so the 3D background requires an internet connection. The button UI, themes, and interaction states still render without the 3D scene.
