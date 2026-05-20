import { closePopupWindow, displayWindow, displaySimpleWindow } from "./popupWindow.js"

//Display seller's listings
const displaySellerListings = async function () {
  try {
    const res = await fetch("/sellerListings");
    const data = await res.json();

    const listingHolder = document.getElementById("listingsHolder");

    console.log(data);
    data.reverse().forEach((newListing) => {
      if (!newListing || newListing.status === "deleted") return;

      const newCard = document.createElement("listing-card");

      newCard.setListingInfo(
        newListing._id,
        newListing.title,
        newListing.image,
        newListing.price,
        "default",
        [false, true, true],
        [],
        undefined,
        newListing.status,
      );
      listingHolder.appendChild(newCard);
    });
  } catch (error) {
    console.error(error);
  }
};

// checks total closed/unlisted listings, and shows easter egg pop up if requirement is met
const checkForEasterEgg = async function () {
  let totalClosed = 0
  try {
    const res = await fetch("/sellerListings");
    const data = await res.json();
    data.forEach((listing)=>{
      console.log(listing.status)
      if(listing.status == "deleted" || listing.status == "unlisted"){
        totalClosed++
      }
    })
    if(totalClosed >= 3){
      displaySimpleWindow(`
        <h1 class="mb-3">You've closed ${totalClosed} listings!</h1>
        <h2>Did you know?</h2>
        <h3>According to a study conducted by the National Zero Waste Council in 2022, 63% of the food Canadians throw away could have been eaten.</h3>
        <h3 class="mb-3">For the average Canadian household that amounts to 140 kilograms of wasted food per year</h3>
        <h1>Thank you for your service to your community and commitment to preventing food waste!</h1>
        `)
    }
  }
  catch (error) {
    console.error(error);
  }
}

displaySellerListings();
checkForEasterEgg();
// displayWindow("<h1>test</h1>", [], true, "w-1/3 card text-center items-center justify-center")




// Listen for create button
document.addEventListener("click", async (event) => {
  const button = event.target.closest("#createButton");
  if (!button) return;

  window.location.href = "/CreateListing";

  if (!res.ok) {
    console.error("Request failed");
  }
});
