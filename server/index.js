// const cookieSession = require('cookie-session');
const express = require('express');
const passport = require('passport');
const authRoute = require("./routes/auth");
const session = require('express-session');
const portfolioRoute = require("./routes/portfolio");
const stockRoute = require("./routes/stock");
const passportSetup = require('./passport');
const app = express();
cors = require('cors');


// app.use(cookieSession({
//     name:"session",
//     keys:["key1","key2"],
//     maxAge:24*60*60*1000
// }))


app.use(express.urlencoded());
app.use(session({ secret: "secret" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
}))


// when we are on auth url ,automatically calls auth route
app.use("/auth", authRoute);
app.use("/stock", stockRoute);
app.use("/portfolio", portfolioRoute);



app.listen("5000", () => {
    console.log("Server is running on port 5000")
})