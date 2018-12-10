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

function urlsForUser(idCheck) {
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
  "b2xVn2": { userID: "sndd67",// <- so this thing has to be matched with .... users[userID from urlDatabase].id
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
    id: "sndd67",// <-------------- this!!
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
  let userId = req.cookies.user_id;
  let user = users[userId];
  // const userID = urlDatabase[req.params.id].userID;
  // const urlsInfo = urlsForUser(userId);

  if(!userId) {
    userId = null;
  }
  let templateVars = {
    urls: urlDatabase,
    user: user,
    userId: userId,
    // // userID: userID,
    // urlsInfo: urlsInfo,
    // longURL: urlsInfo.longUrl,
  };
  // if(userId !== undefined) {
  res.render("urls_index", templateVars);
  // } else {
  //   res.redirect("/urls");
  // }
  // console.log(userId);
  // console.log(user.email);
  // console.log(user.id);

});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const longURL = req.body.longURL;

  let templateVars = {
    urls: urlDatabase,
    user: user,
    // id: user.id,
    userId: userId,
    shortURL: req.params.id,
    longURL: longURL,
  }

  if(userId && userId !== undefined) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.post("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const longURL = req.body.longURL;
  const userID = urlDatabase[req.params.id].userID;

  if(userID !== userId){
    res.redirect("/urls");   // what user typed in from /urls/ucxDTv goes to req.body.longURL and save it to urlDatabase[ucxDTv.id].longUrl
    } else {
      urlDatabase[req.params.id].longUrl = req.body.longURL;
      res.redirect("/urls");
    }
  });

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  const longURL = req.body.longURL;
  const userID = urlDatabase[req.params.id].userID;

  if(userID !== userId){
    res.redirect("/urls");   // what user typed in from /urls/ucxDTv goes to req.body.longURL and save it to urlDatabase[ucxDTv.id].longUrl
    } else {
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
    }
});

app.get("/urls/:id", (req, res) => {

  const userId = req.cookies.user_id;
  const user = users[userId];
  const userID = urlDatabase[req.params.id].userID;

  let templateVars = {
    urls: urlDatabase,
    user: user,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longUrl,
  };

  if(userId && userId !== undefined && userId === userID) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  var sUrl = generateRandomString();
  var userId = req.cookies.user_id;
  urlDatabase[sUrl] = {userID: userId, longUrl: req.body.longURL}
  // urlDatabase[gRandom].userID = gRandom;
  // urlDatabase[gRandom].longUrl = req.body.longURL;
  // console.log(urlDatabase);
  // console.log(urlDatabase[gRandom]);
  // console.log(req.body.longURL, '<<<<<<<<<<<<<<<< req.body.longURL');
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});