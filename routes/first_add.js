var express = require('express');
var router = express.Router();
var sess;
var Promise = require('bluebird');


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
  const nameRequired = "Nazwa kursu jest obowiązkowa!";
  const codeExistsNot = "Podany kod przedmiotu nie istnieje!";
  var codeExists;

  var data = {

      courseCode      : input.courseCode,
      courseName      : input.courseName,
      courseECTS      : input.courseECTS,
      courseKind      : input.courseKind,
      courseSemester  : input.courseSemester,
      courseYear      : input.courseYear
  };
  req.body = data;


  var getConn = Promise.promisify(req.getConnection, {context: req});
  getConn().then(function(connection) {
    var query = Promise.promisify(connection.query, {context: connection});
    return query("SELECT COUNT(*) codeExists FROM kurs WHERE kurs.KodPrzedmiotu='"+data.courseCode+"' LIMIT 1");
  }).then(function(rows) {
    codeExists = rows[0].codeExists;
    req.checkBody('courseCode', codeExistsNot ).custom(() => codeExists == 1);
    req.checkBody('courseName', nameRequired ).notEmpty();
    req.getValidationResult()
     .then(function(result){
       var errors = result.array();
       console.log(errors);
       if(errors.length > 0) {
         const courseNameEmpty = errors.find(el => el.msg === nameRequired);
         const courseCodeNotValid = errors.find(el => el.msg === codeExistsNot);

         res.render ('first_add', {errors, courseNameEmpty,courseCodeNotValid } )
       } else {
          res.render('second_add');
       }

     });

  }, function(err) {
      console.log("Error in performing mysql query : %s " + err);
      res.statusCode = 404; // upsssssss sth went wrong
  }).then();

     sess.data = data;

});

module.exports = router;
