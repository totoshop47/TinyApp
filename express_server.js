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
  "b2xVn2": { userID: "sndd67",
              longUrl: "http://www.lighthouselabs.ca"},

  "9sm5xK": { userID: "user2RandomID",
              longUrl: "http://www.google.com"}
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
  // console.log(urlDatabase[req.params], '<<<<<<<<<<<< longURL')
  // console.log(urlDatabase, '<<<<<<<<<<<< urls')
  // console.log(req.body.id, '<<<<<<<<<<<<< req.params.id')
  // let templateVars = {
  //   urls: urlDatabase,
  //   user: user,
  //   shortURL: req.params.id,
  //   longURL: urlDatabase[req.params.id].longUrl,
  // }

  res.send("<html><body><a href='/urls'>To IndexPage</a></body></html>");
});

app.get("/urls/register", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    user: user,
    // shortURL: req.params.id,
    // longURL: urlDatabase[req.params.id].longUrl,
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
    user: user,
    // shortURL: req.params.id,
    // longURL: urlDatabase[req.params.id].longUrl,
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
//
// Where did I finish yesterday? Updated template vars, it's set to loop and get the shortUrls and longUrls
// For specfic user and check by id.
//
app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    user: user,
    userId: userId,
    // shortURL: req.params.id,
    // longURL: urlDatabase[req.params.id].longUrl,
  }
  // console.log(users)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    user: user,
    // shortURL: req.params.id,
    // longURL: urlDatabase[req.params.id].longUrl,
  }
  if(userId){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id].longUrl = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];

  res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  let templateVars = {
    urls: urlDatabase,
    user: user,
    // shortURL: req.params.id,
    // longURL: urlDatabase[req.params.id].longUrl,
  };
  console.log(req.params.id, '<<<<<<<<<<<<<< req.params.id');
  console.log(urlDatabase[req.params.id].longUrl, '<<<<<<<<<<<<<< urlsDatabase[req.params.id]');
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  var gRandom = generateRandomString();
  urlDatabase[gRandom] = req.body.longURL;
  // console.log(urlDatabase[gRandom]);
  console.log(req.body.longURL, '<<<<<<<<<<<<<<<< req.body.longURL');
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});