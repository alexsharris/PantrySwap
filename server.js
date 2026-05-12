// MONGO set up
require("dotenv").config();
const port = process.env.PORT || 5000;
const db = process.env.MONGO_URI;
const secret = process.env.SESSION_SECRET;



// storing sessions in a file
var session = require("express-session");
const FileStore = require("session-file-store")(session);

// bcrypt
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10; // How strong the hashing should be

const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

app.use(express.static("src"));
app.use(express.static("."));

// schema for users
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  city: String,
  savedItems: [String], // the idea is to store _id of documents in listedItems here
  listedItems: [String], // the idea is to store _id of documents in listedItems here
  notifications: [
    {
      message: String,
      hasSeen: Boolean,
      listing: String, // _id of the related listing
      createdAt: { type: Date, default: Date.now }, // create a timestamp like (X hours ago)
    },
  ],
  tutorials: {
    create: Boolean,
    search: Boolean,
    bookmark: Boolean,
  },
});

// schema of listings
const ListingsSchema = new mongoose.Schema({
  seller: String, // assigning _id from userSchema here
  image: String,
  title: String,
  price: Number,
  location: String,
  contact: String,
  description: String,
  category: {
    type: [
      {
        type: String,
        enum: ["Produce", "Meat", "Dairy", "Cooked Meals", "Baked Goods"],
      },
    ],
    required: true,
  },
  foods: [{ name: String, quantity: Number }],
  status: {
    type: String,
    enum: ["listed", "unlisted", "deleted"],
    default: "listed",
    required: true,
  },
});

const UserModel = mongoose.model("Users", UserSchema);

const ListingModel = mongoose.model("Listings", ListingsSchema);

