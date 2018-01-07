var express = require('express');
var router = express.Router();
var sess;
router.get('/', function(req, res, next) {
  res.render('second_add', {title: "Hello add"});
});

router.post('/', function(req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body));
  sess = req.session;
  req.getConnection(function (err, connection) {

      var data = {

          name        : sess.name,
          description : sess.description,
          price       : input.price
      };


      console.log(data);
    /*  var query = connection.query("INSERT INTO products set ? ",data, function(err, rows)
      {

        if (err)
            console.log("Error inserting : %s ",err );

        res.redirect('/');

      });*/

     // console.log(query.sql); get raw query

  });
  res.redirect('/');
});

module.exports = router;
