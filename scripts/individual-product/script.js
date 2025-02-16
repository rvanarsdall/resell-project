console.log("individual-product/script.js");
https://form.frameworkscompany.com/forms/product-form-l8jgpz?239f4e56-d90c-49f1-93f9-d5433c1f73ab=$25.00&57b89eac-32ea-487e-b367-b3e466df124c=Delivery,+PickUp&2daf0f24-0eca-4cf4-bd47-f8d7cdcee5a6=Sold&d8b5959e-32bc-46b2-88d6-780f07eeec2c=blank&18e3ff94-0d43-4ba6-a54e-420ab070ea62=108
const individualProductInformation = /*html*/ ` <div class="container">
  <div class="grid-layout">
    <div class="product-container">
      <div class="product-image">
        <img src="{{PHOTO_URL_1}}" alt="" />
        <img src="{{PHOTO_URL_2}}" alt="" />
      </div>
    </div>
    <div class="description-container">
      <div class="item-tag">Item Overview</div>

      <div class="flex space-between">
        <div class="title">{{TITLE}}</div>
        <div class="individual-price">{{PRICE}}</div>
      </div>

      <div class="underline-container">
        <hr class="underline" />
      </div>
      <div class="description">
        <p>{{DESCRIPTION}}</p>
      </div>
      <div class="border-top border-bottom align-self-end">
        <div class="deliver-method flex mt-3 mb-3">
          <div id="method">{{DELIVERY_METHOD}}</div>
          <div id="status">{{CURRENT_STATUS}}</div>
        </div>
      </div>
      <div class="contact-us-link">
        <a href="{{CONTACT_US_URL}}" class="contact-us-link contact-us"
          >Contact Us To Buy <span class="chevron"> > </span></a
        >
      </div>
    </div>
    <hr />
  </div>
</div>`;

const productNotFound = /*html*/ ` <div class="container">
  <div class="grid-layout">
    <div class="product-container">
      <div class="product-image">
        <img src="{{PHOTO_URL_1}}" alt="" />
        <img src="{{PHOTO_URL_2}}" alt="" />
      </div>
    </div>
    <div class="description-container">
      <div class="item-tag">Resell with Michelle</div>

      <div class="flex space-between">
        <div class="title">Product Not Found</div>
        <div class="individual-price">OOPS!</div>
      </div>

      <div class="underline-container">
        <hr class="underline" />
      </div>
      <div class="description">
        <p>
          The item that you were looking for was not found. Go back to our
          gallery to view our entire collection that is for sale.
        </p>

        <p>If you have any questions please feel free to contact us.</p>
      </div>
      <div class="border-top border-bottom align-self-end">
        <div class="mt-3 mb-3" style="text-align: center;">
          <p>Product Not Found Message</p>
        </div>
      </div>
      <div class="contact-us-link">
        <a href="{{LINK_TO_GALLERY}}" class="gallery-link gallery"
          >Back to Gallery <span class="chevron"> > </span></a
        >
      </div>
    </div>
    <hr />
  </div>
</div>`;

//Path Variables from the URL
const LINK_TO_GALLERY = "https://www.resellwithmichelle.org/en/marketplace";
const urlParams = new URLSearchParams(window.location.search);
const productID = urlParams.get("id") || undefined;
let productData = {};

const formName = "Website";

// Product Layout Insert
const productLayout = document.querySelector(".product-layout");

function buildAndLoad() {
  console.log("DOM fully loaded and parsed");
  if (!productID) {
    return console.log("No product ID found");
  }
  const sheetDataHandler = (sheetData) => {
    //ADD YOUR CODE TO WORK WITH sheetData ARRAY OF OBJECTS HERE
    if (!sheetData) {
      renderNoProductFound();
      return console.log("No data found");
    }
    data = individualCleanSheetData(sheetData);
    productData = data.find((item) => item.id == productID);

    if (!productData) {
      renderNoProductFound();
      return console.log("No product found");
    }
    renderProduct(productData);
    popOverEffect();
  };
  individualGetSheetData({
    // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
    sheetID: "1CZVsEbmZ3FaIMWkmp5H_RI7ynuN61FoGp9fSdiYyypo",
    // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
    sheetName: formName,
    query: "SELECT *",
    callback: sheetDataHandler,
  });
}

