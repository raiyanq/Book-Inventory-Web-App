

var express = require('express');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('books.db');

var bodyParser = require('body-parser')
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS books (TITLE VARCHAR(255), BOOK VARCHAR(255), PAGE VARCHAR(255), KEY INT PRIMARY KEY)");
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
	let data = [req.body.title, req.body.book, req.body.page, req.body.key]
	let sql = 'INSERT INTO books VALUES (?,?,?,?)';
	db.run(sql, data, function(err) {
	if (err) {
		return console.error(err.message);
	}});
    
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
	
	console.log(`Row(s) updated: ${this.changes}`);
    res.render('update', {qs: req.query});
	db.close();
});

app.get('/delete', urlencodedParser, function(req,res){
	let db = new sqlite3.Database('books.db');
	let data = [req.body.key]
	let sql = 'DELETE FROM books WHERE key = ?';
	db.run(sql, data, function(err) {
	if (err) {
		return console.error(err.message);
	}});
	console.log(`Row(s) deleted ${this.changes}`);
    res.render('delete', {qs: req.query});
	db.close();
});


app.get('/books',function(req,res){
	    let db = new sqlite3.Database('books.db');
        res.write('<h2>' +  'BOOKS' + '</h2>');
	
		db.all("SELECT TITLE, BOOK, PAGE, KEY FROM books", function(err, rows){
		  for(var i=0; i<rows.length; i++){
			  console.log(i + "TITLE: " + rows[i].TITLE + "BOOK: " + rows[i].BOOK + "PAGE: " + rows[i].PAGE + "KEY: " + rows[i].KEY);
			  res.write('<p>' + rows[i].TITLE + ": " + rows[i].BOOK + ": " + rows[i].PAGE + ": " + rows[i].KEY + '</p>');
		  }	  
		//need this last line or it hangs because of something about res.write works as an asynchronosu function
		res.end() 
		});
		
		db.close();

		
});

//Go to localhost:3000
app.listen(3000);