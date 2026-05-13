class ListingCard extends HTMLElement {
  constructor() {
    super();
  }

  setListingInfo(title, image, price, listingID) {
    this.title = title;
    this.image = image || "images/pantry_share_img_10.jpg";
    this.price = price;
    this.listingID = listingID;

    this.render();
  }

  clickEvent() {
    window.location.assign(`/listingDetails/${this.listingID}`);
  }

  render() {
    this.innerHTML = `
    <div class="listingCard flex flex-col relative bg-white rounded-lg shadow-lg shadow-[#D9D9D9]">
      <div class="bg-white/50 rounded-t-lg mb-4">
        <img src="${this.image}" class="listingImage mx-auto rounded-t-lg">
      </div>

      <div class="flex flex-col flex-1">
        <div class="flex-1 mx-4 mb-4">
          <h2 class="listingTitle font-bold">${this.title}</h2>
          <p class="listingPrice text-xs font-medium text-[#FF6700]">$${this.price}</p>
        </div>

        <div class="button-container mt-auto flex flex-1 gap-2 items-end mx-4">
        </div>
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
