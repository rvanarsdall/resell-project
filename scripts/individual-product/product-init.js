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
    if (window.location.hostname === "127.0.0.1") {
      loadCSS("./styles/individual-styles.css");
    } else {
      loadCSS(`${HOST_URL}/styles/individual-styles.css`);
    }
    // if it is not local host load the hosted css
  
    // Add the gallery container to the page
    const container = document.createElement("div");
    container.className = "product-layout";
    document.currentScript.parentNode.insertBefore(
      container,
      document.currentScript
    );
  
    // Load the scripts in order if it is local host:
    console.log("window.location.hostname: ", window.location.hostname);
    if (window.location.hostname === "127.0.0.1") {
      loadScript("./scripts/individual-product/getSheetData.js", () => {
        loadScript("./scripts/individual-product/script.js");
      });
    }
    // Load the scripts in order if it is not local host:
    else {
      loadScript(`${HOST_URL}/scripts/individual-product/getSheetData.js`, () => {
        loadScript(`${HOST_URL}/scripts/individual-product/script.js`);
      });
    }
  

    

    
  })();
  