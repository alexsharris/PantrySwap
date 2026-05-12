import {
  displaySimpleWindow,
  closePopupWindow,
  displayWindow,
} from "../scripts/popupWindow.js";

let foodArray = []

async function loadUserData(){
    const response = await fetch('/user')
    const userData = await response.json()
    console.log(userData);
    return userData
}


function prefillForm(userRecord){
    console.log(userRecord);
    document.getElementById('editLocation').value = userRecord.city || ""
    document.getElementById('editContact').value = userRecord.phone || ""
}


async function initializePage(){
    const data = await loadUserData()
    prefillForm(data)
}

initializePage()

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

const buttons = [
  {
    label: "Add food",
    color: "box-color-0",
    hover: "hover-outline",
    onClick: addFood,
  },
  {
    label: "cancel",
    color: "box-color-1",
    hover: "hover-outline",
    onClick: closePopupWindow,
  },
];

function addFood() {
  const foodForm = document.getElementById("food-form");
  const formData = new FormData(foodForm);

  console.log("form data: ", formData.entries)

  let isValid = true;

  for (const [key, value] of formData.entries()) {
    console.log(`key: ${key}, value: ${value}`); //must use fieldData.get('key') to access the values - cannot use fieldData.key
    if (!value.trim()) isValid = false;
  }

  if (isValid) {

    const foodsList = document.getElementById('foodsList')
    const foodBar = document.createElement('div')

    foodBar.innerHTML += `
    <div id="foodBar" class="flex justify-between rounded-lg text-light-brown border-[#9b9b9b] border-solid border">
        <!-- left -->
        <div id="" class="py-2 px-4">${formData.get('name')}</div>
        <!-- right -->
        <div id="" class="flex">
            <!-- minus -->
            <div id="minusQuant" class="py-2 px-6 border-[#9b9b9b] border-solid border-l">-</div>
            <!-- quant -->
            <div id="itemQuant" class="py-2 px-8 border-[#9b9b9b] border-solid border-l">${formData.get('quantity')}</div>
            <!-- plus -->
            <div id="plusQuant" class="py-2 px-6 border-[#9b9b9b] border-solid border-l">+</div>
        </div>
    </div>
    `
    
    const itemQuant = foodBar.querySelector('#itemQuant')
    let quantity = parseInt(formData.get('quantity'))

    foodArray.push({name: formData.get('name'), quantity: quantity})
    let index = foodArray.length - 1

    foodBar.querySelector('#minusQuant').addEventListener('click', () => {
        if (quantity > 0){
            quantity -= 1
            itemQuant.textContent = quantity
            foodArray[index].quantity = quantity
            if (foodArray[index].quantity == 0){
                foodArray.pop()
                foodBar.remove()
            }
        }
        
    })
    foodBar.querySelector('#plusQuant').addEventListener('click', () => {
        if (quantity > 0){
            quantity += 1
            itemQuant.textContent = quantity
            foodArray[index].quantity = quantity
        }
    })
    foodsList.appendChild(foodBar)
    closePopupWindow();

  } else {
    if (foodForm.querySelector(".form-error")) return;

    const error = document.createElement("div");
    error.className = "form-error text-red text-sm";
    error.textContent = "Required fields missing";

    foodForm.appendChild(error);
  }
}

//add food button
document.getElementById('addFoodButton').addEventListener('click', () => {
    
    displaySimpleWindow("Add food" + form, buttons, false)

})

//cancel button
document.getElementById('cancelButton').addEventListener('click', () => {
    window.location.href = "/sell"
})

//create button
document.querySelector('form').addEventListener('submit', async(event) => {
    event.preventDefault()
    //get back the updated values
    const updatedTitle = document.getElementById('editTitle').value 
    const updatedLocation = document.getElementById('editLocation').value
    const updatedPrice = document.getElementById('editPrice').value
    const updatedContact = document.getElementById('editContact').value
    const updatedDescription = document.getElementById('editDescription').value
    const updatedProduce = document.getElementById('editProduce').checked
    const updatedMeat = document.getElementById('editMeat').checked
    const updatedDairy = document.getElementById('editDairy').checked
    const updatedBakedGoods = document.getElementById('editBakedGoods').checked
    const updatedCookedMeals = document.getElementById('editCookedMeals').checked

    // //validate required fields not left blank
    if (foodArray.length == 0){
        alert('Please add a food item.')
        return
    } 

    let updatedCategory = []
    updatedProduce == true? updatedCategory.push("Produce") : undefined
    updatedMeat == true? updatedCategory.push("Meat") : undefined
    updatedDairy == true? updatedCategory.push("Dairy") : undefined
    updatedBakedGoods == true? updatedCategory.push("Baked Goods") : undefined
    updatedCookedMeals == true? updatedCategory.push("Cooked Meals") : undefined
    
    const response = await fetch(`/CreateListing`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            //seller is added in on the server.js
            title: updatedTitle,
            location: updatedLocation,
            price: updatedPrice,
            contact: updatedContact,
            description: updatedDescription,
            category: updatedCategory,
            foods: foodArray
        })
        })
    if (response.ok){
        alert('Listing created!')
        window.location.href = '/sell'
    }
})


