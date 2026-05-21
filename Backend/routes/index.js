const express  = require('express');
const router = express.Router();

const authRoute = require('./authRoute');
const userRoutes = require('./UserRoutes');
const {auth} = require('../Middleware/auth');

router.use('/auth', authRoute);
router.use('/user',auth, userRoutes);

module.exports = router;

