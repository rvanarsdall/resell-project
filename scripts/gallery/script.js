console.log("It works");
const PRODUCT_URL = "https://www.resellwithmichelle.org/en/product";
let currentPage = 1;
const itemsPerPage = window.galleryConfig.itemsPerPage || 9; // Change this value to adjust items per page
const showNavigationButtons =
  window.galleryConfig.showNavigationButtons || false;

const galleryInsertWithNavigation = ` <div class="container">
      <div class="gallery"></div>
      <div class="pagination">
        <button class='gallery-btn' id="prevPage">Previous</button>
        <div style="display: flex; flex-direction: column">
          <span id="pageInfo"></span>
          <select id="pageSelect"></select>
        </div>

        <button class='gallery-btn' id="nextPage">Next</button>
      </div>
    </div>`;

const galleryInsertWithoutNavigation = ` <div class="container">
      <div class="gallery"></div>
      `;

let productInformation = `<div class="col-4">
        <img
          src="{{PHOTO_URL}}"
          alt=""
        />
        <div class="title-price flex">
          <h3 class="title">{{TITLE}}</h3>
          <p class="price">{{PRICE}}</p>
        </div>
        <div class="quick-description">
          {{DESCRIPTION}}
        </div>
     
         <div class="border-top border-bottom align-self-end">
        <div class="deliver-method flex">
          <div id="method">{{DELIVERY_METHOD}}</div>
          <div id="status">{{CURRENT_STATUS}}</div>
        </div>
        </div>

        <div class="learn-more">
       <a href="{{LINK}}" class="learn-more-link learn-more">Learn More  <span class="chevron"> > </></a>
       
        </div>
      </div>`;
// Gallery Layout Insert
const galleryLayout = document.querySelector(".gallery-layout");
galleryLayout.innerHTML = showNavigationButtons
  ? galleryInsertWithNavigation
  : galleryInsertWithoutNavigation;

function buildAndLoad() {
  const formName = "Website";
  console.log("DOM fully loaded and parsed");
  const sheetDataHandler = (sheetData) => {
    //ADD YOUR CODE TO WORK WITH sheetData ARRAY OF OBJECTS HERE
    if (!sheetData) return console.log("No data found");

    data = cleanSheetData(sheetData);
    items = buildGalleryList(data);
    renderGallery();
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
    .map((item) => {
      return {
        title: item["Item Name"],
        description:
          item["Item Description"] !== "N/A" ? item["Item Description"] : "",
        photo:
          item["Photo"] !== ""
            ? item["Photo"].split(",")
            : ["https://via.placeholder.com/150"],
        price: formatNumberToCurrency(item["Price"]),
        deliveryMethod: item["Purchase Type"],
        currentStatus: item["Status"],
        link: `${PRODUCT_URL}?id=${item["SKU"]}`,
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
  return currentProductInformation.replace(
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

function renderGallery() {
  const gallery = document.querySelector(".gallery");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = items.slice(start, end);
  const combinedHTML = paginatedItems.join("");

  gallery.innerHTML = combinedHTML;
  if (showNavigationButtons) {
    updatePageControls();
  }
}

function updatePageControls() {
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
      renderGallery();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderGallery();
    }
  });

  document.getElementById("pageSelect").addEventListener("change", (e) => {
    currentPage = parseInt(e.target.value, 10);
    renderGallery();
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
    return deliveryMethod[0] + " and " + deliveryMethod[1];
  }
}
