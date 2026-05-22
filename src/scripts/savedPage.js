// ================================================================================================================
// This function fetches the information from DB when the page is loaded, and display listings that are bookmarked
//=================================================================================================================
async function displaySavedListings() {
  const response = await (await fetch("/user")).json();

  //get all the listing from the database
  const listingResponse = await fetch("/loadListings");
  const allListings = await listingResponse.json();

  // filter down to only the saved ones for a user
  const savedData = allListings.filter((listing) =>
    response.savedItems.includes(listing._id),
  );
  const listingHolder = document.getElementById("listingsHolder");

  savedData.reverse().forEach((newListing) => {
    if (!newListing || newListing.status !== "listed") return;

    const newCard = document.createElement("listing-card");

    newCard.setListingInfo(
      newListing._id,
      newListing.title,
      newListing.image,
      newListing.price,
      "default",
      [true, false, false],
      [...response.savedItems],
    );
    listingHolder.appendChild(newCard);
  });

  if (listingHolder.children.length === 0) {
    document.getElementById("emptyStateBanner").classList.remove("hidden");
  }
}
displaySavedListings();
