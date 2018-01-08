var express = require('express');
var router = express.Router();
var sess;
router.get('/', function(req, res, next) {
  req.getConnection(function(err,connection) {
      connection.query('SELECT * FROM rodzajkursu', function(err,rows) {

          if(err) {
            console.log("Error Selecting in mysql" );
            res.redirect('/'); /*upsss sth went wrong */
          }
          else {
            connection.query('SELECT * FROM semestr', function(err,rows1) {

                if(err) {
                  console.log("Error Selecting in mysql" );
                  res.redirect('/'); /*upsss sth went wrong */
                }
                else {
                  res.render('first_add', {titl: 'Dołącz do wniosku o kurs poprawkowy', courseKinds: rows, courseSemesters: rows1
                });
              }
          });
        }
    });
  });
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
