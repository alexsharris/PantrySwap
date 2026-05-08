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
    
    const response = await fetch(`/CreateListing`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            title: updatedTitle,
            location: updatedLocation,
            price: updatedPrice,
            contact: updatedContact,
            description: updatedDescription,
            category: updatedCategory
        })
        })
    if (response.ok){
        alert('Listing created!')
        
        
    }
})
