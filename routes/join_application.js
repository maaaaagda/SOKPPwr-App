/**
 * express module
 * @var
 */
var express = require('express');
/**
 * Express router to mount user related functions on.
 * @namespace joinApplicationRouter
 */
var router = express.Router();
/**
 * session variable
 * @var
 */
var sess;
/**
 * userId variable
 * @var
 */
var userID;

/**
 * Render View joinApplication
 * @name JoinAplication
 * @route {GET} /join_application
 * @headerparam userId unique identyficator of user
 * @headerparam  getConnection connection to model
 */
router.get('/', function(req, res, next) {
  sess = req.session;
  userID = sess.userID;
  console.log('FDVD'+userID);
  req.getConnection(function(err,connection) {
      var query = connection.query('SELECT min(wniosek.ID) as ID, min(KodPrzedmiotu) as KodPrzedmiotu, min(NazwaKursu) as NazwaKursu, min(nazwaRodzajuKursu) as nazwaRodzajuKursu, min(Rocznik) as Rocznik, min(nazwaSemestru) as nazwaSemestru, count(WniosekID) as numberOfStudents FROM wniosek JOIN kurs on kurs.ID = wniosek.KursID JOIN rodzajkursu ON kurs.Rodzaj = rodzajkursu.ID JOIN semestr ON semestr.ID = wniosek.Semestr LEFT JOIN student_wniosek ON student_wniosek.WniosekID = wniosek.ID WHERE wniosek.ID NOT IN (SELECT WniosekID FROM student_wniosek WHERE StudentID=?) GROUP BY wniosek.ID;',userID, function(err,rows) {

          if(err) {
            console.log("Error Selecting in mysql" );
          }
          else {
            res.render('join_application', {titl: 'Dołącz do wniosku o kurs poprawkowy', rows: rows});
          }


        });
    });
});

/**
 * Render View joinApplication
 * @name JoinAplicationId
 * @route {GET} /join_application/:id
 * @routeParam {id} id of application student want to join
 * @headerparam {Integer} userId unique identyficator of user
 * @headerparam {Connection} getConnection connection to model
 */
router.get('/:id', function(req, res, next) {
  sess = req.session;
  userID = sess.userID;
  var id = req.params.id;
  req.getConnection(function(err,connection) {

        connection.query('INSERT INTO student_wniosek (StudentID, WniosekID) VALUES (?, ?)',[userID, id], function(err,rows) {

            if(err){
              console.log("Error Selecting in mysql" + err);
              res.redirect('/'); /*upsss sth went wrong */
            }
            else {
              connection.query('SELECT * FROM wniosek JOIN kurs on kurs.ID = wniosek.KursID JOIN rodzajkursu ON kurs.Rodzaj = rodzajkursu.ID JOIN semestr ON semestr.ID = wniosek.Semestr WHERE wniosek.ID=?',[id], function(err,rows) {

                  if(err){
                      console.log("Error Selecting in mysql" );
                  }
                  res.render('join_app_congrats',{titl:"title",data:rows});

                });
            }

          });
    });
});
module.exports = router;
