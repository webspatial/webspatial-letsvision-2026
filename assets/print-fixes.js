(() => {
  const BREAK_CLASS = "print-page-break";

  function removePrintBreaks() {
    for (const marker of document.querySelectorAll(`.${BREAK_CLASS}`)) {
      marker.remove();
    }
  }

  function insertPrintBreaks() {
    removePrintBreaks();

    const slides = document.querySelectorAll("section.slide");
    slides.forEach((slide, index) => {
      if (index === 0) {
        return;
      }

      const marker = document.createElement("div");
      marker.className = BREAK_CLASS;
      marker.setAttribute("aria-hidden", "true");
      slide.before(marker);
    });
  }

  window.addEventListener("beforeprint", insertPrintBreaks);
  window.addEventListener("afterprint", removePrintBreaks);

  const printMedia = window.matchMedia?.("print");
  if (printMedia?.addEventListener) {
    printMedia.addEventListener("change", (event) => {
      if (event.matches) {
        insertPrintBreaks();
      } else {
        removePrintBreaks();
      }
    });
  } else if (printMedia?.addListener) {
    printMedia.addListener((event) => {
      if (event.matches) {
        insertPrintBreaks();
      } else {
        removePrintBreaks();
      }
    });
  }
})();
