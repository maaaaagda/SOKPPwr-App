var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

  res.render('join_app_congrats', {titl: 'Hello::***:'});

});

module.exports = router;
