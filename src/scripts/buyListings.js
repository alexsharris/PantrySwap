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

  data.reverse().forEach((newListing) => {
    if (!newListing || newListing.status !== "listed") return;

    const newCard = document.createElement("listing-card");

    newCard.setListingInfo(
      newListing._id,
      newListing.title,
      newListing.image,
      newListing.price,
      "default",
      [true, false, false],
      savedItems,
    );
    listingHolder.appendChild(newCard);
  });
});
