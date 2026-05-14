import "./bookmarkButton.js";
import { ButtonStyle } from "./bookmarkButton.js";

class ListingCard extends HTMLElement {
  constructor() {
    super();
  }

  setListingInfo(title, image, price, listingID, imageSize = "default") {
    this.title = title;
    this.image = image || "images/pantry_share_img_10.jpg";
    this.price = price;
    this.listingID = listingID || null;
    this.imageSize = imageSize == "small" ? 20 : 50;
    this.headerSize = imageSize == "small" ? `h4` : `h2`;
    this.render();
  }

  clickEvent() {
    window.location.assign(`/listingDetails/${this.listingID}`);
  }

  render() {
    this.innerHTML = `
    <div class="card p-0 relative">
      <img src="${this.image}"class="w-full h-${this.imageSize} object-cover">
      <div class="p-4">
        <${this.headerSize} class="font-bold truncate">${this.title}</${this.headerSize}>
        <p class="font-semibold text-orange">$${this.price}</p>
        <div class="button-container flex gap-2 mt-2 justify-between"></div>
      </div>
      <div class="absolute top-0 right-0 m-3">
        <bookmark-btn
          class="bookmark-btn"
          listing-id="${this.listingID}"
          button-style="SMALL"
        ></bookmark-btn>
        <div class="status-el bg-white border-2 border-light-grey rounded-full flex gap-3 items-center px-4 py-2">
            <div class="status-color rounded-full size-5"></div>
            <p class="status-text font-semibold"></p>
        </div>
      </div>
    </div>
  `;

    if (this.listingID) {
      // Action Buttons
      const editButton = document.createElement("button");
      editButton.className = `editButton box-color-3 hover-bright font-bold w-full`;
      editButton.innerHTML = "Edit";
      editButton.addEventListener("click", () => {
        this.clickEvent();
      });

      const viewButton = document.createElement("button");
      viewButton.className =
        "view-button box-color-0 hover-bright font-bold w-full";
      viewButton.innerHTML = "View Listing";
      viewButton.addEventListener("click", () => {
        this.clickEvent();
      });
      this.querySelector(".button-container").append(viewButton);
      this.querySelector(".button-container").append(editButton);

      // bookmark button
      const bookmarkBtn = this.querySelector(".bookmark-btn");
      bookmarkBtn.classList.add("visible");

      // Status Tag
      const statusEl = this.querySelector(".status-el");
      statusEl.classList.add("hidden");

      const statusCol = this.querySelector(".status-color");
      const statusText = this.querySelector(".status-text");
      statusCol.classList.add("bg-green");
      statusText.innerHTML = "Listed";
    }
  }
}

customElements.define("listing-card", ListingCard);
