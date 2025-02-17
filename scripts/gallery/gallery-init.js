(function () {
  const HOST_URL = "https://rvanarsdall.github.io/resell-project";
  // Dynamically load the required scripts

  // Helper function to get data attributes from the script tag
  const getScriptDataAttributes = () => {
    const scriptTag = document.currentScript;
    console.log("scriptTag: ", scriptTag.dataset);
    return {
      itemsPerPage: parseInt(scriptTag.dataset.itemsPerPage, 10) || 9, // Default to 9 items per page
      showNavigationButtons:
        scriptTag.dataset.itemShowPageButtons === "true" || false, // Default to false
      showSearchBar: scriptTag.dataset.itemShowSearch === "true" || false, // Default to false
      isSitemapPage: scriptTag.dataset.itemSitemapOnly === "true" || false, // Default to false
    };
  };

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
  if (window.location.hostname === "127.0.0.1") {
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
  console.log("window.location.hostname: ", window.location.hostname);
  if (window.location.hostname === "127.0.0.1") {
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

  // Get configuration from data attributes
  const config = getScriptDataAttributes();
  console.log("Gallery configuration:", config);

  // Make parameters globally accessible if needed
  window.galleryConfig = config;
})();
