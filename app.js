

var express = require('express');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('books.db');

var bodyParser = require('body-parser')
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

db.serialize(function() {
 // db.run("CREATE TABLE books (TITLE VARCHAR(255), BOOK VARCHAR(255), PAGE VARCHAR(255), KEY INT)");


});

//db.close();

// Uses the ejs templating engine
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));

app.get('/',function(req,res){
    res.render('index', {qs: req.query});
});

app.post('/info', urlencodedParser, function(req,res){
	let db = new sqlite3.Database('books.db');
	var stmt = db.prepare("INSERT INTO books VALUES (?,?,?,?)");
	stmt.run(req.body.title, req.body.book, req.body.page, req.body.key);
	stmt.finalize();
		
	/*db.each("SELECT TITLE, BOOK, PAGE, KEY FROM books", function(err, row) {
      console.log(row.TITLE + row.BOOK + row.PAGE + row.KEY);
	});*/
    
    res.render('info', {data: req.body});
	db.close();
});

app.get('/update', urlencodedParser, function(req,res){
	let db = new sqlite3.Database('books.db');
	let data = [req.body.title, req.body.book, req.body.page, req.body.key, req.body.key]
	let sql = 'UPDATE books set TITLE = ?, BOOK = ?, PAGE = ?, KEY = ? WHERE KEY = ?';
	db.run(sql, data, function(err) {
	if (err) {
		return console.error(err.message);
	}});
	//var stmt = db.prepare("UPDATE books set TITLE = ?, BOOK = ?, PAGE = ?, KEY = ? WHERE KEY = ?");
	//stmt.run(req.body.title, req.body.book, req.body.page, req.body.key, req.body.key);
	//stmt.finalize();
		
	/*db.each("SELECT TITLE, BOOK, PAGE, KEY FROM books", function(err, row) {
      console.log(row.TITLE + row.BOOK + row.PAGE + row.KEY);
	});*/
    
	
    res.render('update', {qs: req.query});
	db.close();
});

app.get('/delete', urlencodedParser, function(req,res){
	let db = new sqlite3.Database('books.db');
	var stmt2 = db.prepare("DELETE FROM books WHERE key = ?");
	stmt2.run(req.body.key);
	stmt2.finalize();
		
	/*db.each("SELECT TITLE, BOOK, PAGE, KEY FROM books", function(err, row) {
      console.log(row.TITLE + row.BOOK + row.PAGE + row.KEY);
	});*/
    
	
    res.render('delete', {qs: req.query});
	db.close();
});


app.get('/books',function(req,res){
	    let db = new sqlite3.Database('books.db');
        res.write('<h2>' +  'BOOKS' + '</h2>');
		
	    /*db.each("SELECT TITLE, BOOK, PAGE, KEY FROM books", function(err, row) {
		   //res.write('<p>' + row.title + ": " + row.book + ": " + row.page + ": " + row.key + '</p>');
		   console.log(row.TITLE + row.BOOK + row.PAGE + row.KEY);
		   res.write('<p>' + row.TITLE + ": " + row.BOOK + ": " + row.PAGE + ": " + row.KEY + '</p>');
		});*/
	
		db.all("SELECT TITLE, BOOK, PAGE, KEY FROM books", function(err, rows){
		  for(var i=0; i<rows.length; i++){
			  console.log(i + "TITLE: " + rows[i].TITLE + "BOOK: " + rows[i].BOOK + "PAGE: " + rows[i].PAGE + "KEY: " + rows[i].KEY);
			  res.write('<p>' + rows[i].TITLE + ": " + rows[i].BOOK + ": " + rows[i].PAGE + ": " + rows[i].KEY + '</p>');
		  }	  
		});
		
		db.close()
});

//Go to localhost:3000
app.listen(3000);
