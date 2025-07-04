require('dotenv').config();
const express = require("express");
const app = express();
const sql = require("./database");
const PORT = process.env.PORT || 3000; // Use process.env.PORT for deployment, fallback to 3000

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
  let update = await sql.updateRequest(request.params.requestID, request.body);
  response.send(update);
});

const listener = app.listen(PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
