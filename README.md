# Little Haunt: Xolo

A tiny, opt-in browser haunting for Hackyard Yard #5. A hairless xolo appears at the bottom of the current page, rolls a pumpkin, and briefly ghosts the page cursor. The user can dismiss it with the close button or extension popup. Nothing leaves the device and no page data is read or stored.

If the character image cannot load, a CSS-drawn sheet ghost takes the xolo's place. The pumpkin and dismiss controls still work.

## Try it

1. In Chrome or Edge, open the extensions page and turn on Developer mode.
2. Choose **Load unpacked** and select this folder.
3. Open a normal website, click the extension, then **Invite the xolo**.
4. Click the xolo's close button or the extension again to remove it.

Browser internal pages and extension stores do not permit injection. The haunting ends on page navigation. It is scoped to the tab where the user clicked.

## 30-second demo

1. Start on an ordinary browser tab and show it looking normal.
2. Open the extension popup and choose **Invite the xolo**. Let the dog and pumpkin appear at the bottom of the page.
3. Wait for the brief cursor ghost and “boo. gently.” note. The pumpkin keeps rolling while the dog stays.
4. Reopen the popup: it should now say **Send xolo home**. Click it and show the untouched page. The in-page × works too.

Suggested one-line explanation: “A tiny, opt-in browser haunting: one dog, one pumpkin, one harmless cursor trick, and one clear way to send it home.”

## Character art

`assets/xolo-v1.png` is the transparent character currently used by the extension. `assets/xolo.svg` is the original placeholder, kept for reference. To swap in later art, add a new transparent PNG/WebP, then update the path in `haunt.js` and `manifest.json`'s web accessible resource list. The extension renders the dog at 116 × 112 CSS pixels; raster art should be at least 464 × 448 pixels for high-density screens.

The current PNG was AI-generated with the built-in image tool for this project. Final prompt: “Use case: stylized-concept. Asset type: transparent browser-extension game mascot cutout at 116 pixels wide. A single cute tiny hairless xoloitzcuintli dog, full-body, three-quarter pose looking to viewer's right, big upright ears, dark charcoal gray skin with soft mauve inner ears, curious playful expression and distinct paws. Polished 2D storybook game illustration with clean silhouette and strong readability at tiny size. Centered with transparent margin. Genuinely transparent alpha background. No pumpkin or prop, no floor, no shadow plane, no scenery, no text or watermark.”

Art brief: a small, expressive hairless xolo with a clean silhouette that reads against both light and dark pages. Face roughly toward the pumpkin on its right; leave room around the ears and feet rather than cropping them. One still, transparent asset is enough for the first playable version—the breathing and pumpkin roll are code. No text, background, or baked-in pumpkin needed.

## Scope

- Manifest V3, `activeTab` and `scripting` only.
- Only tabs the user explicitly invites; no permanent site access.
- Reduced-motion users get a still xolo and no cursor trick.
- Cursor trick pauses while the tab is hidden or unfocused and lasts 240 ms when it fires.
- No network requests, analytics, local storage, or source-page inspection.
