console.log("It works");

// ** Global Variables **
let searchQuery = "";
let data = [];
let filteredData = [];
let searchTimeout;
let filterCategories = [
  "Electronic",
  "Furniture",
  "Books",
  "Decor",
  "Collectables",
  "Kid Toys",
  "Clothing (Male)",
  "Clothing (Female)",
];

// ** Page Configuration **

const PRODUCT_URL = "https://www.resellwithmichelle.org/en/product";
const IMAGE1_NOT_FOUND =
  "https://api.opnform.com/open/forms/11888/submissions/file/3_a838a25f-554f-4f2b-9c5e-452b3c0e5df5.png?signature=8f6c82ca05cf2fef1aa43fb284855b7b1a36caf7f88ac237d9e1fa4e86c477df";

const IMAGE2_NOT_FOUND =
  "https://api.opnform.com/open/forms/11888/submissions/file/2_d7d9b90c-97ad-4077-b205-759f0d3f9522.png?signature=a0a2af9c79c42defa7f09ba5fa8887f375ade70995e88988c38d825ddd50ac41";
let currentPage = 1;
const itemsPerPage = window.galleryConfig.itemsPerPage || 9; // Change this value to adjust items per page
const showNavigationButtons =
  window.galleryConfig.showNavigationButtons || false;
const showSearchBar = window.galleryConfig.showSearchBar || false;

// ** DOM Elements **
const galleryLayout = document.querySelector(".gallery-layout");

// ** Page Dynamic HTML **
const galleryInsertWithNavigation = /*html*/ ` 
  
  <div class="pagination">
    <button class="gallery-btn" id="prevPage">Previous</button>
    <div style="display: flex; flex-direction: column">
      <span id="pageInfo"></span>
      <select id="pageSelect"></select>
    </div>
    <button class="gallery-btn" id="nextPage">Next</button>
`;

const galleryInsertWithSearchBar = /*html*/ `
  <div class="search-bar">
    <!-- Books, Decor, Collectables, Kid Toys -->
    
      ${filterCategories
        .map(
          (category) => /*html*/ `
        <div class="filter-item" onclick="toggleFilter(this)">${category}</div>
      `
        )
        .join("")}
    <input type="text" id="searchInput" placeholder="Search" />
  </div>
`;

const galleryInsert = /*html*/ `
  <div class="container">
    ${showSearchBar ? galleryInsertWithSearchBar : ""}
    <div class="gallery"></div>
    ${showNavigationButtons ? galleryInsertWithNavigation : ""}
  </div>
`;

let productInformation = /*html*/ `<div class="col-4">
 <a href="{{LINK}}"> 
  <img src="{{PHOTO_URL}}" alt="" />
</a>
  <div class="title-price flex">
    <h3 class="title">{{TITLE}}</h3>
    <p class="price">{{PRICE}}</p>
  </div>
  <div class="quick-description">{{DESCRIPTION}}</div>

  <div class="border-top border-bottom align-self-end">
    <div class="deliver-method flex">
      <div id="method">{{DELIVERY_METHOD}}</div>
      <div id="status">{{CURRENT_STATUS}}</div>
    </div>
  </div>

  <div class="learn-more">
    <a href="{{LINK}}" class="learn-more-link learn-more"
      >Learn More <span class="chevron"> > </span></a
    >
  </div>
</div>`;

galleryLayout.innerHTML = galleryInsert;

// ** Page Logic **
function buildAndLoad() {
  const formName = "Website";
  console.log("DOM fully loaded and parsed");
  const sheetDataHandler = (sheetData) => {
    //ADD YOUR CODE TO WORK WITH sheetData ARRAY OF OBJECTS HERE
    if (!sheetData) return console.log("No data found");

    data = cleanSheetData(sheetData);

    filteredData = data;

    items = buildGalleryList(filteredData);
    renderGallery(items);
  };
  getSheetData({
    // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
    sheetID: "1CZVsEbmZ3FaIMWkmp5H_RI7ynuN61FoGp9fSdiYyypo",
    // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
    sheetName: formName,
    query: "SELECT *",
    callback: sheetDataHandler,
  });
}

buildAndLoad();

let items = [];

function cleanSheetData(sheetData) {
  let cleanData = sheetData
    .filter((item) => item["Item Name"] !== "")
    .map((item, index) => {
      if (item["Photo"] === "") {
        item["Photo"] =
          index % 2 === 0 ? [IMAGE1_NOT_FOUND] : [IMAGE2_NOT_FOUND];
      } else {
        item["Photo"] = item["Photo"].split(",");
      }

      return {
        title: item["Item Name"],
        description:
          item["Item Description"] !== "N/A" ? item["Item Description"] : "",
        photo: item["Photo"],
        price: formatNumberToCurrency(item["Price"]),
        deliveryMethod: item["Purchase Type"],
        currentStatus: item["Status"],
        link: `${PRODUCT_URL}?id=${item["SKU"]}`,
        category: item["Category"],
      };
    })
    .reverse();
  return cleanData;
}

function replaceProductInformation(
  currentProductInformation,
  replacementName,
  replacementData
) {
  return currentProductInformation.replaceAll(
    `{{${replacementName}}}`,
    replacementData
  );
}

let MARKET_PLACE_TITLE = "Market Place Title";

