const cookieSession = require('cookie-session');
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');


function checkEmail(email) { // passing Email from users data to check any registrated Email there already
  for(var key in users) {
    if(users[key]["email"] === email) {
      return true;
    }
  }
  return false;
}

function urlsForUser(idCheck) { // with id from users data find url infomations from urlDatabase
  var foundID;
  var urlsInfo;

  for(var userId in users) {
    if(users[userId].id === idCheck) {
      foundID = idCheck;
    }
  }
  for(var info in urlDatabase) {
    if(urlDatabase[info].userID === foundID) {
      urlsInfo = urlDatabase[info];
    }
  }
  return urlsInfo;
}

function generateRandomString() { // generate random string+numbers for userID or shortenedURL
  var rString = "";
  var alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    rString += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }
  return rString;
}

function getUserObj(emailInput) { // grab information from users data by Email
  for(var key in users) {
    if(users[key].email === emailInput) {
      return users[key];
    }
  }
  return users[key];
}

// app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { userID: "sndd67",
              longUrl: "http://www.lighthouselabs.ca"},

  "9sm5xK": { userID: "user2RandomID",
              longUrl: "http://www.google.com"}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$foFw6r9OSMGenMEdVRNBVO35DLfenfIcwnaD59fHcijivYjR0agDm"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$rqQl/norHgL1uGt1D85Lo.LadWI1b8GzybR56gkcFWr3j2/XZQ9jm"
  },
  "sndd67": {
    id: "sndd67",
    email: "test@test.com",
    password: "$2b$10$9wP3ae9tCB1AqUbmyW71eu6Zh3XYISO20cEvrhYDm11kf6Bk6BNBy"
  }
};

app.get("/", (req, res) => {

  res.send("<html><body><a href='/urls'>To IndexPage</a></body></html>");
});

app.get("/urls/register", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];

  const templateVars = {
    urls: urlDatabase,
    user: user,
  }
  res.render("registration", templateVars);
});

app.post("/urls/register", (req, res) => {
  const randomID = generateRandomString(); // random string+numbers for id (not for the shortenedURL !!)
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  if(email !== "" && password !== "") {  // Email and password input shouldn't be empty
    if(checkEmail(email)) {              // check Email overlapping, send error message if so
      res.status(400).send('The Email taken by someone else already.. try different one :(');
    } else {
      users[randomID] = {id: randomID, email, password};
      req.session.user_id = randomID;
      res.redirect('/urls');
    }
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
  const userId = req.session.user_id;
  const user = users[userId];

  const templateVars = {
    urls: urlDatabase,
    user: user,
  }
  res.render("urls_login", templateVars);
});

app.post("/urls/login", (req, res) => {
  const userObj = getUserObj(req.body.email);

  if(req.body.email === userObj.email && bcrypt.compareSync(req.body.password, userObj.password)) { // using input Email to compare password from users data
    req.session.user_id = userObj.id;
    res.redirect("/urls");
  } else {
    res.status(403).send('Forbidden : Wrong Email or Password :(');
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.clearCookie("session.sig");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const user = users[req.session.user_id];

  const templateVars = {
    urls: urlDatabase,
    user: user,
    userId: req.session.user_id || null,
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const longURL = req.body.longURL;

  const templateVars = {
    urls: urlDatabase,
    user: user,
    userId: userId,
    shortURL: req.params.id,
    longURL: longURL,
  }

  if(userId && userId !== undefined) { // session has to be there to add new URLs
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  const longURL = req.body.longURL;
  const userID = urlDatabase[req.params.id].userID;

  if(userID !== userId){
    res.redirect("/urls");
    } else {
      urlDatabase[req.params.id].longUrl = req.body.longURL;
      res.redirect("/urls");
    }
  });

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const userID = urlDatabase[req.params.id].userID;

  if(userID === userId) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.redirect("/urls");
  }
});

app.get("/urls/:id", (req, res) => {

  const userId = req.session.user_id;
  const user = users[userId];
  const userID = urlDatabase[req.params.id].userID;

  const templateVars = {
    urls: urlDatabase,
    user: user,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longUrl,
  };

  if(userId && userId !== undefined && userId === userID) {  // to edit URLs check id from users data with userID from urlDatabase
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  const sUrl = generateRandomString(); // random string+numbers for shortenURL (not for the id!!)
  const userId = req.session.user_id;
  urlDatabase[sUrl] = {userID: userId, longUrl: req.body.longURL}

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longUrl;

  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
