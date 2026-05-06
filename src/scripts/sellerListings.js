//Display seller's listings
displaySellerListings = async function () {
  try {
    const res = await fetch("/sellerListings")
    const data = await res.json();

    for (let i = 0; i < data.length; i++) {

      const template = document.getElementById("sellerListingTemplate");
      const container = document.getElementById("sellerListings");

      //clone template
      const clone = template.content.cloneNode(true);

      //fill data
      clone.querySelector(".listingTitle").textContent = data[i].title;
      clone.querySelector(".listingImage").src = data[i].image;
      clone.querySelector(".listingPrice").textContent = `$${data[i].price}`;
      clone.querySelector(".editButton").id = `edit-${data[i]._id}`;
      clone.querySelector(".viewButton").id = `view-${data[i]._id}`;
      container.appendChild(clone);
    }

  }
  catch (error) {
    console.error(error);
  }
};

displaySellerListings();


// Listen for edit button
document.addEventListener("click", async (event) => {
  const button = event.target.closest(".editButton");

  if (!button) return;
  const listingID = button.id.split("-")[1];
  
  const res = await fetch(`/editLIsting/?listingID=${listingID}`)

  if (!res.ok) {
    console.error("Request failed");
  }

});



// Listen for view button
document.addEventListener("click", async (event) => {
  const button = event.target.closest(".viewButton");

  if (!button) return;
  const listingID = button.id.split("-")[1];
  console.log(eventID);
  
  const res = await fetch(`/buy?eventID=${listingID}`)
 
  if (!res.ok) {
    console.error("Request failed");
  }
});