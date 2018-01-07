var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   port     : '3303',
   user     : 'root',
   password : 'pass',
   database : 'demo'
 });

 connection.connect();

 connection.query('SELECT * from products', function(err, rows, fields) {
   if (!err)
     console.log('The solution is: ', rows);
   else
     console.log('Error while performing Query.');
 });

  connection.end();
