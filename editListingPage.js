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
    document.getElementById('editBakedGoods').checked = listingRecord.category.includes('Baked goods')? true : false
    document.getElementById('editCookedMeals').checked = listingRecord.category.includes('Cooked Meals')? true : false
}

function loadFoods(){
    
}


async function initializePage(){
    const listing = await loadListingData()
    prefillForm(listing)
}

initializePage()

