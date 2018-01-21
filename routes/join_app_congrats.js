/**
 * express module
 * @var
 */
var express = require('express');
/**
 * Express router to mount user related functions on.
 * @namespace joinApplicationCongratsRouter
 */
var router = express.Router();

/**
 * Render View joinApplication
 * @name JoinAplicationCongrats
 * @route {GET} /join_app_congrats
 */
router.get('/', function(req, res, next) {
  res.render('join_app_congrats', {titl: 'Hello::***:'});
});

module.exports = router;
