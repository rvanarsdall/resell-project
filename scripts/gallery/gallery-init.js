(function () {
  const HOST_URL = "https://rvanarsdall.github.io/resell-project";
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

  // if it is local host load the local css
  if (window.location.hostname === "localhost") {
    loadCSS("./styles/gallery-styles.css");
  } else {
    loadCSS(`${HOST_URL}/styles/gallery-styles.css`);
  }
  // if it is not local host load the hosted css

  // Add the gallery container to the page
  const container = document.createElement("div");
  container.className = "gallery-layout";
  document.currentScript.parentNode.insertBefore(
    container,
    document.currentScript
  );

  // Load the scripts in order if it is local host:
  if (window.location.hostname === "localhost") {
    loadScript("./scripts/gallery/getSheetData.js", () => {
      loadScript("./scripts/gallery/script.js");
    });
  }
  // Load the scripts in order if it is not local host:
  else {
    loadScript(`${HOST_URL}/scripts/gallery/getSheetData.js`, () => {
      loadScript(`${HOST_URL}/scripts/gallery/script.js`);
    });
  }
})();
