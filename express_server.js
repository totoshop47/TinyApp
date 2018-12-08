var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

function checkEmail(email) {
  for(var key in users) {
    if(users[key]["email"] === email) {
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

function getUserObj(emailInput) {
  for(var key in users) {
    if(users[key].email === emailInput) {
      return users[key];
    }
  }
  return false;
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
  },
  "sndd67": {
    id: "sndd67",
    email: "test@test.com",
    password: "test"
  }
};

app.get("/", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    user: user
  }
  res.send("<html><body><a href='/urls'>To IndexPage</a></body></html>");
});

app.get("/urls/register", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    user: user
  }
  res.render("registration", templateVars);
});

app.post("/urls/register", (req, res) => {
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
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.get("/urls/login", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    user: user
  }
  res.render("urls_login", templateVars);
});

app.post("/urls/login", (req, res) => {
  userObj = getUserObj(req.body.email)
  if(req.body.email === userObj.email && req.body.password === userObj.password) {
    res.cookie("user_id", userObj.id);
    res.redirect("/urls");
  } else {
    res.status(403).send('Forbidden');
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    user: user
  }
  // console.log(users)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    user: user
  }
  res.render("urls_new", templateVars);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];

  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["user_id"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});