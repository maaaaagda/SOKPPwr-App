var express = require('express');
var router = express.Router();
var sess;
/* GET home page. */

router.get('/', function(req, res, next) {
    sess = req.session;
    sess.userID = 1;
    res.render('index', {titl: 'Hello::***:'});
});

module.exports = router;
