import {
  displaySimpleWindow,
  closePopupWindow,
  displayWindow,
} from "/src/scripts/popupWindow.js";
import {
  NotifTypes,
  newNotifForConnectedUsers,
} from "/src/scripts/notificationSystem.js";

//GRAB THE ID FROM THE URL
const params = new URLSearchParams(window.location.search);
const listingID = window.location.pathname.split("/").pop();
// const listingID = params.get('id') // this should be passed in to the url once a user clicks on edit a listing from the my listing page
// const listingID = '69fa70e043a7f4dbfc8616fa' //hard coding the listing ID for now until later

let data = null;

async function loadListingData() {
  //fetch foods
  const response = await fetch(`/LoadListing/${listingID}`);
  const listingRecord = await response.json();
  // console.log(listingRecord);
  return listingRecord;
}

function prefillForm(listingRecord) {
  // console.log(listingRecord);
  // console.log(listingRecord.category);
  document.getElementById("editTitle").value = listingRecord.title;
  document.getElementById("editLocation").value = listingRecord.location;
  document.getElementById("editPrice").value = listingRecord.price;
  document.getElementById("editContact").value = listingRecord.contact;
  document.getElementById("editDescription").value = listingRecord.description;
  document.getElementById("editProduce").checked =
    listingRecord.category.includes("Produce") ? true : false;
  document.getElementById("editMeat").checked = listingRecord.category.includes(
    "Meat",
  )
    ? true
    : false;
  document.getElementById("editDairy").checked =
    listingRecord.category.includes("Dairy") ? true : false;
  document.getElementById("editBakedGoods").checked =
    listingRecord.category.includes("Baked Goods") ? true : false;
  document.getElementById("editCookedMeals").checked =
    listingRecord.category.includes("Cooked Meals") ? true : false;
  document.getElementById("listingImg").src =
    listingRecord.image || "images/pantry_share_img_10.jpg";
}

// translate image file into string
function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      resolve(e.target.result); // full Base64 string
    };
    reader.onerror = function () {
      reject(new Error("Error reading image"));
    };
    reader.readAsDataURL(file);
  });
}

let currentImg;
// upload image button
const uploadImgBtn = document.getElementById("uploadImgBtn");
uploadImgBtn.addEventListener("click", async () => {
  console.log("pressed btn");
  const listingImg = document.getElementById("listingImageUpload").files[0];
  console.log(listingImg);
  const encodedImg = await readImageAsBase64(listingImg);
  console.log(encodedImg);
  currentImg = encodedImg;
  document.getElementById("listingImg").src = currentImg;
});

//PRELOADING FOOD FROM THE EXISITNG LISTING
function loadFoods(listingRecord) {
  const foodArray = listingRecord.foods;

  const foodsList = document.getElementById("foodsList");
  foodsList.innerHTML = "";

  foodArray.forEach((food) => {
    const foodBar = document.createElement("div");
    foodBar.id = "foodBar";
    foodBar.className =
      "flex justify-between rounded-lg text-light-brown border-[#9b9b9b] border-solid border";
    foodBar.innerHTML = `
            <!-- left -->
            <div id="foodBarName" class="py-2 px-4">${food.name}</div>
            <!-- right -->
            <div id="" class="flex">
                <!-- minus -->
                <div id="minusQuant" class="py-2 px-6 border-[#9b9b9b] border-solid border-l">-</div>
                <!-- quant -->
                <div id="itemQuant" class="py-2 px-8 border-[#9b9b9b] border-solid border-l">${food.quantity}</div>
                <!-- plus -->
                <div id="plusQuant" class="py-2 px-6 border-[#9b9b9b] border-solid border-l">+</div>
            </div>
        `;
    foodBar.querySelector("#minusQuant").addEventListener("click", () => {
      if (food.quantity > 0) food.quantity -= 1;
      console.log("food array: ", foodArray);
      if (food.quantity == 0) {
        const index = foodArray.indexOf(food);
        foodArray.splice(index, 1);
        foodBar.remove();
      }
      loadFoods(listingRecord); //need to reload whenever we want to display updated data
    });

    foodBar.querySelector("#plusQuant").addEventListener("click", () => {
      food.quantity = food.quantity + 1;
      loadFoods(listingRecord); //need to reload whenever we want to display updated data
    });
    foodsList.appendChild(foodBar);
  });
}

