var express = require('express');
var router = express.Router();
var sess;
var Promise = require('bluebird');
var userID = 1; //when no errors change it to sess.userID
function renderFormData(req, res, renderData) {
  sess = req.session;
  var getConn = Promise.promisify(req.getConnection, {context: req});
  getConn().then(function(connection) {
            var query = Promise.promisify(connection.query, {context: connection});
            return query("SELECT wz.ID, wz.ProwadzacyID as IDProwadzacego, wz.OpiekunID as IDOpiekuna, wz.ZgodaProwadzacego, wz.ZgodaOpiekuna, wz.StudentID, n.Nazwisko as NazwiskoProwadzacego, n.Imie as ImieProwadzacego, n.Discriminator as DP, o.Nazwisko as NazwiskoOpiekuna, o.Imie as ImieOpiekuna, o.Discriminator as DO FROM wynikzapytania wz INNER JOIN nauczycielakademicki n ON wz.ProwadzacyID = n.ID INNER JOIN nauczycielakademicki o ON wz.OpiekunID = o.ID WHERE StudentID='"+userID+"'");
          }, function(err) {
            console.log("Error in performing mysql query : %s " + err);
            res.statusCode = 404; // upsssssss sth went wrong
          }).then(function(rows) {
            renderData["inquiries"] = JSON.stringify(rows);
            renderData["inq_len"] = rows.length;
            res.render('second_add', renderData);
            })
}

router.get('/', function(req, res, next) {
  renderFormData(req, res, {});
});

router.post('/', function(req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body));
  sess = req.session;
  var data = sess.data;
  data.teacherName = input.teacherName;
  data.teacherSurname = input.teacherSurname;
  sess.data = data;
  var getConn = Promise.promisify(req.getConnection, {context: req});
  getConn().then(function(connection) {
            var query = Promise.promisify(connection.query, {context: connection});
            return query("SELECT n.ID as teacherID FROM wynikzapytania wz JOIN nauczycielakademicki n ON wz.ProwadzacyID = n.ID WHERE wz.StudentID='"+userID+"' AND n.Imie='"+data.teacherName+"' AND n.Nazwisko='"+userID+"' LIMIT 1");
            },function(err) {
              console.log("Error in performing mysql query : %s " + err);
              res.statusCode = 404; // upsssssss sth went wrong
            }).then(function(rows) {
              if(rows[0]) {
                data.teacherID = rows[0].teacherID;
              }
              else {
                data.teacherID = "";
              }
              sess.data = data;
              res.redirect('/second_add');
              })

});

module.exports = router;
