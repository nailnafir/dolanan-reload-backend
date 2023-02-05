var express = require('express');
var router = express.Router();
var multer = require('multer');
var os = require('os');

const { signUp, signIn } = require('./controller');

router.post('/signUp', multer({ dest: os.tmpdir() }).single('image'), signUp);
router.post('/signIn', signIn);

module.exports = router;
