var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


function generateRandomString() {
  var rString = "";
  var alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    rString += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));

  return rString;
}
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
    let templateVars = {
      urls: urlDatabase,
      username: req.cookies["username"]
    };
  res.send("<html><body><a href='/urls'>To IndexPage</a></body></html>");
    // Cookies that have not been signed
  console.log('Cookies: ', req.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  // console.log(req.body)
  // console.log(req.body.username);
  // console.log(req.cookies)
  // console.log(req.signedCookies)

  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  // console.log(req.body)
  // console.log(req.cookies)
  // console.log(req.signedCookies)

  res.redirect("/urls");
})

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/:id", (req, res) => {
  // console.log("keyData:  " + req.params.id)
  // console.log("userInput : " + req.body.longURL);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  // console.log(urlDatabase[req.params.shortURL]);
  delete urlDatabase[req.params.id];

  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);  // debug statement to see POST parameters
  // let shortURL = generateRandomString();
  // let longURL = req.body.longURL;
  urlDatabase[generateRandomString()] = req.body.longURL;
  // res.render("urls_index", templateVars);
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});