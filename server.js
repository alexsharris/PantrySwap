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

app.use(express.static("src"))
app.use(express.static("."))

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
      listing: String, // _id of the related listing
      createdAt: { type: Date, default: Date.now }, // create a timestamp like (X hours ago)
    },
  ],
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
    type: [String],
    enum: ["Produce", "Meat", "Dairy", "Cooked Meals", "Baked goods"],
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
app.set("view engine", "ejs");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(db);
  console.log("Connected to MongoDB!");
  app.listen(port, () => {
    console.log("server's up!");
  });
}


app.get("/sell", (req, res) => {
  res.render("sellListings.ejs");
});


app.get("/buy", (req, res) => {
  res.render("buyListings.ejs")
})


app.get("/sellerListings", async (req, res) => {
  try {
    const listings = await ListingModel.find({seller: req.session.UserID});
    res.json(listings);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Server error"});
  }
});


app.get("/loadListings", async (req, res) => {
  let filter = {}
  try{
    const listings = await ListingModel.find(filter)
    if (listings.length == 0) return res.status(404).send("No listings found.")
    res.send(listings)
  }
  catch (error){
    console.log(error)
  }
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Login route

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
        res.redirect("/home");
      }
      // if password doesnt match
      else res.status(401).send("Invalid credentials");
    }
    // if user email doesnt exist in the DB
    else res.status(401).send("Invalid credentials");
  } catch (error) {
    console.log(error);
    res.status(500).send("Login failed");
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
    const user = await UserModel.create({ name: NewUserName, password: HashedPassword, email: NewUserEmail });

    // setting up the session for the new user
    req.session.email = NewUserEmail;
    req.session.UserID = user._id;

    if (req.body.RememberSignup) {
      // we can keep the cookie if remember me checked for 2 weeks in milliseconds
      req.session.cookie.maxAge = 14 * 24 * 3600 * 1000;
    }

    res.redirect("/home");
  }
  catch(error){

    console.log(error);
    res.status(500).send("registration failed");

  }
    

});

//serve the edit listing page
app.get('/EditListing', (req, res) => {
  res.render('editListingPage.ejs')
})

//delete listing route - soft deleting only
app.delete('/DeleteListing/:listingID', async (req, res) => {
  const listingID = req.params.listingID
  try {
    const listingRecord = await ListingModel.findOne({_id:listingID})
    listingRecord.status = "deleted"
    await listingRecord.save()
    res.sendStatus(200)
  }catch(error){
    console.log(error)
    res.status(500).send('Listing could not be deleted.')
  }
})

//Unlist Listing route
app.put('/UnlistListing/:listingID', async (req, res) => {
  const listingID = req.params.listingID
  try{
    const listingRecord = await ListingModel.findOne({_id:listingID})
    listingRecord.status = "unlisted"
    await listingRecord.save()
    res.sendStatus(200)
  }
  catch(error){
    console.log(error);
    res.status(500).send('Could not unlist listing')
  }
})

//load one listing
app.get('/LoadListing/:listingID', async (req, res) => {
  const listingID = req.params.listingID
  try{
    const listingRecord = await ListingModel.findOne({_id: listingID})
    res.status(200).send(listingRecord)
  }
  catch(error){
    console.log(error);
    res.status(500).send('Could not load listing')
  }
})

//Save Listing route
app.put('/EditListing/:listingID', async (req, res) => {
  const listingID = req.params.listingID
  const {newImage, newTitle, newLocation, newPrice, newContact, newDescription, newCategory} = req.body
  try{
      const listingRecord = ListingModel.findOne({_id: listingID})
      
      if (newImage) listingRecord.image = newImage
      if (newTitle) listingRecord.title = newTitle
      if (newLocation) listingRecord.location = newLocation
      if (newPrice) listingRecord.price = newPrice
      if (newContact) listingRecord.contact = newContact
      if (newDescription) listingRecord.description = newDescription
      if (newCategory) listingRecord.category = newCategory
  }
  catch(error){
    console.log(error);
    res.status(500).send('Edit listing form could not be saved.')
  }
})
