//GRAB THE ID FROM THE URL 
// const params = new URLSearchParams(window.location.search)
// const listingID = params.get('id') // this should be passed in to the url once a user clicks on edit a listing from the my listing page
const listingID = '69fa70e043a7f4dbfc8616fa' //hard coding the listing ID for now until later

async function loadListingData(){
    //fetch foods
    const response = await fetch(`/LoadListing/${listingID}`)
    const listingRecord = await response.json() 
    console.log(listingRecord);
    return listingRecord
}

function prefillForm(listingRecord){
    console.log(listingRecord);
    console.log(listingRecord.category)
    document.getElementById('editTitle').value = listingRecord.title
    document.getElementById('editLocation').value = listingRecord.location
    document.getElementById('editPrice').value = listingRecord.price
    document.getElementById('editContact').value = listingRecord.contact
    document.getElementById('editDescription').value = listingRecord.description
    document.getElementById('editProduce').checked = listingRecord.category.includes('Produce')? true : false
    document.getElementById('editMeat').checked = listingRecord.category.includes('Meat')? true : false
    document.getElementById('editDairy').checked = listingRecord.category.includes('Dairy')? true : false
    document.getElementById('editBakedGoods').checked = listingRecord.category.includes('Baked Goods')? true : false
    document.getElementById('editCookedMeals').checked = listingRecord.category.includes('Cooked Meals')? true : false
}

function loadFoods(listingRecord){
    const foodsArray = listingRecord.foods

    const foodsList = document.getElementById('foodsList')
    foodsList.innerHTML = ""

    foodsArray.forEach((food) => {
        const foodBar = document.createElement('div')
        foodBar.id = "foodBar"
        foodBar.className = "flex justify-between rounded-lg text-light-brown border-[#9b9b9b] border-solid border"
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
        `
        foodBar.querySelector("#minusQuant").addEventListener("click", () => {
            if (food.quantity > 0) food.quantity = food.quantity - 1
            console.log("food quantity:", food.quantity);
            loadFoods(listingRecord) //need to reload whenever we want to display updated data
        })

        foodBar.querySelector('#plusQuant').addEventListener("click", () => {
            food.quantity = food.quantity + 1
            loadFoods(listingRecord) //need to reload whenever we want to display updated data
        })
        foodsList.appendChild(foodBar)
    })
}



async function initializePage(){
    const data = await loadListingData()
    prefillForm(data)
    loadFoods(data)
}

initializePage()




//delete button
document.getElementById('deleteButton').addEventListener('click', async () => {
    const response = await fetch(`/DeleteListing/${listingID}`, {method: "PUT"}) //soft delete
    if (response.ok) {
        alert('Listing Deleted!')
    }

})

//Unlist button
document.getElementById('unlistButton').addEventListener('click', async () => {
    const response = await fetch(`/UnlistListing/${listingID}`, {method: "PUT"})
    if (response.ok){
        alert('Listing unlisted!')
    }
})

//cancel button
document.getElementById('cancelButton').addEventListener('click', () => {
    window.location.href = "/sell"
})

//save button
document.getElementById('saveButton').addEventListener('click', async() => {
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

    updatedCategory = []
    updatedProduce == true? updatedCategory.push("Produce") : undefined
    updatedMeat == true? updatedCategory.push("Meat") : undefined
    updatedDairy == true? updatedCategory.push("Dairy") : undefined
    updatedBakedGoods == true? updatedCategory.push("Baked Goods") : undefined
    updatedCookedMeals == true? updatedCategory.push("Cooked Meals") : undefined
    
    const response = await fetch(`/EditListing/${listingID}`, {
        method: "PUT",
        headers: { "content-type": "application/json" }, //metadata about the request
        body: JSON.stringify({ //wrapping in a single object
            updatedTitle: updatedTitle,
            updatedLocation: updatedLocation,
            updatedPrice: updatedPrice,
            updatedContact: updatedContact,
            updatedDescription: updatedDescription,
            updatedCategory: updatedCategory
        })

        })
    if (response.ok){
        alert('Listing saved!')
        initializePage()
    }
})
