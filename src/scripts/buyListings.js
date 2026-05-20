import "../components/listingSummaryCard.js";

// ===============================================================
// Get distance between two coordinate pairs
// ===============================================================
// formula from stackoverflow
let calculateDistance = function(latA, lonA, latB, lonB) {
  var R = 6378.137; // Radius of earth in KM
  var dLat = latB * Math.PI / 180 - latA * Math.PI / 180;
  var dLon = lonB * Math.PI / 180 - lonA * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d.toFixed(1); // km
}

document.addEventListener("DOMContentLoaded", async () => {
  const [listingResponse, userResponse] = await Promise.all([
    fetch("/loadListings"),
    fetch("/user"),
  ]);


  // Get client location, store in local storage
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Store data
      localStorage.setItem("Client Latitude", latitude);
      localStorage.setItem("Client Longitude", longitude);

      // console.log("User latitude:", localStorage.getItem("Client Latitude"));
      // console.log("User longitude:", localStorage.getItem("Client Longitude"));
    },
    (error) => {
      console.error("Error getting location:", error.message);
    }
  );

  const data = await listingResponse.json();
  const currentUser = await userResponse.json();
  const savedItems = currentUser.savedItems || [];

  const listingHolder = document.getElementById("listingsHolder");

  let selectedCategories = [];
  let selectedDistance = null;

  const dropdown = document.getElementById("catDropdown");
  const distanceDropdown = document.getElementById("distanceDropdown");
  const button = document.getElementById("catDropdownButton");
  const distanceButton = document.getElementById("distanceBtn");
  const selectedText = document.getElementById("catSelectedText");
  const selectedDistanceText = document.getElementById("distanceSelectedText");
  const checkboxes = document.querySelectorAll(".catItem");
  const radioButtons = document.querySelectorAll(".distanceItem");
  const categoriesRoot = document.getElementById("categories");

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    if(!distanceDropdown.classList.contains("hidden")) distanceDropdown.classList.toggle("hidden");
    dropdown.classList.toggle("hidden");
  });

  distanceButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if(!dropdown.classList.contains("hidden")) dropdown.classList.toggle("hidden");
    distanceDropdown.classList.toggle("hidden");
  });

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", updateSelection);
  });

  radioButtons.forEach((rb) => {
    rb.addEventListener("change", updateSelection);
  });

  function updateSelection() {
    selectedCategories = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    
    selectedDistance = parseInt(document.querySelector('input[name="distance"]:checked')?.value);
    // console.log(selectedCategories);
    // console.log(selectedDistance);

    selectedText.textContent =
      selectedCategories.length > 0
        ? "Categories: " + selectedCategories.join(", ")
        : "Categories";

    if(selectedDistance <= 10){
      selectedDistanceText.textContent =
      selectedDistance ? `Distance: ${selectedDistance} km` : "";
    }
    else {
      selectedDistanceText.textContent = "Distance: No limit";
    }

    renderListings();
  }

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!categoriesRoot.contains(e.target)) {
      dropdown.classList.add("hidden");
      distanceDropdown.classList.add("hidden");
    }
  });

  // ===============================================================
  // Render
  // ===============================================================
  function renderListings() {
    listingHolder.innerHTML = "";

    const filtered = data.filter((listing) => {
      if (!listing || listing.status !== "listed") return false;

      const categories = listing.category;
      const listingLatitude = listing.lat;
      const listingLongitude = listing.lng;

      // normalize categories
      const categoryArray = Array.isArray(categories)
        ? categories
        : [categories];

      // CATEGORY FILTER
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.every((selected) =>
          categoryArray.includes(selected)
        );

      // DISTANCE FILTER
      let distanceMatch = true;

      if (
        localStorage.getItem("Client Latitude") &&
        localStorage.getItem("Client Longitude") &&
        selectedDistance
      ) {
        const calculatedDistance = calculateDistance(
          Number(listingLatitude),
          Number(listingLongitude),
          Number(localStorage.getItem("Client Latitude")),
          Number(localStorage.getItem("Client Longitude"))
        );

        distanceMatch = calculatedDistance < Number(selectedDistance);
      }

      // BOTH must pass
      return categoryMatch && distanceMatch;
    });

    if (filtered.length === 0) {
      listingHolder.innerHTML = `
      <div class="col-span-full text-center text-medium-grey py-10">
        No listings match your filters...
      </div>
    `;
      return;
    }

    if(selectedDistance && localStorage.getItem("Client Longitude")) {

      filtered.sort((a, b) => {
        const distanceA = calculateDistance(
          Number(a.lat),
          Number(a.lng),
          Number(localStorage.getItem("Client Latitude")),
          Number(localStorage.getItem("Client Longitude"))
        );

        const distanceB = calculateDistance(
          Number(b.lat),
          Number(b.lng),
          Number(localStorage.getItem("Client Latitude")),
          Number(localStorage.getItem("Client Longitude"))
        );

        return distanceA - distanceB;
      })
      .forEach((newListing) => {
        const newCard = document.createElement("listing-card");

        //Get distance between user and listing
        let calculatedDistance = calculateDistance(
          Number(newListing.lat),
          Number(newListing.lng),
          Number(localStorage.getItem("Client Latitude")),
          Number(localStorage.getItem("Client Longitude"))
        );
        
        newCard.setListingInfo(
          newListing._id,
          newListing.title,
          newListing.image,
          newListing.price,
          "default",
          [true, false, false],
          savedItems,
          calculatedDistance
        );

        listingHolder.appendChild(newCard);
      });

    }
    else {
      filtered.reverse().forEach((newListing) => {
        const newCard = document.createElement("listing-card");

        //Get distance between user and listing, if permission granted and distance selected
        let calculatedDistance = null;
        if(localStorage.getItem("Client Latitude") && localStorage.getItem("Client Longitude") && selectedDistance) {
          calculatedDistance = calculateDistance(Number(newListing.lat), Number(newListing.lng), Number(localStorage.getItem("Client Latitude")), Number(localStorage.getItem("Client Longitude")));
        }

        newCard.setListingInfo(
          newListing._id,
          newListing.title,
          newListing.image,
          newListing.price,
          "default",
          [true, false, false],
          savedItems,
          calculatedDistance
        );

        listingHolder.appendChild(newCard);
      });
    }
    
  }

  renderListings();
});
