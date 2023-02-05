var express = require('express');
var router = express.Router();
var multer = require('multer');
var os = require('os');

const { signUp } = require('./controller');

router.post('/signUp', multer({ dest: os.tmpdir() }).single('image'), signUp);

module.exports = router;
