var express = require('express');
var router = express.Router();
const { landingPage } = require('./controller');

router.get('/landing-page', landingPage);

module.exports = router;
