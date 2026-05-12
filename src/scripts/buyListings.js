document.addEventListener("DOMContentLoaded", async() => {
    const response = await fetch(`http://localhost:3000/loadListings`)
    const data = await response.json()
    // console.log(data)
    listingHolder = document.getElementById("listingsHolder")
    data.forEach((newListing) => {
        if(newListing.status == "listed") {
            console.log(newListing)

            //clone template
            const template = document.getElementById("listingTemplate");
            const clone = template.content.cloneNode(true);

            //fill data
            clone.querySelector(".listingTitle").textContent = newListing.title;
            if (newListing.image){
                clone.querySelector(".listingImage").src = newListing.image;
            }
            else{
                clone.querySelector(".listingImage").src = "images/pantry_share_img_10.jpg"
            }
            clone.querySelector(".listingPrice").textContent = `$${newListing.price}`;
            clone.querySelector(".viewButton").id = `${newListing._id}ViewBtn`;
            
            listingHolder.appendChild(clone)
            document.getElementById(`${newListing._id}ViewBtn`).addEventListener('click', ()=> {
                console.log(newListing._id)
                window.location.assign(`http://localhost:3000/listingDetails/${newListing._id}`)
            })
        }   
    })
})