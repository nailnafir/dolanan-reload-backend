var express = require('express');
var router = express.Router();
var multer = require('multer');
var os = require('os');
const { index, viewCreate, actionCreate } = require('./controller');

router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', multer({ dest: os.tmpdir() }).single('image'), actionCreate);
// router.get('/edit/:id', viewEdit);
// router.put('/edit/:id', actionEdit);
// router.delete('/delete/:id', actionDelete);

module.exports = router;