//ADD FOOD FUNCTION
function addFood(listingRecord) {
  let foodArray = listingRecord.foods;
  console.log("foodsArray:", foodArray);

  const foodForm = document.getElementById("food-form");
  const formData = new FormData(foodForm);

  console.log("form data: ", formData.entries);

  let isValid = true;

  for (const [key, value] of formData.entries()) {
    console.log(`key: ${key}, value: ${value}`); //must use fieldData.get('key') to access the values - cannot use fieldData.key
    if (!value.trim()) isValid = false;
  }

  if (isValid) {
    const foodsList = document.getElementById("foodsList");
    const foodBar = document.createElement("div");

    foodBar.innerHTML += `
    <div id="foodBar" class="flex justify-between rounded-lg text-light-brown border-[#9b9b9b] border-solid border">
        <!-- left -->
        <div id="" class="py-2 px-4">${formData.get("name")}</div>
        <!-- right -->
        <div id="" class="flex">
            <!-- minus -->
            <div id="minusQuant" class="py-2 px-6 border-[#9b9b9b] border-solid border-l">-</div>
            <!-- quant -->
            <div id="itemQuant" class="py-2 px-8 border-[#9b9b9b] border-solid border-l">${formData.get("quantity")}</div>
            <!-- plus -->
            <div id="plusQuant" class="py-2 px-6 border-[#9b9b9b] border-solid border-l">+</div>
        </div>
    </div>
    `;

    const itemQuant = foodBar.querySelector("#itemQuant");
    let quantity = parseInt(formData.get("quantity"));

    foodArray.push({ name: formData.get("name"), quantity: quantity });
    let index = foodArray.length - 1;

    foodBar.querySelector("#minusQuant").addEventListener("click", () => {
      if (quantity > 0) {
        quantity -= 1;
        // itemQuant.textContent = quantity
        foodArray[index].quantity = quantity;
        loadFoods(listingRecord);
        console.log("foodArray:", foodArray);
        if (foodArray[index].quantity == 0) {
          foodArray.splice(index, 1);
          foodBar.remove();
        }
      }
    });
    foodBar.querySelector("#plusQuant").addEventListener("click", () => {
      if (quantity > 0) {
        quantity += 1;
        // itemQuant.textContent = quantity
        foodArray[index].quantity = quantity;
        loadFoods(listingRecord);
        console.log("foodArray:", foodArray);
      }
    });
    foodsList.appendChild(foodBar);
    closePopupWindow();
  } else {
    if (foodForm.querySelector(".form-error")) return;

    const error = document.createElement("div");
    error.className = "form-error text-red text-sm";
    error.textContent = "Required fields missing";

    foodForm.appendChild(error);
  }
}

// Function for changing the listing status and listing buttons shown on the page
function listingStatus(listingRecord) {
  let statusCircle = document.getElementById("statusCircle");
  let statusLabel = document.getElementById("statusLabel");
  let listingStatusButton = document.getElementById("listingStatusButton");

  if (listingRecord.status == "unlisted") {
    statusCircle.classList.remove("bg-green-500");
    statusCircle.classList.add("bg-gray-500");
    statusLabel.innerText = "Unlisted";
    listingStatusButton.innerText = "Re-list";
  } else if (listingRecord.status == "listed") {
    statusCircle.classList.remove("bg-gray-500");
    statusCircle.classList.add("bg-green-500");
    statusLabel.innerText = "Listed";
    listingStatusButton.innerText = "Unlist";
  }
}

