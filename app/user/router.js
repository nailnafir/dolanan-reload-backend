var express = require('express');
var router = express.Router();
const { viewSignIn } = require('./controller');

router.get('/', viewSignIn);

module.exports = router;
