var express = require('express');
var router = express.Router();
var sess;
var Promise = require('bluebird');

function renderFormData(req, res, renderData) {
  var getConn = Promise.promisify(req.getConnection, {context: req});
  getConn().then(function(connection) {
            var query = Promise.promisify(connection.query, {context: connection});
            return query("SELECT * FROM dzientygodnia");
          }, function(err) {
            console.log("Error in performing mysql query : %s " + err);
            res.statusCode = 404; // upsssssss sth went wrong
          }).then(function(rows) {
              renderData["days"] = rows;
              var getConn = Promise.promisify(req.getConnection, {context: req});
              getConn().then(function(connection) {
                        var query = Promise.promisify(connection.query, {context: connection});
                        return query("SELECT * FROM parzystosctygodnia");
                      }, function(err) {
                        console.log("Error in performing mysql query : %s " + err);
                        res.statusCode = 404; // upsssssss sth went wrong
                      }).then(function(rows) {
                        renderData["week"] = rows;
                        console.log(renderData);
                        res.render('create_app_3', renderData);
                      });
            })
}


router.get('/', function(req, res, next) {
  renderFormData(req, res, {});
});

router.post('/', function(req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body));
  sess = req.session;
  const buildingNameValid = "Nazwa budynku nie może zawierać znaków specjalnych!";
  const classroomNameValid = "Nazwa sali nie może zawierać znaków specjalnych!";
  const startOfClassesMsg= "Błędny czas! Wpisz czas w formacie hh.mm ";
  const endOfClassesMsg= "Błędny czas! Wpisz czas w formacie hh.mm ";

  //sess.data = data;
  var data = sess.data;

  data.building = input.building;
  data.classroom = input.classroom;
  data.classesDay = input.classesDay;
  data.classesWeek = input.classesWeek;
  data.startOfClasses = input.startOfClasses;
  data.endOfClasses = input.endOfClasses;

  req.body = data;

  req.checkBody('building', buildingNameValid).matches(/^$|^[a-zA-Z\d\.\s]+$/);
  req.checkBody('classroom', classroomNameValid).matches(/^$|^[a-zA-Z\d\.\s]+$/);
  req.checkBody('startOfClasses', startOfClassesMsg).matches(/^([01]?[0-9]|2[0-3]):[0-5][05]$/);
  req.checkBody('endOfClasses', endOfClassesMsg).matches(/^([01]?[0-9]|2[0-3]):[0-5][05]$/);
  req.getValidationResult()
   .then(function(result){
     var errors = result.array();
     console.log(errors);

     if(errors.length > 0) {
       const buildingNameNotValid = errors.find(el => el.msg === buildingNameValid);
       const classroomNameNotValid = errors.find(el => el.msg === classroomNameValid);
       const startOfClassesNotValid = errors.find(el => el.msg === startOfClassesMsg);
       const endOfClassesNotValid = errors.find(el => el.msg === endOfClassesMsg);

       renderFormData(req, res, {errors, buildingNameNotValid, classroomNameNotValid, startOfClassesNotValid, endOfClassesNotValid, session: data} )
     } else {
        sess.data = data;
        console.log(sess.data);
        res.redirect('create_app_congrats');
     }
   })
 });
module.exports = router;