async function initializePage() {
  data = await loadListingData();
  listingStatus(data);
  prefillForm(data);
  loadFoods(data);

  const form = `
    <form id="food-form" class="flex flex-col gap-4 mt-4 text-start">
    <div class="flex flex-col gap-1">
        <label>Name</label>
        <input type="text" name="name" placeholder="Gala apples" />
    </div>
    <div class="flex flex-col gap-1">
        <label>Quantity</label>
        <input type="text" name="quantity" placeholder="2" />
    </div>
    </form>`;

  const deleteConfirmButton = [
  {
    label: "yes, delete",
    color: "box-color-0",
    hover: "hover-outline",
    onClick: async () => {
      // console.log("Deleted")
      const response = await fetch(`/DeleteListing/${listingID}`, {
        method: "PUT",
      }); //soft delete

      if (response.ok) {
        newNotifForConnectedUsers(listingID, NotifTypes.DELETED);
        displaySimpleWindow("Deleted!");
        window.location.href = "/sell"
  }
      },
  },
  {
    label: "no, cancel",
    color: "box-color-1",
    hover: "hover-outline",
    onClick: () => console.log("Cancelled"),
  },
];


  const buttons = [
    {
      label: "Add food",
      color: "box-color-0",
      hover: "hover-outline",
      onClick: () => addFood(data), // turn into anonymous function because we need to pass data into addFood, but not call it right away
    },
    {
      label: "cancel",
      color: "box-color-1",
      hover: "hover-outline",
      onClick: closePopupWindow,
    },
  ];

  //add food button - add inside initialize function because we need the data object
  document.getElementById("addFoodButton").addEventListener("click", () => {
    displaySimpleWindow("Add food" + form, buttons, false);
  });

  //delete button
  document.getElementById("deleteButton").addEventListener("click", async () => {
    displaySimpleWindow("Are you sure you want to delete this listing?", deleteConfirmButton);
  });

}

initializePage();



//Unlist or Re-list button
document
  .getElementById("listingStatusButton")
  .addEventListener("click", async () => {
    const listingStatusButton = document.getElementById("listingStatusButton");
    const buttonValue = listingStatusButton.innerText;
    console.log(buttonValue);
    const response = await fetch(`/UpdateListingStatus/${listingID}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ buttonValue }),
    });

    if (response.ok) {
      const notifType =
        buttonValue == "Unlist"
          ? NotifTypes.UNLISTED
          : NotifTypes.LISTING_AVAILABLE_AGAIN;
      newNotifForConnectedUsers(listingID, notifType);

      alert("Listing status updated");
      initializePage();
    }
  });

//cancel button
document.getElementById("cancelButton").addEventListener("click", () => {
  window.location.href = "/sell";
});

//save button
document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!data) {
    console.log("data not loaded yet");
    return;
  }

  //get back the updated values
  const updatedTitle = document.getElementById("editTitle").value;
  const updatedLocation = document.getElementById("editLocation").value;
  const updatedPrice = document.getElementById("editPrice").value;
  const updatedContact = document.getElementById("editContact").value;
  const updatedDescription = document.getElementById("editDescription").value;
  const updatedProduce = document.getElementById("editProduce").checked;
  const updatedMeat = document.getElementById("editMeat").checked;
  const updatedDairy = document.getElementById("editDairy").checked;
  const updatedBakedGoods = document.getElementById("editBakedGoods").checked;
  const updatedCookedMeals = document.getElementById("editCookedMeals").checked;
  const updatedImage = currentImg;

  let updatedCategory = [];
  updatedProduce == true ? updatedCategory.push("Produce") : undefined;
  updatedMeat == true ? updatedCategory.push("Meat") : undefined;
  updatedDairy == true ? updatedCategory.push("Dairy") : undefined;
  updatedBakedGoods == true ? updatedCategory.push("Baked Goods") : undefined;
  updatedCookedMeals == true ? updatedCategory.push("Cooked Meals") : undefined;

  const response = await fetch(`/EditListing/${listingID}`, {
    method: "PUT",
    headers: { "content-type": "application/json" }, //metadata about the request
    body: JSON.stringify({
      //wrapping in a single object
      updatedTitle: updatedTitle,
      updatedLocation: updatedLocation,
      updatedPrice: updatedPrice,
      updatedContact: updatedContact,
      updatedDescription: updatedDescription,
      updatedCategory: updatedCategory,
      updatedFoods: data.foods,
      updatedImage: updatedImage,
    }),
  });
  if (response.ok) {
    alert("Listing saved!");
    initializePage();
  }
});
