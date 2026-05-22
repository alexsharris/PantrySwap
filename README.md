# 2800-202610-DTC01


## Project Summary


<a href="https://github.com/SABZAK96/2800-202610-DTC01">
    <img src="https://github.com/SABZAK96/2800-202610-DTC01/blob/fd5c3f5aa5f497ca8c689c09b9f5dd8cff02e3bc/images/Pantry_Swap_Icon.png?raw=true" alt="PantrySwap Logo" align="Left" height="60" />
</a>

<h1>PantrySwap</h1>

[PantrySwap](https://github.com/SABZAK96/2800-202610-DTC01) is approaching the issues of food waste and insecurity with an app that allows users to list surplus food for other users to purchase at a discounted price, allowing those who would otherwise have food going to waste to take initiative to prevent it and those who have trouble affording food to have alternate sources for acquiring groceries.


## Table Of Contents

- [2800-202610-DTC01](#2800-202610-dtc01)
  - [Project Summary](#project-summary)
  - [Table Of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
    - [Front-End](#front-end)
    - [Back-End](#back-end)
    - [Database](#database)
    - [File Storage](#file-storage)
    - [Other Tools](#other-tools)
  - [File Contents](#file-contents)
  - [Limitations](#limitations)
  - [Installation Guide](#installation-guide)
    - [Requirements for Installation](#requirements-for-installation)
      - [Requirements](#requirements)
      - [API Keys required](#api-keys-required)
    - [Order of Installation](#order-of-installation)
    - [Confirguration](#confirguration)
  - [How to Use PantrySwap](#how-to-use-pantryswap)
    - [Signing up](#signing-up)
    - [Browse listings](#browse-listings)
    - [Selling/Listing Food](#sellinglisting-food)
    - [Creating a listing](#creating-a-listing)
    - [Editing a listing](#editing-a-listing)
    - [Saved listings](#saved-listings)
  - [Credits, References, and Licenses](#credits-references-and-licenses)
    - [Team](#team)
    - [Team Members:](#team-members)
  - [Usage of AI and APIs](#usage-of-ai-and-apis)
    - [Usage of AI](#usage-of-ai)
    - [Usage of APIs and other tools](#usage-of-apis-and-other-tools)
  - [Links](#links)
  - [Contact](#contact)


## Tech Stack
### Front-End
- Tailwind CSS
- EJS (templating engine)
- Web Components (custom elements)

### Back-End
- Express JS
- Express Sessions
- BCrypt
- CORS

### Database
- MongoDB
- Mongoose

### File Storage
- FileStore
- Multer


### Other Tools
- Geoapify API — proximity-based listing filtering
- Google Gemini API — AI listing assistant
- Dymo API — email validation at signup
- Nodemailer (Gmail SMTP) — OTP email delivery


## File Contents
```text 
.
├───images
│    ├───baked-goods.png
│    ├───baked-goods.svg
│    ├───bananas.svg
│    ├───bell-svgrepo-com.svg
│    ├───businessShark.jpg
│    ├───buy_page.png
│    ├───closeIcon.png
│    ├───cooked-meals.png
│    ├───cooked-meals.svg
│    ├───create_listing_page.png
│    ├───dairy.png
│    ├───dairy.svg
│    ├───edit_listing_page.png
│    ├───login_page.png
│    ├───meat.png
│    ├───meat.svg
│    ├───pantry_share_img_01.jpg
│    ├───pantry_share_img_02.jpg
│    ├───pantry_share_img_03.jpg
│    ├───pantry_share_img_04.jpg
│    ├───pantry_share_img_05.jpg
│    ├───pantry_share_img_06.jpg
│    ├───pantry_share_img_07.jpg
│    ├───pantry_share_img_08.jpg
│    ├───pantry_share_img_09.jpg
│    ├───pantry_share_img_10.jpg
│    ├───pantry_share_img_11.jpg
│    ├───pantry_share_img_12.jpg
│    ├───pantry_share_img_13.jpg
│    ├───pantry_share_img_14.jpg
│    ├───pantry_share_img_15.jpg
│    ├───Pantry_Swap_Icon.png
│    ├───Rectangle 9.jpg
│    ├───Rectangle_9.jpg
│    ├───saved_page.png
│    ├───sell_page.png
│    ├───tutorialBookmarkStep1.png
│    ├───tutorialBookmarkStep2.png
│    ├───tutorialCreateStep1.png
│    ├───tutorialCreateStep2.png
│    ├───tutorialCreateStep3.png
│    ├───tutorialSearchStep1.png
│    ├───tutorialSearchStep2.png
│    ├───vegetables.png
│    ├───vegetables.svg
├───public
│    ├───main.css
├───sessions
│
├───src
│   ├───components
│   │       ├───bookmarkButton.js
│   │       ├───listingSummaryCard.js
│   │       ├───navbar.js
│   │       ├───notificationButton.js
│   │
│   └───scripts
│           ├───account.js
│           ├───buyListings.js
│           ├───createListingPage.js
│           ├───dateTime.js
│           ├───editListingPage.js
│           ├───listingDetails.js
│           ├───login.js
│           ├───notificationSystem.js
│           ├───popupWindow.js
│           ├───savedPage.js
│           ├───sellerListings.js
│           ├───tutorials.js
│           ├───tutorialSystem.js
│
├───styles
│       ├───tailwind.css
│
├───views
│       ├───buyListings.ejs
│       ├───createListingPage.ejs
│       ├───editListingPage.ejs
│       ├───listingDetails.ejs
│       ├───sellListings.ejs
│
├───.gitignore
├───account.html
├───login.html
├───package-lock.json
├───package.json
├───README.md
├───savedPage.html
├───server.js
├───skeleton.html
├───styleViewCheatsheet.html

```

## Limitations
- Nodemailer relies on outbound SMTP, which is blocked on Render's free tier. OTP emails are therefore disabled on the hosted version of the app — use the demo account to skip email verification.
- Reviews cannot be deleted or updated at this time.
- Users will need to wait around 30 seconds in between their prompts with the AI chatbot feature due to heavy demand on the free-tier of the Gemini API, unless you want to use the paid tiers of Gemini.


## Installation Guide
### Requirements for Installation
#### Requirements
- Node.js (v18 or higher recommended)
- A MongoDB Atlas account (free tier works)
- A Gmail account with 2-Step Verification enabled (for App Passwords)
- API keys for Dymo and Google Gemini (see Configuration below)

#### API Keys required
  - MONGODB_URI — MongoDB connection string
  - SESSION_SECRET —  string for session encryption
  - DYMO_API_KEY — from https://dymo.com developer portal
  - GEMINI_API_KEY — from Google AI Studio
  - EMAIL_USER — Gmail address used to send OTP emails
  - EMAIL_PASS — Gmail App Password (not the regular Gmail password — generated from   Google Account → Security → App Passwords)


### Order of Installation
1. Clone the repository
2. In the project root, run : npm install
3. Create an .env file in the root with the following keys:
  MONGODB_URI=your_mongodb_connection_string
  SESSION_SECRET=your_session_secret
  DYMO_API_KEY=your_dymo_key
  GEMINI_API_KEY=your_gemini_key
  EMAIL_USER=your_gmail@gmail.com
  EMAIL_PASS=your_gmail_app_password
4. Start the server using one of these commands:
5. node server.js
6. nodemon server.js ( you have to install nodemon first globally)
7. Open your browser to  http://localhost:3000 


### Confirguration
- MongoDB Create a free cluster on MongoDB Atlas, whitelist your IP address, and paste the connection string into MONGODB_URI.
- Gmail App Password Go to your Google Account → Security → 2-Step Verification → App Passwords. Generate a password for "Mail" and paste it into EMAIL_PASS. Note: this is not your regular Gmail password.
- Dymo API Sign up at the Dymo developer portal and obtain an API key. A Standard plan or higher is required for MX record validation (a 30-day free trial is available).
- Google Gemini API Generate a key at Google AI Studio. The free tier is sufficient, though response speed may be slower under high load.
- Geoapify Geoapify is used directly on the client side — no API key setup in .env is required. If you need to replace or rotate the key, it can be found in the frontend JavaScript files.

## How to Use PantrySwap
### Signing up
<a href="https://github.com/SABZAK96/2800-202610-DTC01">
    <img src="https://github.com/SABZAK96/2800-202610-DTC01/blob/7b77424bff9022d6a3fa18c8cab80a67ae1f2d4b/images/login_page.png?raw=true" alt="" align="Left" height="" />
</a>

  1. Go to the login page and click "Sign Up"
  2. Enter your name and email — click "Send Code"to receive a 6-digit verification code
  3. Enter the code to verify your email, then set your password and create your account

### Browse listings
<a href="https://github.com/SABZAK96/2800-202610-DTC01">
    <img src="https://github.com/SABZAK96/2800-202610-DTC01/blob/7b77424bff9022d6a3fa18c8cab80a67ae1f2d4b/images/buy_page.png?raw=true" alt="" align="Left" height="" />
</a>

  - Filter by category or distance to find listings near you
  - Click any listing to view full details, contact info, and all the reviews submitted for a seller under each of their listings 
  - Save listings using the bookmark button

### Selling/Listing Food
<a href="https://github.com/SABZAK96/2800-202610-DTC01">
    <img src="https://github.com/SABZAK96/2800-202610-DTC01/blob/7b77424bff9022d6a3fa18c8cab80a67ae1f2d4b/images/sell_page.png?raw=true" alt="" align="Left" height="" />
</a>

  - Go to "Sell" to see your listings
  - Click "Create New" to list surplus food with a title, description, price, categories, and photos
  - Edit or unlist your listings at any time

### Creating a listing
<a href="https://github.com/SABZAK96/2800-202610-DTC01">
    <img src="https://github.com/SABZAK96/2800-202610-DTC01/blob/7b77424bff9022d6a3fa18c8cab80a67ae1f2d4b/images/create_listing_page.png?raw=true" alt="" align="Left" height="" />
</a>

  1. Go to the Sell page and click "Create New"
  2. Fill in the listing title, price, description, categories, and add food items with quantities
  3. Upload a photo and enter a pickup address
  4. Use the AI Assistant (button on the right) to help fill in your listing: 
  - describe your surplus food in natural language (e.g. "I have 3 cans of soup and some bread")
  - The AI gives you some suggestions and if you agree, it fills in the form fields automatically — title, description, categories, and food items with quantities
  - you can keep chatting to refine the listing before submitting
  5. Click Submit to publish your listing

### Editing a listing
<a href="https://github.com/SABZAK96/2800-202610-DTC01">
    <img src="https://github.com/SABZAK96/2800-202610-DTC01/blob/7b77424bff9022d6a3fa18c8cab80a67ae1f2d4b/images/edit_listing_page.png?raw=true" alt="" align="Left" height="" />
</a>

  1. On your Sell page, click "Edit" on any  listing
  2. Modify any fields — title, price, description, image, food items, or address
  3. Change the listing status between Listed and Unlisted to control visibility
  4. Save your changes

### Saved listings
<a href="https://github.com/SABZAK96/2800-202610-DTC01">
    <img src="https://github.com/SABZAK96/2800-202610-DTC01/blob/7b77424bff9022d6a3fa18c8cab80a67ae1f2d4b/images/saved_page.png?raw=true" alt="PantrySwap Logo" align="Left" height="" />
</a>

  - View all bookmarked listings in the "Saved" tab
  - Click "Browse Listings" if you haven't saved anything yet


## Credits, References, and Licenses
### Team
DTC-01

### Team Members: 
- [Rayne Choy](https://github.com/dennen14)
- [Alex Harris](https://github.com/alexsharris)
- [Flora Feng](https://github.com/flo-in-code)
- [Saba Zakeri Far](https://github.com/SABZAK96)
- [Oliver Wright](https://github.com/ollieiebc)


## Usage of AI and APIs
### Usage of AI
Google Gemini API Powers the in-app AI listing assistant. Users can describe their surplus food in natural language and Gemini generates a suggested title, description, categories, and item list. The assistant maintains a conversation so users can refine suggestions before submitting. Guardrails are in place to keep responses focused on food listing use cases.

### Usage of APIs and other tools
- Geoapify API Used on the client side to filter listings by proximity. Buyers can select a distance radius (e.g. 5 km, 10 km) and only see listings within that range of their location.
- Dymo API Used during account registration to validate that email addresses are deliverable, preventing fake or mistyped emails from being used to create accounts. Requires a Standard plan or higher.
- Nodemailer (Gmail SMTP) Sends 6-digit OTP verification codes to users during account registration to confirm ownership of their email address before account creation is completed.


## Links
* [Live App](https://two800-202610-dtc01.onrender.com/)
* [FigJam Board](https://www.figma.com/board/ztcflbiqPgPZqnyvVjCN1p/Projects-2800-Figjam?node-id=0-1&t=z8hzDYjMibnGLmZE-1)
* [Figma Design](https://www.figma.com/design/RwA4zW2t35ahzm4Kpj6rlZ/Comp-2800-Project?node-id=0-1&t=Nl24HDOeKQMqVzIr-0)
* [Source code](https://github.com/SABZAK96/2800-202610-DTC01)

## Contact
For general inquiries, please contact: dtc01.bcit@gmail.com 