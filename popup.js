const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

function setInvited(invited) {
  toggle.textContent = invited ? "Send xolo home" : "Invite the xolo";
  toggle.setAttribute("aria-pressed", String(invited));
}

async function activeWebTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id && /^https?:/.test(tab.url || "") ? tab : null;
}

async function refresh() {
  toggle.disabled = true;
  try {
    const tab = await activeWebTab();
    if (!tab) {
      status.textContent = "Open a regular website first, then invite the xolo.";
      return;
    }
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => Boolean(window.__littleHauntXolo)
    });
    setInvited(Boolean(results[0]?.result));
  } catch {
    status.textContent = "This page cannot be haunted. Try a normal website tab.";
  } finally {
    toggle.disabled = false;
  }
}

toggle.addEventListener("click", async () => {
  toggle.disabled = true;
  try {
    const tab = await activeWebTab();
    if (!tab) {
      status.textContent = "Open a regular website first, then invite the xolo.";
      return;
    }
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["haunt.js"]
    });
    const invited = results[0]?.result !== "dismissed";
    status.textContent = !invited
      ? "Xolo went home. Your page is back to normal."
      : "Xolo is haunting this tab. Click again to send them home.";
    setInvited(invited);
  } catch {
    status.textContent = "This page cannot be haunted. Try a normal website tab.";
  } finally {
    toggle.disabled = false;
  }
});

refresh();
