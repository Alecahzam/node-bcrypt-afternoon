require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const bodyParser = require("body-parser");
const ac = require("./auth_controller");
const tc = require("./treasure_controller");
const auth = require("./Middleware/authMiddleware");

const { SESSION_SECRET, CONNECTION_STRING } = process.env;
const app = express();
const port = 4000;

app.use(bodyParser.json());

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db connected");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

app.post("/auth/register", ac.register);
app.post("/auth/login", ac.login);
app.get("/auth/logout", ac.logout);
app.get("/api/treasure/dragon", tc.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, tc.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, tc.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, tc.getAllTreasure)

app.listen(port, () => console.log(`Listening on port ${port}`));
