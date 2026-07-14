(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const counter = document.getElementById("counter");
  const progressBar = document.getElementById("progressBar");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const fsBtn = document.getElementById("fsBtn");
  const hint = document.getElementById("hint");
  const total = slides.length;
  let index = 0;
  let touchX = 0;
  let activeFlow = null;
  let flowStep = 0;

  function clamp(n) {
    return Math.max(0, Math.min(total - 1, n));
  }

  function openPanelOnSlide() {
    return slides[index]?.querySelector(".panel:not([hidden])") || null;
  }

  function closePanels(root = document) {
    root.querySelectorAll(".panel:not([hidden])").forEach((panel) => {
      panel.hidden = true;
      resetSteps(panel);
    });
    root.querySelectorAll(".wbtn.is-active").forEach((btn) => {
      btn.classList.remove("is-active");
    });
  }

  function resetSteps(root) {
    root.querySelectorAll("[data-step]").forEach((step) => {
      step.classList.add("is-hidden");
    });
  }

  function revealNextStep(root) {
    const next = root.querySelector("[data-step].is-hidden");
    if (next) next.classList.remove("is-hidden");
    return Boolean(next);
  }

  function revealAllSteps(root) {
    root.querySelectorAll("[data-step]").forEach((step) => {
      step.classList.remove("is-hidden");
    });
  }

  function getFlowSteps(flow) {
    return [...flow.querySelectorAll("[data-flow-step]")];
  }

  function syncFlowUI() {
    if (!activeFlow) return;
    const steps = getFlowSteps(activeFlow);
    const current = steps[flowStep];
    const progress = activeFlow.querySelector("[data-flow-progress]");
    const nextControl = activeFlow.querySelector("[data-flow-next]");
    const prevControl = activeFlow.querySelector("[data-flow-prev]");

    steps.forEach((step, i) => {
      const on = i === flowStep;
      step.hidden = !on;
      step.classList.toggle("is-active", on);
    });

    if (progress) progress.textContent = `${flowStep + 1} / ${steps.length}`;
    if (prevControl) prevControl.disabled = flowStep === 0;

    const hasHiddenFlags = Boolean(current?.querySelector("[data-step].is-hidden"));
    if (nextControl) {
      if (hasHiddenFlags) {
        nextControl.textContent = "Reveal next →";
      } else if (flowStep >= steps.length - 1) {
        nextControl.textContent = "Done ✓";
      } else {
        nextControl.textContent = "Next →";
      }
    }
  }

  function startFlow(id) {
    const slide = slides[index];
    const flow = slide?.querySelector(`#${CSS.escape(id)}`);
    if (!flow) return;

    closePanels(slide);
    exitFlow();

    activeFlow = flow;
    flowStep = 0;
    flow.hidden = false;
    resetSteps(flow);
    syncFlowUI();
  }

  function exitFlow() {
    if (!activeFlow) return;
    resetSteps(activeFlow);
    activeFlow.hidden = true;
    activeFlow = null;
    flowStep = 0;
  }

  function flowNext() {
    if (!activeFlow) return;
    const steps = getFlowSteps(activeFlow);
    const current = steps[flowStep];

    if (current?.querySelector("[data-step].is-hidden")) {
      revealNextStep(current);
      syncFlowUI();
      return;
    }

    if (flowStep >= steps.length - 1) {
      exitFlow();
      return;
    }

    flowStep += 1;
    resetSteps(steps[flowStep]);
    syncFlowUI();
  }

  function flowPrev() {
    if (!activeFlow || flowStep === 0) return;
    flowStep -= 1;
    resetSteps(getFlowSteps(activeFlow)[flowStep]);
    syncFlowUI();
  }

  function openPanel(id) {
    const slide = slides[index];
    if (!slide) return;
    const panel = slide.querySelector(`#${CSS.escape(id)}`);
    if (!panel) return;

    exitFlow();
    closePanels(slide);
    panel.hidden = false;
    resetSteps(panel);

    slide.querySelectorAll(`.wbtn[data-panel="${CSS.escape(id)}"]`).forEach((btn) => {
      btn.classList.add("is-active");
    });
  }

  function go(to, { replaceHash = false } = {}) {
    const next = clamp(to);
    if (next === index && slides[next].classList.contains("is-active")) {
      updateChrome();
      return;
    }

    exitFlow();
    closePanels(slides[index]);

    const prev = slides[index];
    const incoming = slides[next];

    prev?.classList.remove("is-active");
    prev?.classList.add("is-exit");
    window.setTimeout(() => prev?.classList.remove("is-exit"), 500);

    incoming.classList.add("is-active");
    index = next;
    updateChrome();

    const hash = `#${index + 1}`;
    if (replaceHash) history.replaceState(null, "", hash);
    else history.pushState(null, "", hash);
  }

  function updateChrome() {
    counter.textContent = `${index + 1} / ${total}`;
    progressBar.style.height = `${((index + 1) / total) * 100}%`;
    progressBar.style.width = "100%";
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
  }

  function fromHash() {
    const n = parseInt(location.hash.replace("#", ""), 10);
    if (!Number.isNaN(n) && n >= 1 && n <= total) return n - 1;
    return 0;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  function syncFullscreenIcon() {
    fsBtn.classList.toggle("is-fullscreen", Boolean(document.fullscreenElement));
    const enter = fsBtn.querySelector(".chrome__icon--enter");
    const exit = fsBtn.querySelector(".chrome__icon--exit");
    if (enter && exit) {
      const on = Boolean(document.fullscreenElement);
      enter.hidden = on;
      exit.hidden = !on;
    }
  }

  document.addEventListener("click", (e) => {
    const start = e.target.closest("[data-flow-start]");
    if (start) {
      e.preventDefault();
      startFlow(start.getAttribute("data-flow-start"));
      return;
    }

    if (e.target.closest("[data-flow-exit]")) {
      e.preventDefault();
      exitFlow();
      return;
    }

    if (e.target.closest("[data-flow-next]")) {
      e.preventDefault();
      flowNext();
      return;
    }

    if (e.target.closest("[data-flow-prev]")) {
      e.preventDefault();
      flowPrev();
      return;
    }

    const openBtn = e.target.closest("[data-panel]");
    if (openBtn) {
      e.preventDefault();
      openPanel(openBtn.getAttribute("data-panel"));
      return;
    }

    if (e.target.closest("[data-close]")) {
      e.preventDefault();
      closePanels(slides[index]);
      return;
    }

    if (e.target.closest("[data-step-next]")) {
      e.preventDefault();
      const panel = openPanelOnSlide();
      if (panel) revealNextStep(panel);
      return;
    }

    if (e.target.closest("[data-step-all]")) {
      e.preventDefault();
      const panel = openPanelOnSlide();
      if (panel) revealAllSteps(panel);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (activeFlow) flowPrev();
    else go(index - 1);
  });
  nextBtn.addEventListener("click", () => {
    if (activeFlow) flowNext();
    else go(index + 1);
  });
  fsBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", syncFullscreenIcon);

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;

    const open = openPanelOnSlide();

    if (e.key === "Escape") {
      if (activeFlow) {
        e.preventDefault();
        exitFlow();
        return;
      }
      if (open) {
        e.preventDefault();
        closePanels(slides[index]);
        return;
      }
    }

    if (activeFlow && (e.key === " " || e.key === "Enter" || e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown")) {
      e.preventDefault();
      flowNext();
      return;
    }

    if (activeFlow && (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Backspace")) {
      e.preventDefault();
      flowPrev();
      return;
    }

    if (open && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      if (open.querySelector("[data-step]")) {
        const hadMore = revealNextStep(open);
        if (!hadMore) closePanels(slides[index]);
      } else {
        closePanels(slides[index]);
      }
      return;
    }

    if (e.target.closest("button, a")) return;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
        e.preventDefault();
        if (open) closePanels(slides[index]);
        else go(index + 1);
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        go(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
      case "Backspace":
        e.preventDefault();
        if (open) closePanels(slides[index]);
        else go(index - 1);
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(total - 1);
        break;
      case "f":
      case "F":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "p":
      case "P":
        document.body.classList.toggle("is-presenting");
        break;
      default:
        break;
    }
  });

  window.addEventListener("popstate", () => {
    exitFlow();
    closePanels();
    index = fromHash();
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    updateChrome();
  });

  document.addEventListener("touchstart", (e) => {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    if (e.target.closest(".workshop, .panel, .flow, .wbtn")) return;
    const dx = e.changedTouches[0].screenX - touchX;
    if (Math.abs(dx) < 50) return;
    if (activeFlow) {
      if (dx < 0) flowNext();
      else flowPrev();
      return;
    }
    if (openPanelOnSlide()) {
      closePanels(slides[index]);
      return;
    }
    if (dx < 0) go(index + 1);
    else go(index - 1);
  }, { passive: true });

  window.setTimeout(() => hint?.classList.add("is-hidden"), 4500);

  document.querySelectorAll(".agenda li").forEach((li, i) => {
    li.style.cursor = "pointer";
    li.addEventListener("click", () => go(i + 3));
  });

  document.querySelectorAll("[data-asset-slot]").forEach((slot) => {
    const img = slot.querySelector("[data-asset]");
    const fallback = slot.querySelector(".asset-fallback");
    if (!img || !fallback) return;

    const showFallback = () => {
      img.hidden = true;
      fallback.hidden = false;
    };

    if (img.complete && img.naturalWidth === 0) showFallback();
    else img.addEventListener("error", showFallback, { once: true });
  });

  index = fromHash();
  slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
  updateChrome();
  history.replaceState(null, "", `#${index + 1}`);
})();
