var express = require('express');
var router = express.Router();
var multer = require('multer');
var os = require('os');
const { dashboard, profile, editProfile, landingPage, detailPage, category, checkout, history, historyDetail } = require('./controller');
const { isLoginPlayer } = require('../middleware/auth');

router.get('/landing', landingPage);
router.get('/detail/:id', detailPage);
router.get('/category', category);
router.post('/checkout', isLoginPlayer, checkout);
router.get('/history', isLoginPlayer, history);
router.get('/history/detail/:id', isLoginPlayer, historyDetail);
router.get('/dashboard', isLoginPlayer, dashboard);
router.get('/profile', isLoginPlayer, profile);
router.put('/profile', isLoginPlayer, multer({ dest: os.tmpdir() }).single('image'), editProfile);

module.exports = router;
