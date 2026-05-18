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

  let selectedCategories = [];

  const dropdown = document.getElementById("catDropdown");
  const button = document.getElementById("catDropdownButton");
  const selectedText = document.getElementById("catSelectedText");
  const checkboxes = document.querySelectorAll(".catItem");
  const categoriesRoot = document.getElementById("categories");

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", updateSelection);
  });

  function updateSelection() {
    selectedCategories = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    selectedText.textContent =
      selectedCategories.length > 0
        ? "Categories: " + selectedCategories.join(", ")
        : "Categories";

    renderListings();
  }

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!categoriesRoot.contains(e.target)) {
      dropdown.classList.add("hidden");
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

      // if no filter, show all
      if (selectedCategories.length === 0) return true;
      if (!categories) return false;

      // normalize to array
      const categoryArray = Array.isArray(categories)
        ? categories
        : [categories];

      return selectedCategories.every((selected) =>
        categoryArray.includes(selected),
      );
    });
    if (filtered.length === 0) {
      listingHolder.innerHTML = `
      <div class="col-span-full text-center text-medium-grey py-10">
        No listings match your filters...
      </div>
    `;
      return;
    }
    filtered.reverse().forEach((newListing) => {
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
  }

  renderListings();
});