function renderNoProductFound() {
  let currentProductHTML = productNotFound;
  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "PHOTO_URL_1",
    "https://via.placeholder.com/150"
  );

  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "PHOTO_URL_2",
    "https://via.placeholder.com/150"
  );

  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "LINK_TO_GALLERY",
    LINK_TO_GALLERY
  );

  productLayout.innerHTML = currentProductHTML;
}

function renderProduct(product) {
  if (!product) return console.log("No product found");
  let currentProductHTML = individualProductInformation;
  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "TITLE",
    product.title
  );
  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "DESCRIPTION",
    product.description
  );

  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "PHOTO_URL_1",
    product.photo[0]
  );

  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "PHOTO_URL_2",
    product.photo[1] ? product.photo[1] : product.photo[0]
  );

  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "PRICE",
    product.price
  );

  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "DELIVERY_METHOD",
    product.deliveryMethod
  );

  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "CURRENT_STATUS",
    product.currentStatus
  );
  console.log("PRODUCT", product);
  currentProductHTML = replaceProductInformation(
    currentProductHTML,
    "CONTACT_US_URL",
    `https://form.frameworkscompany.com/forms/product-form-l8jgpz?18e3ff94-0d43-4ba6-a54e-420ab070ea62=${addingPlusSignsToSpaces(
      product.id
    )}&57b89eac-32ea-487e-b367-b3e466df124c=${addingPlusSignsToSpaces(
      product.deliveryMethod
    )}&239f4e56-d90c-49f1-93f9-d5433c1f73ab=${
      product.price
    }&2daf0f24-0eca-4cf4-bd47-f8d7cdcee5a6=${addingPlusSignsToSpaces(
      product.currentStatus
    )}&d8b5959e-32bc-46b2-88d6-780f07eeec2c=${addingPlusSignsToSpaces(
      product.location
    )}`
  );

  productLayout.innerHTML = currentProductHTML;
}

buildAndLoad();

function individualCleanSheetData(sheetData) {
  let cleanData = sheetData
    .filter((item) => item["Item Name"] !== "")
    .map((item) => {
      return {
        id: item["SKU"],
        title: item["Item Name"],
        description:
          item["Item Description"] !== "N/A"
            ? convertToParagraphs(item["Item Description"])
            : "",
        photo:
          item["Photo"] !== ""
            ? item["Photo"].split(",")
            : ["https://via.placeholder.com/150"],
        price: formatNumberToCurrency(item["Price"]),
        deliveryMethod: item["Purchase Type"],
        currentStatus: item["Status"],
        location: item["Location"],
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

// Convert to a paragraph

function convertToParagraphs(input) {
  // Split the string into parts by new lines
  const paragraphs = input.split(/\n+/); // Match one or more \n

  // Wrap each part in a <p> tag and join them back together
  return paragraphs.map((line) => `<p>${line.trim()}</p>`).join("");
}

// Popover
function popOverEffect() {
  const productImages = document.querySelectorAll(".product-image img");

  productImages.forEach((image) => {
    const popover = document.createElement("div");
    popover.classList.add("popover");
    const fullImage = document.createElement("img");
    fullImage.src = image.src;
    popover.appendChild(fullImage);
    document.body.appendChild(popover);

    image.addEventListener("mouseover", (event) => {
      popover.style.display = "block";
      popover.style.top = `${event.pageY + 10}px`;
      popover.style.left = `${event.pageX + 10}px`;
    });

    image.addEventListener("mousemove", (event) => {
      popover.style.top = `${event.pageY + 10}px`;
      popover.style.left = `${event.pageX + 10}px`;
    });

    image.addEventListener("mouseout", () => {
      popover.style.display = "none";
    });
  });
}

function addingPlusSignsToSpaces(input) {
  return input ? input.toString().replace(/ /g, "+") : "blank";
}
