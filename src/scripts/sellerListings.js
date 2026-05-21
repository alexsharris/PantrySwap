import { closePopupWindow, displayWindow, displaySimpleWindow } from "./popupWindow.js"

//Display seller's listings
const displaySellerListings = async function () {
  try {
    const res = await fetch("/sellerListings");
    const data = await res.json();

    const listingHolder = document.getElementById("listingsHolder");

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

    //children gives a live collection elements we can count with length
    // if no child is appended, reveal the empty state
    if (listingHolder.children.length === 0) {
      const banner = document.getElementById("emptyStateBanner");
      banner.classList.remove("hidden");
    }
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
    const accRes = await fetch("/AccountData");
    const accData = await accRes.json();
    data.forEach((listing)=>{
      if(listing.status == "deleted" || listing.status == "unlisted"){
        totalClosed++
      }
    })
    if(totalClosed >= 5 && !(accData.easterEgg)){
      displaySimpleWindow(`
        <h1 class="mb-3">You've closed ${totalClosed} listings!</h1>
        <h2>Did you know?</h2>
        <h3>According to a study conducted by the National Zero Waste Council in 2022, 63% of the food Canadians throw away could have been eaten.</h3>
        <h3 class="mb-3">For the average Canadian household. that amounts to 140 kilograms of wasted food per year.</h3>
        <h1>Thank you for your service to your community and commitment to preventing food waste!</h1>
        `)
      jsConfetti.addConfetti({
      emojis: ['🍇', '🍉', '🍊', '🍏', '🥬', '🍞', '🥚'],
      confettiNumber: 100,
      }) 
      let seenEasterEgg = true
      const Response = await fetch("/ChangeData", {
      method: "PUT",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seenEasterEgg
      }),
      });
      }
  }
  catch (error) {
    console.error(error);
  }
}

displaySellerListings();
const jsConfetti = new JSConfetti()
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
