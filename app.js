

var express = require('express');
var app = express();


// Uses the ejs templating engine
app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));

app.get('/',function(req,res){  
    res.render('index');
});
//Got to localhost:3000
app.listen(3000);
