import "../components/listingSummaryCard.js";
import { callTutorial } from "./tutorialSystem.js";

let listingHolder = null;
let allListings = [];
const loadLimit = 10;
let loadBatch = 1;
let isLoadingMore = false;
const loadMoreDelay = 800;

// ===============================================================
// This function gets the distance between two coordinate pairs
// source of the formula: stackoverflow
// ===============================================================
let calculateDistance = function (latA, lonA, latB, lonB) {
  var R = 6378.137; // Radius of earth in KM
  var dLat = (latB * Math.PI) / 180 - (latA * Math.PI) / 180;
  var dLon = (lonB * Math.PI) / 180 - (lonA * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latA * Math.PI) / 180) *
      Math.cos((latB * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toFixed(1); // km
};

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
    },
    (error) => {
      console.error("Error getting location:", error.message);
    },
  );

  const data = await listingResponse.json();
  const currentUser = await userResponse.json();
  const savedItems = currentUser.savedItems || [];

  listingHolder = document.getElementById("listingsHolder");

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
    if (!distanceDropdown.classList.contains("hidden"))
      distanceDropdown.classList.toggle("hidden");
    dropdown.classList.toggle("hidden");
  });

  distanceButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!dropdown.classList.contains("hidden"))
      dropdown.classList.toggle("hidden");
    distanceDropdown.classList.toggle("hidden");
  });

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", updateSelection);
  });

  radioButtons.forEach((rb) => {
    rb.addEventListener("change", updateSelection);
  });

  // ===============================================================
  // This function reads the checked category checkboxes and selected
  // distance radio button, updates the filter label text, and
  // re-renders the listings to match the new selection.
  // ===============================================================
  function updateSelection() {
    selectedCategories = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    selectedDistance = parseInt(
      document.querySelector('input[name="distance"]:checked')?.value,
    );

    selectedText.textContent =
      selectedCategories.length > 0
        ? "Categories: " + selectedCategories.join(", ")
        : "Categories";

    if (selectedDistance <= 10) {
      selectedDistanceText.textContent = selectedDistance
        ? `Distance: ${selectedDistance} km`
        : "";
    }
    if (selectedDistance === 1000) {
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
  // This function filters allListings by selected categories and
  // distance, then renders the results. If a distance filter is
  // active it sorts by proximity and renders all matches at once;
  // otherwise it reverses to newest-first and kicks off batch
  // loading via displayBatch().
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
          categoryArray.includes(selected),
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
          Number(localStorage.getItem("Client Longitude")),
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

    if (selectedDistance && localStorage.getItem("Client Longitude")) {
      filtered
        .sort((a, b) => {
          const distanceA = calculateDistance(
            Number(a.lat),
            Number(a.lng),
            Number(localStorage.getItem("Client Latitude")),
            Number(localStorage.getItem("Client Longitude")),
          );

          const distanceB = calculateDistance(
            Number(b.lat),
            Number(b.lng),
            Number(localStorage.getItem("Client Latitude")),
            Number(localStorage.getItem("Client Longitude")),
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
            Number(localStorage.getItem("Client Longitude")),
          );

          newCard.setListingInfo(
            newListing._id,
            newListing.title,
            newListing.image,
            newListing.price,
            "default",
            [true, false, false],
            savedItems,
            calculatedDistance,
          );

          listingHolder.appendChild(newCard);
        });
    } else {
      allListings = filtered.reverse();
      loadBatch = 1;
      listingHolder.innerHTML = "";
      displayBatch();
    }
  }

  renderListings();

  // ===============================================================
  // This function renders the next page of listings from allListings
  // using loadBatch and loadLimit to slice the correct range, then
  // increments loadBatch so the next call advances the window.
  // Called on initial load and on scroll to implement infinite scroll.
  // ===============================================================
  function displayBatch() {
    const start = (loadBatch - 1) * loadLimit;
    const end = loadBatch * loadLimit;

    if (start >= allListings.length) return;

    let batch = allListings.slice(start, end);

    batch.forEach((newListing) => {
      const newCard = document.createElement("listing-card");

      newCard.setListingInfo(
        newListing._id,
        newListing.title,
        newListing.image,
        newListing.price,
        "default",
        [true, false, false],
        savedItems,
        null,
      );

      listingHolder.appendChild(newCard);
    });

    loadBatch++;
  }

  window.addEventListener("scroll", () => {
    // dont load more if storage filter
    if (selectedDistance && localStorage.getItem("Client Longitude")) return;
    // if loading dont load
    if (isLoadingMore) return;
    const start = (loadBatch - 1) * loadLimit;
    if (start >= allListings.length) return;
    // pos threshold
    const threshold = 300;
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.body.offsetHeight;
    if (scrollPosition >= pageHeight - threshold) {
      isLoadingMore = true;
      setTimeout(() => {
        displayBatch();
        isLoadingMore = false;
      }, loadMoreDelay);
    }
  });
});
