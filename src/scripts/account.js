

// this function will fetch informtaion from DB to present as the default placeholders in the form
async function GetDefaultInformation(){

    const ServerResponse = await fetch("/AccountData");
    const ServerResponseJson = await ServerResponse.json();

    // assign user's name and city
    document.getElementById("UserCurrentName").innerHTML = ServerResponseJson.name;
    document.getElementById("Usercity").innerHTML = ServerResponseJson.city || "Unknown";
    
    // assign the information retrieved to each placeholder
    document.getElementById("UserNewName").placeholder = ServerResponseJson.name;
    document.getElementById("UserNewEmail").placeholder = ServerResponseJson.email;

    // some of the info could not exist if they user is recently signed up 
    if(ServerResponseJson.phone){
    document.getElementById("UserNewphone").placeholder = ServerResponseJson.phone;}
    if(ServerResponseJson.city){
    document.getElementById("UserNewCity").placeholder = ServerResponseJson.city;}
}
GetDefaultInformation();

// if user clicks on save button the information should be sent to server
const form = document.getElementById("AccountForm")
form.addEventListener("submit", async(e)=>{
    e.preventDefault();
    const Name = document.getElementById("UserNewName").value;
    const Email = document.getElementById("UserNewEmail").value;
    const Phone = document.getElementById("UserNewphone").value;
    const City = document.getElementById("UserNewCity").value;

    // should be defined outside if statements to be accessible
    let UserNewName, UserNewEmail, UserNewphone, UserNewCity;
    
    // only send the fields that are actually updated (not falsey or empty)
    if(Name) {UserNewName = Name;}
    if(Email) {UserNewEmail = Email;}
    if(Phone) {UserNewphone = Phone;}
    if(City) {UserNewCity = City;}

    const Response = await fetch("/ChangeData", {
      method: "PUT",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserNewName, UserNewEmail, UserNewphone, UserNewCity}),
    });
    await GetDefaultInformation();
});

// add delete functionality
document.getElementById("DeleteAccount").addEventListener("click", async()=>{
    const Response = await fetch("/DeleteAccount", { method: "DELETE" });
}) 