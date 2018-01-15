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
                        res.render('third_add', renderData);
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

  req.body = data;
  //sess.data = data;
  var data = sess.data;

  data.building = input.building;
  data.classroom = input.classroom;
  data.classesDay = input.classesDay;
  data.classesWeek = input.classesWeek;

  req.checkBody('building', buildingNameValid).notEmpty();
  req.checkBody('classroom', classroomNameValid).matches("/[a-zA-Z0-9]");
  req.getValidationResult()
   .then(function(result){
     var errors = result.array();
     console.log(errors);

     if(errors.length > 0) {
       const buildingNameNotValid = errors.find(el => el.msg === buildingNameValid);
       const classroomNameNotValid = errors.find(el => el.msg === classroomNameValid);
       console.log(sess.data);
       renderFormData(req, res, {errors, buildingNameNotValid, classroomNameNotValid, session: data} )
     } else {
        res.redirect('third_add');
     }
   })
 });
module.exports = router;
