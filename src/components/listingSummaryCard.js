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
    console.log(this.headerSize);
    this.render();
  }

  clickEvent() {
    window.location.assign(`/listingDetails/${this.listingID}`);
  }

  render() {
    this.innerHTML = `
    <div class="card p-0">
      <img src="${this.image}"class="w-full h-${this.imageSize} object-cover">
      <div class="p-4">
        <${this.headerSize} class="font-bold">${this.title}</${this.headerSize}>
        <p class="text-xs font-medium text-orange">$${this.price}</p>
        <div class="button-container flex gap-2 mt-2"></div>
      </div>
    </div>
  `;

    if (this.listingID) {
      const button = document.createElement("button");
      button.className =
        "view-button flex-1 text-xs rounded-lg box-color-0 hover-bright font-bold px-3 py-2 mb-4";
      button.innerHTML = "View";
      button.addEventListener("click", () => {
        this.clickEvent();
      });
      this.querySelector(".button-container").append(button);
    }
  }
}

customElements.define("listing-card", ListingCard);
