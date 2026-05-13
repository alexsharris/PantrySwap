import "../components/listingSummaryCard.js";

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(`/loadListings`);
  const data = await response.json();

  const listingHolder = document.getElementById("listingsHolder");

  data.forEach((newListing) => {
    if (!newListing || newListing.status !== "listed") return;

    const newCard = document.createElement("listing-card");

    newCard.setListingInfo(
      newListing.title,
      newListing.image,
      newListing.price,
      newListing._id,
    );

    listingHolder.appendChild(newCard);
  });
});
