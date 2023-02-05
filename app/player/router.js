var express = require('express');
var router = express.Router();
const { landingPage, detailPage, category } = require('./controller');

router.get('/landing', landingPage);
router.get('/detail/:id', detailPage);
router.get('/category', category);

module.exports = router;
