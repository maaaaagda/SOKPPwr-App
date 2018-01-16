var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

  res.render('create_app_congrats');

});

module.exports = router;
