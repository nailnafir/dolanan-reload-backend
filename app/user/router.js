var express = require('express');
var router = express.Router();
const { viewSignIn, actionSignIn, actionSignOut } = require('./controller');

router.get('/', viewSignIn);
router.post('/', actionSignIn);
router.get('/sign-out', actionSignOut);

module.exports = router;
