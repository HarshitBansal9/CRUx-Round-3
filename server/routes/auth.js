const router = require('express').Router();
const passport = require('passport');
const CLIENT_URL = "https://stocks.harshitb.me"

router.get("/google", passport.authenticate('google', {
    scope: ['profile','email']
}));

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failed to login"
    })
})
router.get("/login/success", (req, res) => {  
    if (req.user) {
        req.session.user = req.user;
        res.status(200).json({
            success: true,
            message: "user login successful",
            user: req.session.user,
            cookies: req.cookies
        })
    }

})

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
})
router.get("/google/callback", passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed"
}))

module.exports = router;