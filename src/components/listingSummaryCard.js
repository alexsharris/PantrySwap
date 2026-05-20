import "./bookmarkButton.js";
import { ButtonStyle } from "./bookmarkButton.js";

class ListingCard extends HTMLElement {
  constructor() {
    super();
  }

  async setListingInfo(
    listingID,
    title,
    image,
    price,
    imageSize = "default",
    showItems = [true, false, false],
    savedItems = [],
    dist = null,
    listingStatus = "listed",
  ) {
    this.listingID = listingID || null;

    this.title = title;
    this.image = image || "images/pantry_share_img_10.jpg";
    this.price = price;
    this.dist = dist;

    this.imageSize = imageSize == "small" ? 20 : 50;
    this.headerSize = imageSize == "small" ? `h4` : `h2`;

    this.savedItems = savedItems;
    this.listingStatus = listingStatus;

    this.showBookmark = showItems[0];
    this.showListingStatus = showItems[1];
    this.showEditButton = showItems[2];
    this.showDist = dist;
    this.render();
  }

  render() {
    this.innerHTML = `
    <div class="card p-0 relative">
      <img src="${this.image}"class="w-full h-${this.imageSize} object-cover">
      <div class="p-4">
        <${this.headerSize} class="font-bold truncate mb-2">${this.title}</${this.headerSize}>
        <div class="flex gap-2 items-center">
          <p class="font-semibold text-orange">${this.price == 0 || !this.price ? "FREE" : `$${this.price}`}</p>
          <div class="distLabel bg-peach px-2 py-1 rounded-full hidden"><p class="text-[10px]">${this.dist} km</p></div>
        </div>
        <div class="button-container flex gap-2 mt-2 justify-between"></div>
      </div>
      <div class="absolute top-0 right-0 m-3">
       <bookmark-btn
          class="bookmark-btn hidden"
          listing-id="${this.listingID}"
          is-saved="${this.savedItems.includes(this.listingID)}"
          button-style="SMALL"
        ></bookmark-btn>
        <div class="status-el hidden bg-white border-2 border-light-grey rounded-full flex gap-3 items-center px-4 py-2">
            <div class="status-color rounded-full size-5"></div>
            <p class="status-text font-semibold"></p>
        </div>
      </div>
    </div>
  `;

    if (this.listingID) {
      // view details button
      const viewButton = document.createElement("button");
      viewButton.className =
        "view-button box-color-0 hover-bright font-bold w-full";
      viewButton.innerHTML = "View Listing";
      viewButton.addEventListener("click", () => {
        window.location.assign(`/listingDetails/${this.listingID}`);
      });
      this.querySelector(".button-container").append(viewButton);

      // edit button
      if (this.showEditButton) {
        const editButton = document.createElement("button");
        editButton.className = `editButton box-color-3 hover-bright font-bold w-full`;
        editButton.innerHTML = "Edit";
        editButton.addEventListener("click", () => {
          window.location.href = `/EditListing/${this.listingID}`;
        });
        this.querySelector(".button-container").append(editButton);
      }

      // bookmark button
      if (this.showBookmark) {
        const bookmarkBtn = this.querySelector(".bookmark-btn");
        bookmarkBtn.classList.remove("hidden");
      }

      // distance label
      if (this.dist) {
        const distLabel = this.querySelector(".distLabel");
        distLabel.classList.remove("hidden");
      }

      // Status Tag
      if (this.showListingStatus) {
        const statusEl = this.querySelector(".status-el");
        statusEl.classList.remove("hidden");
        const statusCol = this.querySelector(".status-color");
        const statusText = this.querySelector(".status-text");
        statusCol.classList.add(
          this.listingStatus == "listed"
            ? "bg-green"
            : this.listingStatus == "unlisted"
              ? "bg-red"
              : "bg-light-grey",
        );
        statusText.innerHTML = this.listingStatus;
      }
    }
  }
}

customElements.define("listing-card", ListingCard);
