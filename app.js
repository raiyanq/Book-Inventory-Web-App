

var express = require('express');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var bodyParser = require('body-parser')
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

db.serialize(function() {
  db.run("CREATE TABLE books (TITLE VARCHAR(255), BOOK VARCHAR(255), PAGE VARCHAR(255), KEY INT)");


});

//db.close();

// Uses the ejs templating engine
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));

app.get('/',function(req,res){
    res.render('index', {qs: req.query});
});

app.post('/info', urlencodedParser, function(req,res){
	var stmt = db.prepare("INSERT INTO books VALUES (?,?,?,?)");
	stmt.run(req.body.title, req.body.book, req.body.page, req.body.key);
	stmt.finalize();
	
	db.close();
	
	 db.each("SELECT TITLE, BOOK, PAGE, KEY FROM books", function(err, row) {
      console.log(row.TITLE + row.BOOK + row.PAGE + row.KEY);
	});
  
  
    res.render('info', {data: req.body});
});
//Got to localhost:3000
app.listen(3000);
