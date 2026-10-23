(() => {
  const key = "__littleHauntXolo";
  if (window[key]) {
    window[key].destroy();
    return "dismissed";
  }

  const root = document.createElement("div");
  root.id = "little-haunt-xolo-root";
  root.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none";
  const shadow = root.attachShadow({ mode: "closed" });
  const art = chrome.runtime.getURL("assets/xolo-v1.png");
  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    .stage { position: fixed; right: 22px; bottom: 12px; width: 210px; height: 128px; pointer-events: none; }
    .stage::before { content: ''; position: absolute; right: 33px; bottom: 8px; width: 145px; height: 105px; border-radius: 50%; background: radial-gradient(ellipse, #ffe0ab44, transparent 72%); }
    .ground { position: absolute; left: 18px; right: 6px; bottom: 5px; height: 13px; border-radius: 50%; background: #17112355; filter: blur(6px); }
    .xolo { position: absolute; right: 46px; bottom: 7px; width: 116px; height: 112px; object-fit: contain; transform-origin: 50% 90%; animation: breathe 2.8s ease-in-out infinite; filter: drop-shadow(0 4px 3px #21121b88); }
    .sheet { display: none; position: absolute; right: 58px; bottom: 11px; width: 88px; height: 92px; background: linear-gradient(135deg, #fffefa, #dcd2e9); border-radius: 45% 45% 6px 6px; clip-path: polygon(0 0, 100% 0, 100% 89%, 83% 100%, 66% 89%, 50% 100%, 33% 89%, 16% 100%, 0 89%); box-shadow: inset -12px -6px 0 #a9a0bd55; filter: drop-shadow(0 4px 4px #1f122666); animation: breathe 2.8s ease-in-out infinite; }
    .sheet::before, .sheet::after { content: ''; position: absolute; top: 37px; width: 10px; height: 16px; border-radius: 50%; background: #38283f; }
    .sheet::before { left: 29px; }
    .sheet::after { right: 29px; }
    .ghost-mode .xolo { display: none; }
    .ghost-mode .sheet { display: block; }
    .pumpkin { position: absolute; right: 16px; bottom: 10px; width: 44px; height: 38px; border: 2px solid #924b2f; border-radius: 45%; background: repeating-linear-gradient(90deg, #c86937 0 8px, #e38842 8px 16px); box-shadow: inset -6px -3px 0 #a94c2d88, 0 4px 5px #1b102555; animation: roll 5s ease-in-out infinite; }
    .pumpkin::before { content: ''; position: absolute; width: 9px; height: 12px; top: -12px; left: 17px; border-radius: 3px; background: #547847; transform: rotate(18deg); }
    .note { position: absolute; right: 9px; bottom: 75px; padding: 6px 10px; border-radius: 12px 12px 3px 12px; color: #452a3f; background: #fff7e8; font: 13px Georgia, serif; box-shadow: 0 3px 9px #1b102544; opacity: 0; transform: translateY(4px); transition: opacity .3s, transform .3s; }
    .note.show { opacity: 1; transform: translateY(0); }
    .dismiss { pointer-events: auto; position: absolute; right: 0; bottom: 94px; width: 28px; height: 28px; border: 1px solid #735064; border-radius: 50%; color: #fff7ef; background: #35243ae8; font: 19px Arial, sans-serif; cursor: pointer; }
    .dismiss:focus-visible { outline: 3px solid #ffc878; }
    .ghost-cursor { position: fixed; width: 19px; height: 27px; border: 2px solid #f9aaca; border-radius: 70% 0 70% 0; transform: rotate(-27deg); opacity: 0; pointer-events: none; filter: drop-shadow(2px 2px 1px #382136); }
    .ghost-cursor.show { opacity: .8; animation: ghost .24s steps(2) 1; }
    @keyframes breathe { 50% { transform: translateY(-3px) rotate(1deg); } }
    @keyframes roll { 0%, 12%, 100% { transform: translateX(0) rotate(0); } 45% { transform: translateX(-66px) rotate(-220deg); } 76% { transform: translateX(0) rotate(-360deg); } }
    @keyframes ghost { 0%, 70% { opacity: 0; } 35%, 100% { opacity: .8; } }
    @media (prefers-reduced-motion: reduce) { .xolo, .sheet, .pumpkin, .ghost-cursor { animation: none !important; } }
  `;
  shadow.append(style);

  const stage = document.createElement("div");
  stage.className = "stage";
  stage.setAttribute("aria-label", "A tiny xolo rolls a pumpkin at the bottom of the page");
  stage.innerHTML = `<div class="ground"></div><img class="xolo" alt="" src="${art}"><div class="sheet" aria-hidden="true"></div><div class="pumpkin"></div><span class="note" aria-live="polite">boo. gently.</span><button class="dismiss" type="button" aria-label="Send xolo home">×</button><span class="ghost-cursor"></span>`;
  stage.querySelector(".xolo").addEventListener("error", () => stage.classList.add("ghost-mode"));
  shadow.append(stage);
  document.documentElement.append(root);

  const note = stage.querySelector(".note");
  const ghost = stage.querySelector(".ghost-cursor");
  const cursorStyle = document.createElement("style");
  cursorStyle.textContent = "html, html * { cursor: none !important; }";
  let ghostTimer;
  let noteTimer;
  let lastTrick = 0;
  let pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  function onMove(event) { pointer = { x: event.clientX, y: event.clientY }; }
  function trick() {
    if (reducedMotion.matches || document.hidden || !document.hasFocus() || Date.now() - lastTrick < 18000 || !root.isConnected) return;
    lastTrick = Date.now();
    ghost.style.left = `${pointer.x + 12}px`;
    ghost.style.top = `${pointer.y + 5}px`;
    document.documentElement.append(cursorStyle);
    ghost.classList.add("show");
    note.classList.add("show");
    clearTimeout(ghostTimer);
    clearTimeout(noteTimer);
    ghostTimer = setTimeout(() => { cursorStyle.remove(); ghost.classList.remove("show"); }, 240);
    noteTimer = setTimeout(() => note.classList.remove("show"), 1700);
  }
  document.addEventListener("pointermove", onMove, { passive: true });
  const firstTrick = setTimeout(trick, 2500);
  const repeatTrick = setInterval(trick, 25000);
  function destroy() {
    clearTimeout(firstTrick);
    clearInterval(repeatTrick);
    clearTimeout(ghostTimer);
    clearTimeout(noteTimer);
    cursorStyle.remove();
    document.removeEventListener("pointermove", onMove);
    root.remove();
    delete window[key];
  }
  stage.querySelector(".dismiss").addEventListener("click", destroy);
  window[key] = { destroy };
  return "invited";
})();
