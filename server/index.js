// const cookieSession = require('cookie-session');
const express = require('express');
const passport = require('passport');
const authRoute = require("./routes/auth");
const portfolioRoute = require("./routes/portfolio");
const stockRoute = require("./routes/stock");
const passportSetup = require('./passport');
const app = express();
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
const pool = require("./db.ts");
cors = require('cors');
app.use(expressSession({
    store: new pgSession({
      pool : pool,                // Connection pool
      tableName : 'session'
    }),
    secret: 'secret',
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  }));

app.use(express.urlencoded());
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());


// when we are on auth url ,automatically calls auth route
app.use("/auth", authRoute);
app.use("/stock", stockRoute);
app.use("/portfolio", portfolioRoute);



app.listen("5000", () => {
    console.log("Server is running on port 5000")
})