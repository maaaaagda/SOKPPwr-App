var express = require('express');
var router = express.Router();
var userID = 1;
router.get('/', function(req, res, next) {
  req.getConnection(function(err,connection) {
      var query = connection.query('SELECT min(wniosek.ID) as ID, min(KodPrzedmiotu) as KodPrzedmiotu, min(NazwaKursu) as NazwaKursu, min(nazwaRodzajuKursu) as nazwaRodzajuKursu, min(Rocznik) as Rocznik, min(nazwaSemestru) as nazwaSemestru, count(WniosekID) as numberOfStudents FROM wniosek JOIN kurs on kurs.ID = wniosek.KursID JOIN rodzajkursu ON kurs.Rodzaj = rodzajkursu.ID JOIN semestr ON semestr.ID = wniosek.Semestr LEFT JOIN student_wniosek ON student_wniosek.WniosekID = wniosek.ID GROUP BY wniosek.ID', function(err,rows) {

          if(err) {
            console.log("Error Selecting in mysql" );
          }
          else {
            res.render('join_application', {titl: 'Dołącz do wniosku o kurs poprawkowy', rows: rows});
          }


        });
    });
});

router.get('/:id', function(req, res, next) {

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
