var express = require('express');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('books.db');

var bodyParser = require('body-parser')
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//creates the table at the start of the application if it doesn't exist
db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS books (TITLE VARCHAR(255), BOOK VARCHAR(255), PAGE INT, KEY INT PRIMARY KEY)");
  db.close();
});

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
		res.send(err.message);
		return;
	}
	else{
		res.render('insertinfo', {data: req.body});
	}
	});
    
	db.close();
});
//when the button is clicked from index loads update form
app.get('/update', urlencodedParser, function(req,res){

    res.render('update', {qs: req.query});

});
//called when the update post request is sent, db is updated and the details of record updated are shown
app.post('/update', urlencodedParser, function(req,res){
	let db = new sqlite3.Database('books.db');
	let data = [req.body.title, req.body.book, req.body.page, req.body.key, req.body.key]
	let sql = 'UPDATE books set TITLE = ?, BOOK = ?, PAGE = ?, KEY = ? WHERE KEY = ?';			
	db.run(sql, data, function(err) {
	if (err) {
		res.send(err.message);
		return;
	}
	else{
		res.render('updateinfo', {data: req.body});
	}});
    
	db.close();
});
//when the user navigates to the delete page from the index 
app.get('/delete', urlencodedParser, function(req,res){

    res.render('delete', {qs: req.query});

});
//when the user clicks submit on the delete page
app.post('/delete', urlencodedParser, function(req,res){
	let db = new sqlite3.Database('books.db');
	let dataDelete = [req.body.key]
	let sqlDelete = 'DELETE FROM books WHERE key = ?';
	db.run(sqlDelete, dataDelete, function(err) {
	if (err) {
		res.send(err.message);
		return;
	}
	else{
		res.render('deleteinfo', {data: req.body});
	}});
	db.close();
});


app.get('/books',function(req,res){
	    let db = new sqlite3.Database('books.db');
        res.write('<h2>' +  'BOOK LIST' + '</h2>');
	
		db.all("SELECT TITLE, BOOK, PAGE, KEY FROM books ORDER BY KEY ASC", function(err, rows){
		  for(var i=0; i<rows.length; i++){
			  res.write('<p>' + "TITLE: " + rows[i].TITLE + " BOOK: " + rows[i].BOOK + " PAGE: " + rows[i].PAGE + " KEY: " + rows[i].KEY + '</p>');
		  }	  
		//need this last line or it hangs because of something about res.write works as an asynchronous function
		res.end() 
		});
		
		db.close();

		
});

app.get('/search', urlencodedParser, function(req,res){

    res.render('search', {qs: req.query});

});

app.post('/search', urlencodedParser, function(req,res){
	let db = new sqlite3.Database('books.db');
	let data = [req.body.title, req.body.book, req.body.page, req.body.key]
	let sql = 'SELECT TITLE, BOOK, PAGE, KEY FROM books WHERE TITLE = ? OR BOOK = ? OR PAGE = ? OR KEY = ? ORDER BY KEY ASC';	
    res.write('<h2>' +  'BOOK LIST' + '</h2>');
	//runs the search query and returns results of the search 
	db.all(sql, data, function(err, rows) {
	for(var i=0; i<rows.length; i++){		
			  res.write('<p>' + "TITLE: " + rows[i].TITLE + " BOOK: " + rows[i].BOOK + " PAGE: " + rows[i].PAGE + " KEY: " + rows[i].KEY + '</p>');
		  }	
	
	res.end() 
	});
		
	db.close();
});

//Go to localhost:3000
app.listen(3000);