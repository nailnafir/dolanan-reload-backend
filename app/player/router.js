var express = require('express');
var router = express.Router();
const { dashboard, profile, landingPage, detailPage, category, checkout, history, historyDetail } = require('./controller');
const { isLoginPlayer } = require('../middleware/auth');

router.get('/landing', landingPage);
router.get('/detail/:id', detailPage);
router.get('/category', category);
router.post('/checkout', isLoginPlayer, checkout);
router.get('/history', isLoginPlayer, history);
router.get('/history/detail/:id', isLoginPlayer, historyDetail);
router.get('/dashboard', isLoginPlayer, dashboard);
router.get('/profile', isLoginPlayer, profile);

module.exports = router;
