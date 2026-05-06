async function loadFoods(){
    const listingID = '69fa71cf666b8660c4a2a1ff'
    //fetch foods
    const response = await fetch(`/LoadListing/${listingID}`)
    const listingRecord = await response.json() 
    console.log(listingRecord);
}