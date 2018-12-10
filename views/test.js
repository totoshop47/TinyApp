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

function urlsForUser(id) {
  var userID;
  var ulrInfo;
  for(var userId in users) {
    if(userId.id === id) {
      userID = id;
    }
  }
  for(var info in urlDatabase) {
    if(info.userID === userID) {
      ulrInfo = info;
    }
  }
  return ulrInfo;
}

<% for(var userCheck in urls) { %>
  <% if(userCheck[userID] === userId) { %>
    <% for(var short in urls) { %>
    <li>
      <form method="POST" action="/urls/<%= short %>/delete">
        <a href= <%= urls[short].longUrl %>><%= short %></a> <%= ` ->  ${urls[short].longUrl}` %>
        <a href="urls/<%= short %>"> - Edit</a>
        <button type="submit">Delete</button>
      </form>
    </li>
    <% } %>
  <% } else { %>
    <h2>Please Login or Sign up for your own shortened websites :)</h2>
  <% } %>
<% } %>

