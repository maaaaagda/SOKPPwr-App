/**
 * express module
 * @var
 */
var express = require('express');

/**
 * Express router to mount user related functions on.
 * @namespace indexRouter
 */
var router = express.Router();

/**
 * session variable
 * @var
 */
var sess;


/**
 * Render View Index
 * @name Index
 * @route {GET} /
 * @headerparam {Integer} userId unique identyficator of user
 */
router.get('/', function(req, res, next) {
    sess = req.session;
    sess.userID = 1;
    res.render('index', {titl: 'Hello::***:'});
});

module.exports = router;
