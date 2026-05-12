document.addEventListener("DOMContentLoaded", async() => {
    const response = await fetch(`http://localhost:3000/loadListings`)
    const data = await response.json()
    // console.log(data)
    listingHolder = document.getElementById("listingsHolder")
    data.forEach((newListing) => {
        console.log(newListing)
        let listingHTML = ""
        const placeholderImg = "images/pantry_share_img_10.jpg"
        listingHTML += `
        <div class="mx-auto md:mx-0 flex flex-col rounded-2xl drop-shadow-xl border-2 border-gray-300 w-88 h-96 bg-white">
                <img src="${(newListing.image)?newListing.image: placeholderImg}" class="rounded-t-2xl h-3/5">
                <div class="flex flex-col gap-12 py-2 px-10">
                    <div>
                        <h2 class="font-bold text-xl">${newListing.title}</h2>
                        <h4 class="text-orange font-semibold">$${newListing.price}</h4>
                    </div>
                    <div class="flex justify-between gap-2">
                        <button class="bg-orange rounded-xl py-2 mb-4 text-white font-semibold cursor-pointer" id="${newListing._id}ViewBtn">
                        View
                        </button>
                        <button class="bg-light-grey rounded-xl py-2 mb-4 text-black font-semibold cursor-pointer hidden">
                        Edit
                        </button>
                    </div>
                    
                </div>
            </div>
        `
        listingDiv = document.createElement("div")
        listingDiv.innerHTML = listingHTML
        listingHolder.appendChild(listingDiv)
        document.getElementById(`${newListing._id}ViewBtn`).addEventListener('click', ()=> {
            console.log(newListing._id)
            window.location.assign(`http://localhost:3000/listingDetails/${newListing._id}`)
        })

        })

    })