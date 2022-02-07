const express = require('express');
const isAuthMiddleware = require('../../middlewares/auth.js');

const router = express.Router();

router.get('/', isAuthMiddleware, (req, res) => res.render('private.hbs'));

module.exports = router;
