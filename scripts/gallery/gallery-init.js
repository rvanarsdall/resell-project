(function () {
  // Dynamically load the required scripts
  const loadScript = (src, callback) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  };

  const loadCSS = (href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  };

  loadCSS("../../styles/gallery-styles.css");


  // Add the gallery container to the page
  const container = document.createElement("div");
  container.className = "gallery-layout";
  document.currentScript.parentNode.insertBefore(
    container,
    document.currentScript
  );

  // Load the scripts in order
  loadScript("./scripts/gallery/getSheetData.js", () => {
    loadScript("./scripts/gallery/script.js", () => {
      console.log("Gallery initialized");
    });
  });
})();
