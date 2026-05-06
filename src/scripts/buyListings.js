function displayListings(){
    listingHolder = document.getElementById("listingsHolder")
    for (let i = 0; i < 7; i++){
        let listingHTML = ""
        listingHTML += `
        <div class="mx-auto md:mx-0 flex flex-col rounded-2xl drop-shadow-xl border-2 border-gray-300 w-88 h-96 bg-white">
                <img src="/images/pantry_share_img_07.jpg" class="rounded-t-2xl h-3/5">
                <div class="flex flex-col gap-12 py-2 px-10">
                    <div>
                        <h2 class="font-bold text-xl">Whole Foods Bundle</h2>
                        <h4 class="text-orange font-semibold">$0.00</h4>
                    </div>
                    <div class="flex justify-between gap-2">
                        <button class="bg-orange rounded-xl py-2 mb-4 text-white font-semibold cursor-pointer">
                        View
                        </button>
                        <button class="bg-light-grey rounded-xl py-2 mb-4 text-black font-semibold cursor-pointer">
                        Edit
                        </button>
                    </div>
                    
                </div>
            </div>
        `
        listingDiv = document.createElement("div")
        listingDiv.innerHTML = listingHTML
        listingHolder.appendChild(listingDiv)
    }
}

displayListings()