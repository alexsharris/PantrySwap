// ================================================================================================================
// This function fetches the information from DB when the page is loaded, and display listings that are bookmarked
//=================================================================================================================
async function displaySavedListings() {
  const Response = await (await fetch("/user")).json();

  //get all the listing from the database
  const listingResponse = await fetch("/loadListings");
  const allListings = await listingResponse.json();

  // filter down to only the saved ones for a user
  const savedData = allListings.filter((listing) =>
    Response.savedItems.includes(listing._id),
  );

  const listingContainer = document.getElementById("listingsHolder");
  listingContainer.innerHTML = "";
  savedData.forEach((saved) => {
    // saved are the id of the listings, we should fetch the information of them from another route

    const element = document.createElement("div");
    element.innerHTML = `<div
      class="listingCard flex flex-col relative bg-white rounded-lg shadow-lg shadow-[#D9D9D9]"
    >
      <!--image-->
      <div class="bg-white/50 rounded-t-lg mb-4">
        <img src="${saved.image}" class="listingImage mx-auto rounded-t-lg" />
      </div>
      <!--bottom-->
      <div class="flex flex-col flex-1">
        <!--Text-->
        <div class="flex-1 mx-4 mb-4">
          <h2 class="listingTitle font-bold">${saved.title}</h2>
          <p class="listingPrice text-xs font-medium text-[#FF6700]">$${saved.price}</p>
        </div>
        <!--Buttons-->
        <div class="mt-auto flex flex-1 gap-2 items-end mx-4">
          <button
            id="${saved._id}view"
            class="viewButton flex-1 text-xs rounded-lg bg-[#FF6700] font-bold px-3 py-2 mb-4 text-white"
          >
            View
          </button>
        </div>
      </div>
    </div>`;
    listingContainer.appendChild(element);

    // attaching event listener to each view button to go to each listings details page
    document
      .getElementById(`${saved._id}view`)
      .addEventListener("click", async () => {
        const serverResponse = await fetch(`/listingDetails/${saved._id}`);

        if (serverResponse.ok) {
          // means the try block gets executed and we didnt get any http errors

          window.location.href = `/listingDetails/${saved._id}`;
        }
      });
  });
}
displaySavedListings();
