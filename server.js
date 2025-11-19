require('dotenv').config();
const express = require("express");
const app = express();
const sql = require("./database");
const PORT = process.env.PORT || 3000; // Use process.env.PORT for deployment, fallback to 3000

// CORS and security headers for Tableau extensions
app.use((req, res, next) => {
  // Allow Tableau to load the extension from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Tableau extensions need to be in an iframe - don't block with X-Frame-Options
  // Or use ALLOWALL for Tableau extensions
  res.removeHeader('X-Frame-Options');
  
  // Content Security Policy for Tableau extensions
  res.setHeader('Content-Security-Policy', "frame-ancestors *;");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function(request, response) {
  response.render("index");
  sql.getTechnicians();
  
});

app.get("/request/:requestID", async function(request, response) {
  let data = await sql.getRequest(request.params.requestID);
  let techs = await sql.getTechnicians();
  response.render("request", {request: data, techs});
});

app.post("/update/:requestID", async function(request, response) {
  try {
    let update = await sql.updateRequest(request.params.requestID, request.body);
    // Send the result as a string "true" or "false" so it can be properly passed through the dialog
    response.send(update === true ? "true" : "false");
  } catch (err) {
    console.error("Error updating request:", err);
    response.status(500).send("false");
  }
});

const listener = app.listen(PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
