//Display seller's listings
displaySellerListings = async function () {
  try {
    const res = await fetch("/sellerListings");
    const data = await res.json();

    const listingHolder = document.getElementById("listingsHolder");

    console.log(data);
    data.reverse().forEach((newListing) => {
      if (!newListing || newListing.status !== "listed") return;

      const newCard = document.createElement("listing-card");

      newCard.setListingInfo(
        newListing._id,
        newListing.title,
        newListing.image,
        newListing.price,
        "default",
        [false, true, true],
        [],
        newListing.status,
      );
      listingHolder.appendChild(newCard);
    });
  } catch (error) {
    console.error(error);
  }
};

displaySellerListings();

// Listen for create button
document.addEventListener("click", async (event) => {
  const button = event.target.closest("#createButton");
  if (!button) return;

  window.location.href = "/CreateListing";

  if (!res.ok) {
    console.error("Request failed");
  }
});
