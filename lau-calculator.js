(function attachLauCalculator(globalScope) {
  "use strict";

  const PRIOR_ODDS = 4;

  function calculateLauOdds(likelihoodRatios) {
    return likelihoodRatios.reduce(
      (odds, likelihoodRatio) => odds * Number(likelihoodRatio),
      PRIOR_ODDS,
    );
  }

  function classifyLauOdds(odds) {
    return odds >= 1 ? "VT" : "SVT with aberrancy";
  }

  function formatOdds(odds) {
    if (odds >= 1000000) return `${odds.toExponential(2)} : 1`;
    if (odds >= 1000) {
      return `${odds.toLocaleString("en-US", { maximumFractionDigits: 1 })} : 1`;
    }
    if (odds >= 10) return `${odds.toFixed(2)} : 1`;
    if (odds >= 1) return `${odds.toFixed(3)} : 1`;
    return `${odds.toFixed(4)} : 1`;
  }

  function initializeCalculator(calculator) {
    const form = calculator.querySelector("[data-lau-form]");
    const result = calculator.querySelector("[data-lau-result]");
    const oddsOutput = calculator.querySelector("[data-lau-odds]");
    const classificationOutput = calculator.querySelector(
      "[data-lau-classification]",
    );
    const breakdown = calculator.querySelector("[data-lau-breakdown]");
    const patternInputs = Array.from(
      form.querySelectorAll('input[name="bundle_pattern"]'),
    );
    const patternPanels = Array.from(
      form.querySelectorAll("[data-pattern-panel]"),
    );
    const rbbbOnlyOptions = Array.from(
      form.querySelectorAll("[data-rbbb-only]"),
    );

    function selectedInput(name) {
      return form.querySelector(`input[name="${name}"]:checked`);
    }

    function updatePatternPanels() {
      const selectedPattern = selectedInput("bundle_pattern")?.value;

      patternPanels.forEach((panel) => {
        const active = panel.dataset.patternPanel === selectedPattern;
        panel.hidden = !active;
        panel.disabled = !active;
      });

      rbbbOnlyOptions.forEach((option) => {
        const input = option.querySelector("input");
        const compatible = selectedPattern !== "lbbb";
        option.hidden = !compatible;
        input.disabled = !compatible;
        if (!compatible) input.checked = false;
      });
    }

    patternInputs.forEach((input) => {
      input.addEventListener("change", updatePatternPanels);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const selectedPattern = selectedInput("bundle_pattern").value;
      const featureNames = [
        "qrs_duration",
        "qrs_axis",
        selectedPattern === "rbbb" ? "rbbb_v1" : "lbbb_v1v2",
        "v6_intrinsicoid",
        "v6_morphology",
      ];
      const selectedFeatures = featureNames.map(selectedInput);
      const odds = calculateLauOdds(
        selectedFeatures.map((input) => input.value),
      );
      const classification = classifyLauOdds(odds);

      oddsOutput.textContent = formatOdds(odds);
      classificationOutput.textContent = classification;
      result.dataset.classification = classification === "VT" ? "vt" : "svt";

      breakdown.replaceChildren();
      const priorItem = document.createElement("li");
      priorItem.innerHTML = "<span>Published pre-test odds</span><b>4</b>";
      breakdown.append(priorItem);

      selectedFeatures.forEach((input) => {
        const item = document.createElement("li");
        const label = document.createElement("span");
        const value = document.createElement("b");
        label.textContent = input.dataset.lauLabel;
        value.textContent = `× ${input.value}`;
        item.append(label, value);
        breakdown.append(item);
      });

      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    form.addEventListener("reset", () => {
      globalScope.setTimeout(() => {
        updatePatternPanels();
        result.hidden = true;
        result.removeAttribute("data-classification");
      }, 0);
    });

    updatePatternPanels();
  }

  globalScope.IsItVTLau = {
    PRIOR_ODDS,
    calculateLauOdds,
    classifyLauOdds,
  };

  if (typeof document !== "undefined") {
    document
      .querySelectorAll("[data-lau-calculator]")
      .forEach(initializeCalculator);
  }
})(globalThis);