// setting up session
app.use(
  session({
    store: new FileStore({
      path: "./sessions",
      secret: "keyboard cat", // optional to encrypt the session data
      retries: 1,
    }),
    secret: "my secret key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  }),
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

main().catch((err) => console.log(err));

async function main() {
  mongoose.connect(db)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
}

app.get("/sell", (req, res) => {
  res.render("sellListings.ejs");
});

app.get("/buy", (req, res) => {
  res.render("buyListings.ejs");
});

app.get("/sellerListings", async (req, res) => {
  try {
    const listings = await ListingModel.find({ seller: req.session.UserID });
    res.json(listings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/loadListings", async (req, res) => {
  let filter = {};
  try {
    const listings = await ListingModel.find(filter);
    if (listings.length == 0) return res.status(404).send("No listings found.");
    res.send(listings);
  } catch (error) {
    console.log(error);
  }
});

// Login routes

app.get("/Login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/Login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.emailLogin });

    // check if user with that email address exists
    if (user) {
      const PasswordMatched = await bcrypt.compare(
        req.body.passwordLogin,
        user.password,
      );

      // check if password matched set up the session
      if (PasswordMatched) {
        req.session.email = req.body.emailLogin;
        req.session.UserID = user._id;

        if (req.body.RememberLogin) {
          // we can keep the cookie if remember me checked for 2 weeks in milliseconds
          req.session.cookie.maxAge = 14 * 24 * 3600 * 1000;
        }
        //makes the redirect wait until the session is fully written to session file, because other routes like
        // user were still loading the previous user who was logged in
        // redirecting would be trigger without setting the session properly without this

        req.session.save(() => res.redirect("/buy"));
      }
      // if password doesnt match
      else res.status(401).json({ error: "Invalid credentials" });
    }
    // if user email doesnt exist in the DB
    else res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// signup route

app.post("/SignUp", async (req, res) => {
  const NewUserEmail = req.body.emailSignup;
  const NewUserName = req.body.name;
  const NewUserPassword = req.body.passwordSignup;

  // hash password to store it in DB
  const HashedPassword = await bcrypt.hash(NewUserPassword, SALT_ROUNDS);

  // create a new user in DB
  try {
    const user = await UserModel.create({
      name: NewUserName,
      password: HashedPassword,
      email: NewUserEmail,
      tutorials: { create: false, bookmark: false, search: false },
    });

    // setting up the session for the new user
    req.session.email = NewUserEmail;
    req.session.UserID = user._id;

    if (req.body.RememberSignup) {
      // we can keep the cookie if remember me checked for 2 weeks in milliseconds
      req.session.cookie.maxAge = 14 * 24 * 3600 * 1000;
    }
    //makes the redirect wait until the session is fully written to session file, because other routes like
    // user were still loading the previous user who was logged in.
    // redirecting would be trigger without setting the session properly without this

    req.session.save(() => res.redirect("/buy"));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "registration failed" });
  }
});

// setting up a middleware to protect the following routes for non-logged in users

function isAuthenticated(req, res, next) {
  if (req.session.UserID) next();
  else res.redirect("/Login");
}

// ==================================================================
// any route that needs protection for non-logged in users goes after this line
// ==================================================================

app.use(isAuthenticated);

//=========================================================================================
//This route handles connection to gemini to fill out the create listing form for the user
// Generated by Gemini
// only systemPrompt is written by me
// @author https://gemini.google.com/
//==========================================================================================
app.post("/api/chat", async (req, res) => {
  const { message, formData } = req.body;

  try {
    const user = await UserModel.findById(req.session.UserID);
    const userPhone = user?.phone || "not set";

    // Prepare the rules 
    const systemRules = `You are the "Pantry Swap Assistant," an expert in the Canadian food market and surplus reduction.

CORE CAPABILITIES:
1. FIELD SUGGESTIONS: Offer the user smart suggestions for Title, Location, Price (CAD), Description, and Categories based on Canadian marketplace trends and grocery data.
2. DYNAMIC FOOD LISTING: If a user mentions multiple items (e.g., "6 apples, 2 eggs"), track them as a structured list. If the user didn’t provide the quantity associated with each food, ask for the quantity.
3. AUTOMATED FILLING: Offer to fill the form for the user. 
   - CRITICAL: You must ask for explicit consent before updating (e.g., "Would you like me to populate the form with these details?"). 
   - Only provide the JSON update block AFTER the user says "Yes" or equivalent.

CORE CONSTRAINTS:
1. THE LOCATION RULE: The 'Location' field is currently empty. You MUST ask the user "Where is this item being listed?" or "What is your city/postal code?" before providing any pricing suggestions.
2. FOOD VALIDATION: Only allow food-related items. Reject non-food items (shoes, tech, etc.) politely.
3. CONTACT LOGIC: You have access to the user's primary phone number: [USER_PHONE]. Ask the user if they want to use this number or provide an alternative for the 'Contact' field.
4. SAFETY: Remind the user they must upload their own photo of the food. You cannot handle images.
5.CONVERSATIONAL PACING:
5.1. ONE AT A TIME: Do not ask multiple questions in a single response.
5.2. STEP-BY-STEP: Focus on gathering one piece of missing information (Quantity, Location, OR Contact) before moving to the next.
5.3. ACKNOWLEDGE & ASK: When the user provides an answer, acknowledge it briefly and then ask for the next required detail.
5.4. JSON DELAY: Only provide the [UPDATE_FORM] block once ALL fields (Title, Location, Price, Description, Category, Foods, Contact) are confirmed.

PRICING LOGIC:
- Once location is known, estimate the CAD price based on:
  a) Local Marketplace averages for similar items.
  b) Retail prices in that specific region minus a 40-60% surplus discount.
- If you cannot find a specific marketplace price, state that you are basing the suggestion on average retail minus the surplus discount.
- Explain the logic for each item (e.g., "I found a marketplace listing for $5, but for the other item, I used the retail price of $10 and applied a discount").

OUTPUT PROTOCOL:
- Be friendly and professional.
- You MUST ask for explicit consent before providing the form-update data.
- When consent is given, append this block:

[UPDATE_FORM]
{
  "title": "String",
  "location": "String",
  "price": Number,
  "description": "String",
  "category": ["Produce", "Meat", "Dairy", "Cooked Meals", "Baked Goods"],
  "foods": [{"name": "item name", "quantity": number}],
  "contact": "String"
}
`.replace("[USER_PHONE]", userPhone);

// setting up connection to gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// FORCE gemini-3-flash and v1 API
const model = genAI.getGenerativeModel({ 
        model: "gemini-3.1-flash-lite" 
    });
    //  THE FIX: Combine everything into one single prompt
    // We tell the AI "Here are your instructions" and "Here is the user's data" in one go.
    const combinedPrompt = `
      INSTRUCTIONS:
      ${systemRules}

      CONTEXT:
      User Home City: ${user?.city || "not set"}
      Current Form State: ${JSON.stringify(formData)}

      USER MESSAGE:
      ${message}
    `;

    //  Send it
    const result = await model.generateContent(combinedPrompt);
    const responseText = result.response.text();
    
    console.log("Gemini Success:", responseText);
    res.json({ text: responseText });

  } catch (error) {
    console.error("AI Error Detailed:", error);
    res.status(500).json({ error: "Sorry, I'm having trouble connecting to my brain. " + error.message });
  }
});





// get route for sending back user information for account page
app.get("/Account", async (req, res) => {
  try {
    res.sendFile(__dirname + "/account.html");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

app.get("/AccountData", async (req, res) => {
  try {
    const Data = await UserModel.findById({ _id: req.session.UserID });
    res.json(Data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

// put route to update the user document in the DB from the Account page
app.put("/ChangeData", async (req, res) => {
  try {
    const UserNewName = req.body.UserNewName;
    const UserNewEmail = req.body.UserNewEmail;
    const UserNewphone = req.body.UserNewphone;
    const UserNewCity = req.body.UserNewCity;

    // check if the value exists, if so, update the DB
    const UpdatedFields = {};
    // use the exact same names in the DB to add the corresponding values to in the dictionary
    if (UserNewName) UpdatedFields.name = UserNewName;
    if (UserNewEmail) UpdatedFields.email = UserNewEmail;
    if (UserNewphone) UpdatedFields.phone = UserNewphone;
    if (UserNewCity) UpdatedFields.city = UserNewCity;

    const user = await UserModel.findByIdAndUpdate(
      { _id: req.session.UserID },
      { $set: UpdatedFields },
    );
    res.json({ message: "Updated Successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

// add a route to delete an account
app.delete("/DeleteAccount", async (req, res) => {
  try {
    await UserModel.findByIdAndDelete({ _id: req.session.UserID });
    req.session.destroy(() => res.redirect("/Login"));
  } catch (error) {
    console.log(error);
    res.status(500).send("Delete failed!");
  }
});

// ==================================================================
// Routes for Create/Edit Listing
// ==================================================================
//serve the edit listing page
app.get("/EditListing", (req, res) => {
  res.render("editListingPage.ejs");
});

//delete listing route - soft deleting only
app.put("/DeleteListing/:listingID", async (req, res) => {
  const listingID = req.params.listingID;
  try {
    const listingRecord = await ListingModel.findOne({ _id: listingID });
    listingRecord.status = "deleted";
    await listingRecord.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Listing could not be deleted.");
  }
});

//Unlist Listing route
app.put("/UnlistListing/:listingID", async (req, res) => {
  const listingID = req.params.listingID;
  try {
    const listingRecord = await ListingModel.findOne({ _id: listingID });
    listingRecord.status = "unlisted";
    await listingRecord.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not unlist listing");
  }
});

//load one listing
app.get("/LoadListing/:listingID", async (req, res) => {
  const listingID = req.params.listingID;
  try {
    const listingRecord = await ListingModel.findOne({ _id: listingID });
    res.status(200).send(listingRecord);
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not load listing");
  }
});

// Serves the create listing page
app.get("/CreateListing", async (req, res) => {
  res.render("createListingPage.ejs");
});

//================================================================================
//to be deleted!
//================================================================================
app.get("/test", (req, res) => {
  res.render("test.ejs");
});

//Create listing route
app.post('/CreateListing', async (req, res) => {
  const {image, title, location, price, contact, description, category, foods} = req.body
  try{
      const newListing = await ListingModel.create({
        seller: req.session.UserID,
        image: image,
        title: title,
        location: location,
        price: price,
        contact: contact,
        description: description,
        category: category,
        foods: foods
      })

      await UserModel.findByIdAndUpdate(
        req.session.UserID, 
        {'$push': {listedItems: newListing._id}},
        {new: true}
      )
      res.sendStatus(200)
  }
  catch(error){
    console.log(error);
    res.status(500).send('Create listing form could not be saved.')
  }
});

//Save Listing route
app.put('/EditListing/:listingID', async (req, res) => {
  const listingID = req.params.listingID
  console.log('This is the req.body:', req.body);
  const {updatedImage, updatedTitle, updatedLocation, updatedPrice, updatedContact, updatedDescription, updatedCategory, updatedFoods} = req.body
  try{
      const listingRecord = await ListingModel.findOne({_id: listingID})
      
      if (updatedImage) listingRecord.image = updatedImage
      if (updatedTitle) listingRecord.title = updatedTitle
      if (updatedLocation) listingRecord.location = updatedLocation
      if (updatedPrice) listingRecord.price = updatedPrice
      if (updatedContact) listingRecord.contact = updatedContact
      if (updatedDescription) listingRecord.description = updatedDescription
      if (updatedCategory) listingRecord.category = updatedCategory
      if (updatedFoods) listingRecord.foods = updatedFoods
      
      await listingRecord.save()
      res.sendStatus(200)
  }
  catch(error){
    console.log(error);
    res.status(500).send("Edit listing form could not be saved.");
  }
});

//get current user info
app.get("/user", async (req, res) => {
  console.log("USER ROUTE HIT");
  console.log(req.session);

  try {
    if (!req.session.UserID) {
      return res.status(401).json({
        error: "No session",
      });
    }

    const currentUser = await UserModel.findById(req.session.UserID);

    if (!currentUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

//update user
app.put("/updateUser/:id", async (req, res) => {
  try {
    console.log(req.body);
    const updateFields = {};

    if (req.body?.["tutorials.search"] !== undefined) {
      updateFields["tutorials.search"] = req.body["tutorials.search"];
    }

    if (req.body?.["tutorials.create"] !== undefined) {
      updateFields["tutorials.create"] = req.body["tutorials.create"];
    }

    if (req.body?.["tutorials.bookmark"] !== undefined) {
      updateFields["tutorials.bookmark"] = req.body["tutorials.bookmark"];
    }

    if (req.body?.notifications !== undefined) {
      updateFields.notifications = req.body.notifications;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        error: "No valid fields provided for update",
      });
    }

    const updated = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.json(updated);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// get the bookmark or saved page
app.get("/bookmark", (req, res) => {
  res.sendFile(__dirname + "/savedPage.html");
});

// save a listing into users savedItems
// addToSet add an element to array if it doesnt exist in it already, ensures avoiding duplicates
app.post("/bookmarkListing/:id", async (req, res) => {
  try {
    const bookmarkedItem = req.params.id;
    const updatedUserInfo = await UserModel.findByIdAndUpdate(
      { _id: req.session.UserID },
      { $addToSet: { savedItems: bookmarkedItem } },
      { new: true }, // this line is needed to get the updated version and not the old one
    );
    res.json(updatedUserInfo.savedItems);
  } catch (error) {
    console.log(error);
    res.status(500).send("Unexpected server error!");
  }
});

// delete a listing from savedItems
app.post("/removeBookmark/:id", async (req, res) => {
  try {
    const unBookmarkedItem = req.params.id;
    const updatedUserInfo = await UserModel.findByIdAndUpdate(
      { _id: req.session.UserID },
      { $pull: { savedItems: unBookmarkedItem } },
      { new: true }, // this line is needed to get the updated version and not the old one
    );
    res.json(updatedUserInfo.savedItems);
  } catch (error) {
    console.log(error);
    res.status(500).send("Unexpected server error!");
  }
});

app.get("/tutorial", (req, res) => {
  res.render("tutorial.ejs");
});

// routes for rendering listing details page and loading it dynamically
app.get("/listingDetails/:id", async (req, res) => {
  try {
    const listing = await ListingModel.findById({ _id: req.params.id });
    const user = await UserModel.findById(
      { _id: listing.seller },
      { city: 1, name: 1 },
    );
    res.render("listingDetails", { listing, user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Unexpected server error!");
  }
});
