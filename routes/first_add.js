var express = require('express');
var router = express.Router();
var sess;
router.get('/', function(req, res, next) {
  res.render('first_add', {title: "Hello add"});
});

router.post('/', function(req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body));
  sess = req.session;
  req.getConnection(function (err, connection) {

      var data = {

          name        : input.name,
          description : input.description,
      };

      sess.name = input.name;
      sess.description = input.description;
      console.log(data);
    /*  var query = connection.query("INSERT INTO products set ? ",data, function(err, rows)
      {

        if (err)
            console.log("Error inserting : %s ",err );

        res.redirect('/');

      });*/

     // console.log(query.sql); get raw query
     res.redirect('/second_add');
  });

});

module.exports = router;
