(function teachingTools() {
  "use strict";
  if (typeof document === "undefined") return;

  function initialize() {
    document.querySelectorAll("[data-activation-explorer]").forEach(explorer => {
      if (explorer.dataset.initialized) return;
      explorer.dataset.initialized = "true";
      const controls = explorer.querySelector(".enhanced-controls");
      const select = explorer.querySelector("[data-activation-model]");
      const slider = explorer.querySelector("[data-activation-time]");
      const output = explorer.querySelector("[data-activation-time-label]");
      const panels = Array.from(explorer.querySelectorAll("[data-activation-panel]"));
      function update() {
        const active = panels.find(p => p.dataset.activationPanel === select.value);
        if (!active) return;
        slider.max = active.dataset.duration;
        const time = Math.min(Number(slider.value), Number(slider.max));
        slider.value = String(time);
        output.textContent = `${time} ms`;
        slider.setAttribute("aria-valuetext", `${time} milliseconds after QRS onset`);
        panels.forEach(panel => { panel.hidden = panel !== active; });
        active.querySelectorAll("[data-activate-at]").forEach(region => {
          region.dataset.activated = String(Number(region.dataset.activateAt) <= time);
        });
        active.querySelectorAll("[data-activation-stage]").forEach(stage => {
          stage.hidden = Number(stage.dataset.activationStage) !== (time < 20 ? 0 : time <= 40 ? 1 : 2);
        });
        active.querySelector("[data-activation-cursor]")?.setAttribute("d", `M${20 + (260 + time) * .4} 35V265`);
      }
      select.addEventListener("change", update);
      slider.addEventListener("input", update);
      controls.hidden = false;
      update();
    });

    // Native modal handles focus containment and Escape; all content remains available without JS.
    let dialog = document.querySelector("#diagram-viewer");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "diagram-viewer";
      dialog.className = "diagram-viewer";
      dialog.setAttribute("aria-label", "Enlarged EKG diagram");
      const close = document.createElement("button");
      close.type = "button";
      close.textContent = "Close diagram";
      close.className = "diagram-viewer-close";
      const body = document.createElement("div");
      body.className = "diagram-viewer-body";
      dialog.append(close, body);
      document.body.append(dialog);
      close.addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    }
    document.querySelectorAll("[data-enlarge-diagram]").forEach(button => {
      if (button.dataset.initialized) return;
      button.dataset.initialized = "true";
      const frame = button.closest("[data-diagram-frame]");
      const svg = frame.querySelector("[data-ekg-svg]");
      if (!svg || typeof dialog.showModal !== "function") return;
      button.hidden = false;
      button.addEventListener("click", () => {
        const clone = svg.cloneNode(true);
        const replacements = new Map();
        clone.querySelectorAll("[id]").forEach(node => {
          const id = node.id;
          replacements.set(id, `${id}-enlarged`);
          node.id = `${id}-enlarged`;
        });
        clone.querySelectorAll("*").forEach(node => {
          Array.from(node.attributes).forEach(attribute => {
            let value = attribute.value;
            replacements.forEach((next, previous) => { value = value.replaceAll(`url(#${previous})`, `url(#${next})`); });
            if (value !== attribute.value) node.setAttribute(attribute.name, value);
          });
        });
        const caption = document.createElement("p");
        caption.textContent = frame.querySelector("figcaption")?.textContent ?? "Original schematic";
        dialog.querySelector(".diagram-viewer-body").replaceChildren(clone, caption);
        dialog.showModal();
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