function buildGalleryList(data) {
  let productTitle = "title";
  let productDescription = "description";
  let productPhoto = "photo";
  let productDeliveryMethod = "deliveryMethod";
  let productCurrentStatus = "currentStatus";
  let gallery = document.querySelector(".gallery");
  let productInformationHTML = "";
  let inventoryHTMLList = [];

  let inventory = data;

  inventory.forEach((product, index) => {
    let currentInventoryHTML = productInformation;
    currentInventoryHTML = replaceProductInformation(
      currentInventoryHTML,
      "TITLE",
      product[productTitle]
    );
    currentInventoryHTML = replaceProductInformation(
      currentInventoryHTML,
      "DESCRIPTION",
      product[productDescription]
    );

    currentInventoryHTML = replaceProductInformation(
      currentInventoryHTML,
      "PRICE",
      product["price"]
    );

    currentInventoryHTML = replaceProductInformation(
      currentInventoryHTML,
      "PHOTO_URL",
      product[productPhoto][0]
    );

    currentInventoryHTML = replaceProductInformation(
      currentInventoryHTML,
      "DELIVERY_METHOD",
      translateDeliveryMethod(product[productDeliveryMethod])
    );

    currentInventoryHTML = replaceProductInformation(
      currentInventoryHTML,
      "CURRENT_STATUS",
      product[productCurrentStatus]
    );

    currentInventoryHTML = replaceProductInformation(
      currentInventoryHTML,
      "LINK",
      product["link"]
    );

    inventoryHTMLList.push(currentInventoryHTML);
  });

  return inventoryHTMLList;
}

function renderGallery(items) {
  const gallery = document.querySelector(".gallery");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = items.slice(start, end);
  const combinedHTML = paginatedItems.join("");

  gallery.innerHTML = combinedHTML;
  if (showNavigationButtons) {
    updatePageControls(items);
  }

  if (showSearchBar) {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase();
        currentPage = 1;
        filterAndLoad();
      }, 300); // Delay of 300ms
    });
  }
}

function toggleFilter(element) {
  // Clear other toggled filters
  if(element.classList.contains("active")){
    debugger
    element.classList.remove("active");
    filterAndLoad();
    return;
  }
  const filterItems = document.querySelectorAll(".filter-item");
  filterItems.forEach((item) => {
    if (item !== element) {
      item.classList.remove("active");
    }
  });

  element.classList.toggle("active");
  const category = element.textContent;
  debugger
  filterByCategory(category);
}

function filterByCategory(category) {
  const filteredData = data.filter((item) => item.category.includes(category));
  currentPage = 1;
  renderGallery(buildGalleryList(filteredData));
}

function filterAndLoad() {
  const filteredData = searchQuery
    ? data.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery)
      )
    : data;
  currentPage = 1;
  let items = buildGalleryList(filteredData);
  renderGallery(items);
}

function updatePageControls(items) {
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const pageInfo = document.getElementById("pageInfo");
  const pageSelect = document.getElementById("pageSelect");

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;

  // Populate the dropdown
  pageSelect.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Page ${i}`;
    if (i === currentPage) {
      option.selected = true;
    }
    pageSelect.appendChild(option);
  }
}

// Event Listeners
if (showNavigationButtons) {
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderGallery(items);
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderGallery(items);
    }
  });

  document.getElementById("pageSelect").addEventListener("change", (e) => {
    currentPage = parseInt(e.target.value, 10);
    renderGallery(items);
  });
}
// --==== QUERY EXAMPLES ====--
// --==== USE LETTERS FOR COLUMN NAMES ====--
//  'SELECT A,C,D WHERE D > 150'
//  'SELECT * WHERE B = "Potato"'
//  'SELECT * WHERE A contains "Jo"'
//  'SELECT * WHERE C = "active" AND B contains "Jo"'
//  "SELECT * WHERE E > date '2022-07-9' ORDER BY E DESC"

// });

function formatNumberToCurrency(number) {
  // Convert String to Number and if it is a Nan return "N/A"
  number = parseFloat(number);
  if (isNaN(number)) {
    return "N/A";
  }

  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function translateDeliveryMethod(deliveryMethod) {
  deliveryMethod = deliveryMethod.split(",");
  if (deliveryMethod.length === 1) {
    return deliveryMethod[0] + " Only";
  } else {
    return deliveryMethod[0] + " or " + deliveryMethod[1];
  }
}

//**CSS Work */
const filterItems = document.querySelectorAll(".filter-item");
const searchBar = document.querySelector(".search-bar");

searchInput.addEventListener("focus", () => {
  searchBar.classList.add("focused");
  // Check window size because if it is too small the filter items will be hidden
  if (window.innerWidth < 768) {
    return;
  }
  filterItems.forEach((item) => {
    item.classList.add("hidden");

    // Optionally ensure display none after the transition
    setTimeout(() => {
      item.style.display = "none";
    }, 500); // Matches CSS transition time
  });
});

searchInput.addEventListener("blur", () => {
  searchBar.classList.remove("focused");
  // Check window size because if it is too small the filter items will be hidden
  if (window.innerWidth < 768) {
    return;
  }

  filterItems.forEach((item) => {
    item.style.display = "block";

    // Small delay before fade-in so display:block applies first
    setTimeout(() => {
      item.classList.remove("hidden");
    }, 10);
  });
});

// Window size gets smaller than 768px hide the filter items but if it gets bigger than 768px show the filter items

function handleResize() {
  if (window.innerWidth < 768) {
    filterItems.forEach((item) => {
      item.style.display = "none";
    });
  } else {
    filterItems.forEach((item) => {
      item.style.display = "block";
    });
  }
}

if (window.innerWidth < 768) {
  handleResize();
}

window.addEventListener("resize", handleResize);
