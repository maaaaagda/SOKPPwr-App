var express = require('express');
var router = express.Router();
var sess;
var Promise = require('bluebird');

function renderFormData(req, res, renderData) {
  var getConn = Promise.promisify(req.getConnection, {context: req});
  getConn()
  .then(function(connection) {
    var query = Promise.promisify(connection.query, {context: connection});
    return query("SELECT * FROM rodzajkursu");
  }, function(err) {
    console.log("Error in performing mysql query : %s " + err);
    res.statusCode = 404; // upsssssss sth went wrong
  }).then(function(rows) {
      renderData["courseKinds"] = rows;
      var getConn = Promise.promisify(req.getConnection, {context: req});
      getConn()
      .then(function(connection) {
        var query = Promise.promisify(connection.query, {context: connection});
        return query("SELECT * FROM semestr");
      }, function(err) {
        console.log("Error in performing mysql query : %s " + err);
        res.statusCode = 404; // upsssssss sth went wrong
      })
      .then(function(rows) {
        renderData["courseSemesters"] = rows;
        console.log(renderData);
        res.render('first_add', renderData);
      });
    })
}

router.get('/', function(req, res, next) {
  renderFormData(req, res, {});
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
  sess.data = data;

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
         console.log(sess.data);
         renderFormData(req, res, {errors, courseNameEmpty,courseCodeNotValid, session: sess.data} )
       } else {
          res.render('second_add');
       }
     });
  }, function(err) {
      console.log("Error in performing mysql query : %s " + err);
      res.statusCode = 404; // upsssssss sth went wrong
  });

});

module.exports = router;
