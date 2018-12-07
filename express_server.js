var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

function checkEmail(email) {
  for(var i in users) {
    if(users[i]["email"] === email) {
      return true;
    }
    return false;
  }
}

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

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


app.get("/", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.send("<html><body><a href='/urls'>To IndexPage</a></body></html>");
  console.log('Cookies: ', req.cookies);
  console.log('Signed Cookies: ', req.signedCookies);
  console.log(templateVars.urls);
  console.log(users);
});

app.get("/register", (req, res) => {

  res.render("registration");
});

app.post("/register", (req, res) => {
  let randomID = generateRandomString();
  let id = randomID;
  let email = req.body.email;
  let password = req.body.password;
  if(email !== "" && password !== "" && !checkEmail(email)) {
    users[randomID] = {id, email, password};
    res.cookie("user_id", id);
    res.redirect('/urls');
  } else {
    res.status(400).send('Bad request');
  }
  // console.log(checkEmail(email));
  // console.log(req.cookies);
  // users[randomID][id] = id;
  // req.body.id = randomID;
  // users[randomID].email = req.body.email;
  // users[randomID].password = req.body.password;
  // console.log(req.body);
  // console.log(req.body.email);
  // console.log(req.body.password);
  // console.log(users);
  // res.redirect("/urls");
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
  // let templateVars = {
  //   urls: urlDatabase,
  //   username: req.cookies["username"]
  // };
  res.render("urls_index", users);
});

app.get("/urls/new", (req, res) => {
  // let templateVars = {
  //   urls: urlDatabase,
  //   username: req.cookies["username"]
  // };
  res.render("urls_new", users);
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
  // let templateVars = {
  //   shortURL: req.params.id,
  //   longURL: urlDatabase[req.params.id],
  //   username: req.cookies["username"]
  // };
  res.render("urls_show", users);
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