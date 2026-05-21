const express = require('express');
const passport = require('../config/passport');

const router = express.Router();


// STEP 1
router.get(
  '/google',

  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);


// STEP 2
router.get(
  '/google/callback',

  passport.authenticate('google', {
    failureRedirect: '/login'
  }),

  (req, res) => {

    res.send("Google Login Successful");

  }
);

module.exports = router;