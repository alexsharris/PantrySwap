import "../components/listingSummaryCard.js";

document.addEventListener("DOMContentLoaded", async () => {
  const [listingResponse, userResponse] = await Promise.all([
    fetch("/loadListings"),
    fetch("/user"),
  ]);

  const data = await listingResponse.json();
  const currentUser = await userResponse.json();
  const savedItems = currentUser.savedItems || [];
  const listingHolder = document.getElementById("listingsHolder");

  data
    .sort((a, b) => a - b)
    .forEach((newListing) => {
      if (!newListing || newListing.status !== "listed") return;

      const newCard = document.createElement("listing-card");

      newCard.setListingInfo(
        newListing.title,
        newListing.image,
        newListing.price,
        newListing._id,
        "default",
        savedItems,
      );
      listingHolder.appendChild(newCard);
    });
});
